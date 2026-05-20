# 新世界程序资源共享站
目前主页:https://shinsekai.end0rph1n.icu/resources
Shinsekai Resource Sharing Station — MiniMax TTS API 代理服务，支持用户自助注册、余额管理、API Key 管理、Stripe 充值，以及可扩展的资源目录。

## 架构

```
浏览器 ─→ Cloudflare Workers (前端)
              ├─ 静态页面（HTML/CSS/JS）
              └─ /api/* /auth/* /charge/* … → 代理 ─→ VPS (后端 FastAPI)
```

| 层 | 运行位置 | 职责 |
|----|---------|------|
| 前端 | Cloudflare Workers | 静态页面 + API 反向代理 |
| 后端 | VPS | JSON API、认证、TTS 代理、Stripe 回调 |

---

## 技术栈

| 层级 | 选型 |
|------|------|
| 后端框架 | FastAPI (async) |
| ORM | SQLAlchemy 2.0 (async) |
| 数据库 | SQLite (aiosqlite) |
| 迁移 | Alembic |
| 密码 | bcrypt (passlib) |
| 认证 | JWT (HS256 access + refresh 双令牌) |
| 校验 | Pydantic v2 |
| 限流 | slowapi |
| HTTP 转发 | httpx (async) |
| 支付 | Stripe Checkout (嵌入式) |
| 前端部署 | Cloudflare Workers |
| 前端样式 | 纯 CSS（Sakura 粉色主题） |

---

# 后端部署（VPS）

## 1. 环境准备

```bash
git clone https://github.com/End0rph1nww/shinsekai-resource.git
cd shinsekai-resource
pip install -r requirements.txt
```

## 2. 配置文件

```bash
cp .env.example .env
```

编辑 `.env`，填写以下必填项：

```ini
# 必须修改
SECRET_KEY=随机生成一个长字符串
UPSTREAM_API_KEY=你的MiniMax真实APIKey
ADMIN_TOKEN=管理后台登录Token

# Stripe 支付（可选，不填则充值不可用）
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://你的实际域名
```

全部环境变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接串 | `sqlite+aiosqlite:///./app.db` |
| `SECRET_KEY` | JWT 签名密钥 | **必须修改** |
| `UPSTREAM_BASE_URL` | 上游 API 地址 | `https://api.minimaxi.com/v1` |
| `UPSTREAM_API_KEY` | 上游真实 API Key | **必须填写** |
| `UPSTREAM_GROUP_ID` | MiniMax GroupId（可选） | 空 |
| `PROXY_TIMEOUT` | 上游请求超时（秒） | 60 |
| `API_KEY_PREFIX` | 签发 Key 的前缀 | `sk-sn-` |
| `ADMIN_TOKEN` | 管理后台登录 Token | **必须修改** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | access_token 有效期 | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | refresh_token 有效期 | 7 |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | 空（不启用） |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名密钥 | 空 |
| `SITE_URL` | 外部访问地址（Stripe 回调用） | `http://localhost:8765` |

## 3. 数据库初始化

```bash
# Linux / macOS
export PYTHONPATH=$PWD
alembic upgrade head

# Windows PowerShell
$env:PYTHONPATH = $PWD
alembic upgrade head
```

## 4. 启动服务

### 开发测试

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8765
```

### 生产环境（systemd）

```bash
sudo nano /etc/systemd/system/shinsekai-resource.service
```

```ini
[Unit]
Description=Shinsekai Resource Station
After=network.target

