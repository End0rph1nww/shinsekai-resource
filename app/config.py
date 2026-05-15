"""应用配置，从 .env / 环境变量加载"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./app.db"
    secret_key: str = "change-me-to-a-random-secret-string"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # 上游代理配置（服务端专用，不暴露给用户）
    upstream_base_url: str = "https://api.minimaxi.com/v1"
    upstream_api_key: str = ""
    upstream_group_id: str = ""   # MiniMax GroupId，可选
    proxy_timeout: float = 60.0

    # 我们签发的 API Key 前缀
    api_key_prefix: str = "sk-sn-"

    # 管理后台 Token
    admin_token: str = "change-me-admin-token"

    # Stripe 支付
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    site_url: str = "http://localhost:8765"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
