"""资源模型 — 支持多种类型（voice、model 等）"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)       # "voice" | "model" | ...
    resource_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)  # 上游 ID，如 voice_id
    display_name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    tags: Mapped[str] = mapped_column(Text, nullable=False, default="[]")           # JSON array string
    preview_url: Mapped[str | None] = mapped_column(String(500), nullable=True)     # 试听 URL，暂为空
    download_url: Mapped[str | None] = mapped_column(String(500), nullable=True)    # 下载链接（角色包/背景包）
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