[Service]
User=www-data
WorkingDirectory=/home/your-user/shinsekai-resource
Environment="PYTHONPATH=/home/your-user/shinsekai-resource"
ExecStart=/usr/bin/uvicorn app.main:app --host 127.0.0.1 --port 8765
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now shinsekai-resource
```

### 安全建议

- 后端仅监听 `127.0.0.1`，不暴露公网端口
- 前端 Worker 通过内网或 Cloudflare Tunnel 连接后端
- 如必须监听公网，在防火墙仅放行 Cloudflare IP 段

---

# 前端部署（Cloudflare Workers）

前端代码在 `frontend/` 目录，是一个 Cloudflare Worker，负责：

- 提供所有静态页面（HTML/CSS/JS）
- 将以 `/api/`、`/auth/`、`/charge/` 等开头的请求代理到 VPS 后端
- 同域访问，无需配置 CORS

## 1. 安装 Wrangler

```bash
npm install -g wrangler
```

## 2. 配置后端地址

编辑 `frontend/wrangler.toml`：

```toml
name = "shinsekai-resource"
main = "src/worker.js"
compatibility_date = "2026-05-16"

[env.production]
vars = { BACKEND_URL = "http://你的VPS-IP:8765" }
```

## 3. 修改 Stripe 公钥

编辑 `frontend/src/worker.js`，搜索 `pk_test_`，替换为你的 Stripe 公钥：

- 测试：`pk_test_...`（Stripe Dashboard → Developers → API keys）
- 生产：`pk_live_...`

## 4. 部署

```bash
cd frontend

# 登录 Cloudflare（首次）
wrangler login

# 部署
wrangler deploy
```

部署后会得到 `https://shinsekai-resource.你的账号.workers.dev`。

## 5. 绑定自定义域名（可选）

在 Cloudflare Dashboard → Workers → shinsekai-resource → Triggers → Custom Domains，绑定你自己的域名。

---

## 页面与 API

### 公开页面

| 页面 | 地址 | 说明 |
|------|------|------|
| 主页 | `/` | 服务介绍、资源计数 |
| 语音库 | `/voices` | Voice ID 目录，搜索和标签筛选 |
| 资源下载 | `/resources` | 角色包 & 背景包，社区上传 |
| 充值 | `/charge` | 嵌入式 Stripe Checkout |
| 注册 | `/register` | 用户自助注册 |
| 登录 | `/login` | 用户登录 |
| 控制台 | `/console` | 余额 / API Key / BASE URL |
| 管理后台 | `/admin/web` | 管理员后台（需 ADMIN_TOKEN） |

### API 端点

#### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册（email + password + nickname） |
| POST | `/auth/login` | 登录，返回 access_token + refresh_token |
| POST | `/auth/refresh` | 用 refresh_token 换取新令牌对 |

#### 用户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/users/me` | 查看当前用户信息和余额（需 JWT） |

#### API Key（需 JWT）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/keys` | 创建 API Key（明文仅返回一次） |
| GET | `/keys` | 列出当前用户所有 Key |
| DELETE | `/keys/{key_id}` | 撤销指定 Key |

#### TTS 代理（需用户 API Key）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/t2a_v2` | MiniMax TTS 代理（标准路径） |
| POST | `/t2a_v2` | 同上（无前缀，兼容旧客户端） |

#### 充值（需 JWT）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/charge` | 充值页面 |
| POST | `/charge/create-session` | 创建 Stripe Checkout 会话 |
| GET | `/charge/success` | Stripe 支付回调 |
| POST | `/charge/webhook` | Stripe Webhook 接收 |

#### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/info` | 返回 API BASE URL、TTS 端点 |
| GET | `/api/resources` | 资源列表（?type=voice / character_pack / background_pack） |
| GET | `/health` | 服务健康检查 |

---

## 接入方式

用户注册后，在控制台获取 API Key 和 BASE URL：

```python
import httpx

resp = httpx.post(
    "https://your-domain/v1/t2a_v2",
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

---

## 安全说明

- 上游真实 API KEY 仅存在于 VPS 环境变量，不经过任何响应体
- 用户 API Key 以 SHA-256 哈希存储，明文仅在创建时返回一次
- 管理后台通过独立 ADMIN_TOKEN 保护，与用户系统完全隔离
- 前端 Worker 代理 API 请求，隐藏 VPS 真实 IP
- Stripe 支付通过 Webhook 兜底，防止余额丢失
