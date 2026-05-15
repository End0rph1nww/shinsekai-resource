"""用户门户路由：公开主页、资源库、用户控制台页面 + JSON API"""

import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.deps import get_current_user
from app.database import get_db
from app.models.api_key import ApiKey
from app.models.resource import Resource
from app.models.user import User

router = APIRouter()

_templates_dir = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(_templates_dir))


# ── 公开页面 ────────────────────────────────────────────────

@router.get("/", response_class=HTMLResponse, include_in_schema=False)
async def homepage(request: Request, db: AsyncSession = Depends(get_db)):
    voices = (await db.execute(
        select(Resource).where(Resource.type == "voice", Resource.is_active == True)  # noqa: E712
    )).scalars().all()
    char_count = (await db.execute(
        select(Resource).where(Resource.type == "character_pack", Resource.is_active == True)  # noqa: E712
    )).scalars().all()
    bg_count = (await db.execute(
        select(Resource).where(Resource.type == "background_pack", Resource.is_active == True)  # noqa: E712
    )).scalars().all()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "voices_count": len(voices),
        "character_count": len(char_count),
        "background_count": len(bg_count),
    })


@router.get("/voices", response_class=HTMLResponse, include_in_schema=False)
async def voices_page(request: Request):
    return templates.TemplateResponse("voices.html", {"request": request})


@router.get("/login", response_class=HTMLResponse, include_in_schema=False)
async def login_page(request: Request):
    return templates.TemplateResponse("user_login.html", {"request": request})


@router.get("/register", response_class=HTMLResponse, include_in_schema=False)
async def register_page(request: Request):
    return templates.TemplateResponse("user_register.html", {"request": request})


@router.get("/resources", response_class=HTMLResponse, include_in_schema=False)
async def resources_page(request: Request):
    return templates.TemplateResponse("resources.html", {"request": request})


@router.get("/console", response_class=HTMLResponse, include_in_schema=False)
async def console_page(request: Request):
    return templates.TemplateResponse("console.html", {"request": request})


# ── 公开 JSON API ───────────────────────────────────────────

@router.get("/health", tags=["系统"])
async def health():
    """服务健康检查"""
    return {"service": "shinsekai-resource", "version": "0.1.0", "status": "ok"}


@router.get("/info", tags=["系统"])
async def service_info(request: Request):
    """返回接入所需的公开信息：BASE URL、文档地址"""
    base = str(request.base_url).rstrip("/")
    return {
        "api_base_url": f"{base}/v1",
        "tts_endpoint": f"{base}/v1/t2a_v2",
        "docs_url": f"{base}/docs",
        "note": "将 OPENAI_BASE_URL 或 BASE_URL 设置为 api_base_url，使用你的 API Key 作为 Bearer Token。",
    }


@router.get("/api/resources", tags=["资源"])
async def list_resources(
    type: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """公开资源列表（语音库等）"""
    query = select(Resource).where(Resource.is_active == True)  # noqa: E712
    if type:
        query = query.where(Resource.type == type)
    query = query.order_by(Resource.sort_order, Resource.id)
    rows = (await db.execute(query)).scalars().all()
    return [
        {
            "id": r.id,
            "type": r.type,
            "resource_id": r.resource_id,
            "display_name": r.display_name,
            "description": r.description,
            "tags": json.loads(r.tags) if r.tags else [],
            "preview_url": r.preview_url,
            "download_url": r.download_url,
        }
        for r in rows
    ]


# ── 认证用户 JSON API ───────────────────────────────────────

@router.get("/users/me", tags=["用户"])
async def get_me(current_user: User = Depends(get_current_user)):
    """查看自己的账户信息和余额"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "nickname": current_user.nickname,
        "balance": current_user.balance,
        "used_total": current_user.used_total,
        "is_active": current_user.is_active,
    }
