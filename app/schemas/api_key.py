"""ApiKey Pydantic 校验模型"""

from datetime import datetime
from pydantic import BaseModel, Field


class ApiKeyCreate(BaseModel):
    name: str = Field(default="", max_length=100, description="API Key 标签，便于区分")


class ApiKeyOut(BaseModel):
    """列表展示用（不含 hash，不含明文）"""
    id: int
    name: str
    key_prefix: str
    is_active: bool
    last_used_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ApiKeyCreatedResponse(ApiKeyOut):
    """创建时额外返回明文 key（唯一一次）"""
    key: str = Field(..., description="API Key 明文，仅此一次，请妥善保存")
