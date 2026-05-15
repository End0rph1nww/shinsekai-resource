"""TTS 代理端点：转发 MiniMax t2a_v2，按字符数扣余额"""

from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.deps import get_current_user_by_api_key
from app.database import get_db
from app.models.api_key import ApiKey
from app.models.usage_log import UsageLog
from app.models.user import User

router = APIRouter(tags=["代理"])


def _upstream_url() -> str:
    base = settings.upstream_base_url.rstrip("/")
    url = f"{base}/t2a_v2"
    if settings.upstream_group_id:
        url += f"?GroupId={settings.upstream_group_id}"
    return url


def _upstream_headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.upstream_api_key}",
        "Content-Type": "application/json",
    }


async def _tts_handler(request: Request, db: AsyncSession):
    """核心 TTS 转发逻辑：校验余额 → 转发 → 扣费 + 记录"""
    # 从请求头取 API Key 并认证
    api_key: ApiKey = await get_current_user_by_api_key(request, db)
    user: User = api_key.user

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请求体格式错误")

    text: str = body.get("text", "")
    if not text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="text 字段不能为空")

    chars = len(text)
    if user.balance < chars:
        raise HTTPException(
            status_code=402,
            detail=f"余额不足：需要 {chars} 字符，剩余 {user.balance} 字符",
        )

    # 转发到上游（真实 key 只在服务端）
    async with httpx.AsyncClient(timeout=settings.proxy_timeout) as client:
        try:
            resp = await client.post(_upstream_url(), json=body, headers=_upstream_headers())
        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="上游请求超时")
        except httpx.RequestError:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="上游连接失败")

    # 只在上游成功时扣余额、写日志
    if resp.status_code == 200:
        now = datetime.now(timezone.utc)
        await db.execute(
            update(User)
            .where(User.id == user.id)
            .values(balance=User.balance - chars, used_total=User.used_total + chars)
        )
        await db.execute(
            update(ApiKey).where(ApiKey.id == api_key.id).values(last_used_at=now)
        )
        db.add(UsageLog(
            user_id=user.id,
            api_key_id=api_key.id,
            chars=chars,
            text_preview=text[:100],
        ))
        await db.commit()

    return JSONResponse(content=resp.json(), status_code=resp.status_code)


@router.post("/v1/t2a_v2")
async def proxy_tts_v1(request: Request, db: AsyncSession = Depends(get_db)):
    """转发 MiniMax t2a_v2（带 /v1 前缀）"""
    return await _tts_handler(request, db)


@router.post("/t2a_v2")
async def proxy_tts(request: Request, db: AsyncSession = Depends(get_db)):
    """转发 MiniMax t2a_v2（无前缀，兼容 Shinsekai 插件直连）"""
    return await _tts_handler(request, db)
