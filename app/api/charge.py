"""Stripe Checkout 充值路由"""

from pathlib import Path

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.deps import get_current_user
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/charge", tags=["充值"])

_templates_dir = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(_templates_dir))


class CreateSessionBody(BaseModel):
    amount: float  # CNY 金额，如 10.00


@router.get("", response_class=HTMLResponse, include_in_schema=False)
async def charge_page(request: Request):
    return templates.TemplateResponse("charge.html", {"request": request})


@router.post("/create-session")
async def create_checkout_session(
    body: CreateSessionBody,
    request: Request,
    current_user: User = Depends(get_current_user),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe 未配置")

    if body.amount < 1:
        raise HTTPException(status_code=400, detail="充值金额不能低于 1 元")

    amount_cents = int(body.amount * 100)

    session = stripe.checkout.Session.create(
        api_key=settings.stripe_secret_key,
        mode="payment",
        ui_mode="embedded_page",
        line_items=[{
            "price_data": {
                "currency": "cny",
                "product_data": {"name": "账户充值"},
                "unit_amount": amount_cents,
            },
            "quantity": 1,
        }],
        metadata={
            "user_id": str(current_user.id),
            "amount_yuan": str(body.amount),
        },
        return_url=f"{settings.site_url}/charge/success?session_id={{CHECKOUT_SESSION_ID}}",
    )

    return {"client_secret": session.client_secret}


@router.get("/success", response_class=HTMLResponse, include_in_schema=False)
async def charge_success(request: Request, session_id: str, db: AsyncSession = Depends(get_db)):
    """Stripe 支付成功后的返回页"""
    if not settings.stripe_secret_key:
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "error": "Stripe 未配置",
        })

    try:
        session = stripe.checkout.Session.retrieve(
            session_id,
            api_key=settings.stripe_secret_key,
        )
    except Exception:
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "error": "无法查询支付状态",
        })

    if session.payment_status != "paid":
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "error": f"支付状态异常: {session.payment_status}",
        })

    # StripeObject 不支持 .get()，用方括号取值
    try:
        user_id = session["metadata"]["user_id"]
        amount_yuan = session["metadata"]["amount_yuan"]
    except Exception:
        user_id = ""
        amount_yuan = ""
    if not user_id or not amount_yuan:
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "error": "订单信息不完整",
        })

    # 幂等：同一个 session 不重复加余额
    already_processed = getattr(request.app.state, "processed_sessions", set())
    if session_id in already_processed:
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "success": True,
            "amount": amount_yuan,
            "duplicate": True,
        })

    from sqlalchemy import select
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        return templates.TemplateResponse("charge.html", {
            "request": request,
            "error": "用户不存在",
        })

    user.balance += float(amount_yuan)
    await db.commit()

    if not hasattr(request.app.state, "processed_sessions"):
        request.app.state.processed_sessions = set()
    request.app.state.processed_sessions.add(session_id)

    return templates.TemplateResponse("charge.html", {
        "request": request,
        "success": True,
        "amount": amount_yuan,
    })


@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Stripe Webhook — 支付成功的可靠回调"""
    if not settings.stripe_secret_key or not settings.stripe_webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe 未配置")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="无效的签名")

    if event.type == "checkout.session.completed":
        session = event.data.object
        if session.payment_status != "paid":
            return {"received": True}

        try:
            meta = session["metadata"]
            user_id = meta.get("user_id", "") if isinstance(meta, dict) else ""
            amount_yuan = meta.get("amount_yuan", "") if isinstance(meta, dict) else ""
        except Exception:
            user_id = ""
            amount_yuan = ""
        if not user_id or not amount_yuan:
            return {"received": True}

        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()
        if user:
            user.balance += float(amount_yuan)
            await db.commit()

    return {"received": True}
