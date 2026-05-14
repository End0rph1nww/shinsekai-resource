"""用户 Pydantic 校验模型"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr = Field(..., description="注册邮箱")
    password: str = Field(..., min_length=8, max_length=128, description="密码，8-128 字符")
    nickname: str = Field(default="", max_length=100, description="昵称")


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="登录邮箱")
    password: str = Field(..., description="密码")


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., description="刷新令牌")


class UserOut(BaseModel):
    """返回给前端的用户信息（脱敏，不含密码）"""
    id: int
    email: str
    nickname: str
    balance: int
    used_total: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
