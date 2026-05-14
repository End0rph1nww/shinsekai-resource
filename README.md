# 新世界程序资源共享站

Shinsekai Resource Sharing Station — 面向用户的资源共享与 API 代理服务。

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | FastAPI (async) |
| ORM | SQLAlchemy 2.0 (async) |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| 迁移 | Alembic (autogenerate) |
| 密码 | bcrypt (passlib) |
| 认证 | JWT (HS256 access + refresh 双令牌) |
| 校验 | Pydantic v2 |
| 限流 | slowapi |

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 复制并编辑配置
copy .env.example .env

# 数据库迁移（使用 PYTHONPATH 确保 app 模块可导入）
$env:PYTHONPATH = $PWD
alembic upgrade head

# 启动
$env:PYTHONPATH = $PWD
uvicorn app.main:app --reload
```

服务启动后：
- Swagger 文档：http://localhost:8000/docs
- ReDoc 文档：http://localhost:8000/redoc

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 用户注册（email + password + nickname） |
| POST | `/auth/login` | 登录，返回 access_token + refresh_token |
| POST | `/auth/refresh` | 用 refresh_token 换取新令牌对 |
| GET | `/` | 服务健康检查 |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接串 | `sqlite+aiosqlite:///./app.db` |
| `SECRET_KEY` | JWT 签名密钥 | 必须修改 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | access_token 有效期 | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | refresh_token 有效期 | 7 |
