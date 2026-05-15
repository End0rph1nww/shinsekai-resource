"""新世界程序资源共享站 — FastAPI 入口"""

from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.keys import router as keys_router
from app.api.portal import router as portal_router
from app.api.proxy import router as proxy_router
from app.database import Base, engine
import app.models.api_key   # noqa: F401
import app.models.usage_log  # noqa: F401
import app.models.resource   # noqa: F401

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用启动时建表、创建全局 httpx client；关闭时释放连接"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    app.state.http_client = httpx.AsyncClient()
    yield
    await app.state.http_client.aclose()


app = FastAPI(
    title="新世界程序资源共享站",
    description="Shinsekai Resource Sharing Station — 用户注册、充值、API 代理",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portal_router)   # 最先注册，/ 路由在此
app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(keys_router)
app.include_router(proxy_router)
