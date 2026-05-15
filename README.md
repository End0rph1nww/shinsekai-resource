# 新世界程序资源共享站

Shinsekai Resource Sharing Station — MiniMax TTS API 代理服务，支持用户自助注册、余额管理、API Key 管理，以及可扩展的资源目录。

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | FastAPI (async) |
| ORM | SQLAlchemy 2.0 (async) |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| 迁移 | Alembic |
| 密码 | bcrypt (passlib) |
| 认证 | JWT (HS256 access + refresh 双令牌) |
| 校验 | Pydantic v2 |
| 限流 | slowapi |
| HTTP 转发 | httpx (async) |
| 前端模板 | Jinja2 + Tailwind CSS (CDN) |

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 复制并编辑配置
copy .env.example .env
# 必须填写：SECRET_KEY、UPSTREAM_API_KEY、ADMIN_TOKEN

# 数据库迁移
$env:PYTHONPATH = $PWD
alembic upgrade head

# 启动
$env:PYTHONPATH = $PWD
uvicorn app.main:app --reload
```

## 页面地址

| 页面 | 地址 | 说明 |
|------|------|------|
| 主页 | `/` | 服务介绍 + 快速接入示例 |
| 语音库 | `/voices` | 可用 Voice ID 目录，支持搜索和标签筛选 |
| 注册 | `/register` | 用户自助注册 |
| 登录 | `/login` | 用户登录 |
| 控制台 | `/console` | 余额 / API Key / BASE URL 管理 |
| 管理后台 | `/admin/web` | 管理员后台（需 ADMIN_TOKEN） |
| API 文档 | `/docs` | Swagger 自动文档 |

## API 端点

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（email + password + nickname） |
| POST | `/auth/login` | 登录，返回 access_token + refresh_token |
| POST | `/auth/refresh` | 用 refresh_token 换取新令牌对 |

### 用户
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/users/me` | 查看当前用户信息和余额（需 JWT） |

### API Key 管理（需 JWT）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/keys` | 创建 API Key（明文仅返回一次） |
| GET | `/keys` | 列出当前用户所有 Key |
| DELETE | `/keys/{key_id}` | 撤销指定 Key |

### 代理（需用户 API Key）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/t2a_v2` | MiniMax TTS 代理（标准路径） |
| POST | `/t2a_v2` | 同上（无前缀，兼容旧客户端） |

### 公开接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/info` | 返回 API BASE URL、TTS 端点地址 |
| GET | `/api/resources` | 资源列表（?type=voice 等） |
| GET | `/health` | 服务健康检查 |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接串 | `sqlite+aiosqlite:///./app.db` |
| `SECRET_KEY` | JWT 签名密钥 | **必须修改** |
| `UPSTREAM_BASE_URL` | 上游 API BASE URL | `https://api.minimaxi.com/v1` |
| `UPSTREAM_API_KEY` | 上游真实 API Key | **必须填写** |
| `UPSTREAM_GROUP_ID` | MiniMax GroupId（可选） | 空 |
| `PROXY_TIMEOUT` | 上游请求超时（秒） | 60 |
| `API_KEY_PREFIX` | 签发 Key 的前缀 | `sk-sn-` |
| `ADMIN_TOKEN` | 管理后台登录 Token | **必须修改** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | access_token 有效期 | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | refresh_token 有效期 | 7 |

## 接入方式

用户注册后，在控制台获取 API Key 和 BASE URL，按如下方式调用：

```python
import httpx

resp = httpx.post(
    "https://your-server/v1/t2a_v2",
    headers={"Authorization": "Bearer sk-sn-your-api-key"},
    json={
        "model": "speech-01-turbo",
        "text": "你好，这是一段测试语音。",
        "voice_setting": {"voice_id": "female-shaonv", "speed": 1.0},
    },
)
data = resp.json()  # 返回含 base64 音频的 JSON
```

余额按实际字符数扣除，不足时返回 `402`。

## 安全说明

- 上游真实 BASE URL 和 API KEY 仅存在于服务端环境变量，不经过任何响应体
- 用户 API Key 以 SHA-256 哈希存储，明文仅在创建时返回一次
- 管理后台通过独立 ADMIN_TOKEN 保护，与用户系统完全隔离
