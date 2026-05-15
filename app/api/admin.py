"""管理后台：Jinja2 页面 + JSON API（Cookie admin_token 鉴权）"""

from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Cookie, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.api_key import ApiKey
from app.models.usage_log import UsageLog
from app.models.user import User

router = APIRouter(prefix="/admin")

_templates_dir = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(_templates_dir))

COOKIE_NAME = "admin_token"


def _check_cookie(token: str | None) -> bool:
    return bool(token and token == settings.admin_token)


# ── 页面路由 ────────────────────────────────────────────────

@router.get("/web/login", response_class=HTMLResponse)
async def login_page(request: Request, error: str | None = None):
    return templates.TemplateResponse("login.html", {"request": request, "error": error})


@router.post("/web/login", response_class=HTMLResponse)
async def login_action(request: Request, token: str = Form(...)):
    if token != settings.admin_token:
        return templates.TemplateResponse("login.html", {"request": request, "error": "Token 错误"})
    resp = RedirectResponse("/admin/web", status_code=303)
    resp.set_cookie(COOKIE_NAME, token, httponly=True, samesite="lax")
    return resp


@router.get("/web/logout")
async def logout():
    resp = RedirectResponse("/admin/web/login", status_code=303)
    resp.delete_cookie(COOKIE_NAME)
    return resp


@router.get("/web", response_class=HTMLResponse)
async def dashboard(request: Request, admin_token: str | None = Cookie(default=None)):
    if not _check_cookie(admin_token):
        return RedirectResponse("/admin/web/login", status_code=303)
    return templates.TemplateResponse("dashboard.html", {"request": request})


@router.get("/web/users", response_class=HTMLResponse)
async def users_page(request: Request, admin_token: str | None = Cookie(default=None)):
    if not _check_cookie(admin_token):
        return RedirectResponse("/admin/web/login", status_code=303)
    return templates.TemplateResponse("users.html", {"request": request})


@router.get("/web/logs", response_class=HTMLResponse)
async def logs_page(request: Request, admin_token: str | None = Cookie(default=None)):
    if not _check_cookie(admin_token):
        return RedirectResponse("/admin/web/login", status_code=303)
    return templates.TemplateResponse("logs.html", {"request": request})


# ── JSON API（供前端 JS 调用） ──────────────────────────────

def _require_admin(request: Request) -> None:
    auth = request.headers.get("Authorization", "")
    token = auth.removeprefix("Bearer ").strip() if auth.startswith("Bearer ") else ""
    # 同时支持 Cookie（页面直接 fetch）和 Bearer header
    cookie = request.cookies.get(COOKIE_NAME, "")
    if token != settings.admin_token and cookie != settings.admin_token:
        raise HTTPException(status_code=401, detail="未授权")


@router.get("/web/api/stats")
async def api_stats(request: Request):
    _require_admin(request)
    db: AsyncSession
    async with __import__("app.database", fromlist=["async_session"]).async_session() as db:
        total_users = (await db.execute(select(func.count()).select_from(User))).scalar_one()
        total_chars = (await db.execute(select(func.coalesce(func.sum(User.used_total), 0)))).scalar_one()
        today = datetime.now(timezone.utc).date().isoformat()
        today_requests = (await db.execute(
            select(func.count()).select_from(UsageLog).where(func.date(UsageLog.created_at) == today)
        )).scalar_one()
        today_chars = (await db.execute(
            select(func.coalesce(func.sum(UsageLog.chars), 0)).where(func.date(UsageLog.created_at) == today)
        )).scalar_one()
    return {"total_users": total_users, "total_chars": total_chars, "today_requests": today_requests, "today_chars": today_chars}


@router.get("/web/api/users")
async def api_users(request: Request):
    _require_admin(request)
    async with __import__("app.database", fromlist=["async_session"]).async_session() as db:
        rows = (await db.execute(select(User).order_by(User.created_at.desc()))).scalars().all()
    return [{"id": u.id, "email": u.email, "nickname": u.nickname, "balance": u.balance,
             "used_total": u.used_total, "is_active": u.is_active, "created_at": u.created_at.isoformat()} for u in rows]


@router.post("/web/api/users/{user_id}/topup")
async def api_topup(user_id: int, request: Request):
    _require_admin(request)
    body = await request.json()
    amount = int(body.get("amount", 0))
    if amount <= 0:
        raise HTTPException(status_code=400, detail="amount 必须为正整数")
    async with __import__("app.database", fromlist=["async_session"]).async_session() as db:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        await db.execute(update(User).where(User.id == user_id).values(balance=User.balance + amount))
        await db.commit()
        await db.refresh(user)
        return {"id": user.id, "balance": user.balance}


@router.post("/web/api/users/{user_id}/toggle")
async def api_toggle_user(user_id: int, request: Request):
    _require_admin(request)
    async with __import__("app.database", fromlist=["async_session"]).async_session() as db:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        await db.execute(update(User).where(User.id == user_id).values(is_active=not user.is_active))
        await db.commit()
    return {"id": user_id, "is_active": not user.is_active}


@router.get("/web/api/logs")
async def api_logs(request: Request, limit: int = 100):
    _require_admin(request)
    async with __import__("app.database", fromlist=["async_session"]).async_session() as db:
        rows = (await db.execute(
            select(UsageLog, User.email, User.nickname, ApiKey.key_prefix)
            .join(User, UsageLog.user_id == User.id)
            .join(ApiKey, UsageLog.api_key_id == ApiKey.id)
            .order_by(UsageLog.id.desc())
            .limit(limit)
        )).all()
    return [{"id": log.id, "created_at": log.created_at.isoformat(),
             "email": email, "nickname": nickname, "key_prefix": key_prefix,
             "chars": log.chars, "text_preview": log.text_preview}
            for log, email, nickname, key_prefix in rows]
