# 开发规划

## 已完成

### v0.1.0 — 骨架
- [x] FastAPI + SQLAlchemy 2.0 async + Alembic 迁移
- [x] 用户模型 `User`（email, nickname, balance, used_total, is_active, is_superuser）
- [x] 认证系统 — bcrypt 密码哈希，JWT access+refresh 双令牌
- [x] 限流 — slowapi 60req/min
- [x] Git 版本管理

### v0.2.0 — MiniMax TTS 代理
- [x] `ApiKey` 模型（key_hash、key_prefix、user_id、is_active、last_used_at）
- [x] API Key 管理端点 `POST/GET/DELETE /keys`（JWT 认证，明文仅返回一次）
- [x] MiniMax `t2a_v2` 代理（`POST /v1/t2a_v2` + `/t2a_v2` 兼容双路由）
- [x] 按字符数计费：余额检查 → 转发上游 → 成功后扣费
- [x] `UsageLog` 模型（user_id、api_key_id、chars、text_preview）
- [x] 上游 BASE URL / API KEY 通过环境变量配置，不暴露给用户
- [x] SHA-256 哈希存储 API Key，支持快速前缀校验

### v0.3.0 — 管理后台
- [x] Jinja2 + Tailwind CSS 管理面板（与 minimax-proxy 风格一致）
- [x] Cookie admin_token 登录鉴权
- [x] 仪表盘：用户总数、今日请求、今日字符、总消耗（5 秒自动刷新）
- [x] 用户管理：列表 / 余额充值 / 启用禁用
- [x] 用量日志：最近 200 条记录（10 秒自动刷新）

### v0.4.0 — 用户主页与门户
- [x] `Resource` 模型（type、resource_id、display_name、description、tags、preview_url、sort_order）
- [x] 公开主页 `/`：英雄区 + 三步接入 + 代码示例（自动填充真实 BASE URL）
- [x] 语音库 `/voices`：卡片网格 + 标签筛选 + 搜索 + 一键复制 Voice ID + 试听占位
- [x] 用户控制台 `/console`：余额显示 / API Key 管理 / BASE URL 复制 / 代码示例（JWT LocalStorage 认证）
- [x] 登录 `/login`、注册 `/register`（注册后自动登录）
- [x] 公开接口 `GET /info`（返回 API BASE URL、TTS 端点、文档地址）
- [x] 公开接口 `GET /api/resources`（资源列表，支持 type 筛选）
- [x] 认证接口 `GET /users/me`（查看自己的账户信息和余额）

---

## 下一步候选

### 资源管理（管理后台补全）
- [ ] 管理后台新增"资源管理"页面（Voice ID 录入、编辑、上下架）
- [ ] 批量导入 Voice ID（CSV 或 JSON）

### 充值模块
- [ ] 选定支付接入方案（虎皮椒 / Payjs / 其他）
- [ ] `Transaction` 充值记录模型
- [ ] 充值 Webhook 处理 + 余额更新

### 用户模块完善
- [ ] `PATCH /users/me` — 修改昵称、密码
- [ ] 控制台用量图表（按日统计折线图）

### 扩展资源类型
- [ ] 其他资源类型（模型、图片等）接入门户展示
- [ ] 资源详情页

### 部署
- [ ] Docker 化（Dockerfile + docker-compose）
- [ ] PostgreSQL 生产配置切换
- [ ] Nginx 反向代理 + HTTPS
- [ ] 生产环境 .env 模板

---

## 数据库表结构（当前）

```
users          — 用户账户（余额、认证信息）
api_keys       — 用户持有的 API Key（哈希存储）
usage_logs     — TTS 调用记录（字符数、预览文本）
resources      — 可扩展资源目录（voice / model / 其他）
```

## 环境变量（当前）

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接串 | `sqlite+aiosqlite:///./app.db` |
| `SECRET_KEY` | JWT 签名密钥 | 必须修改 |
| `UPSTREAM_BASE_URL` | 上游 API BASE URL | `https://api.minimaxi.com/v1` |
| `UPSTREAM_API_KEY` | 上游真实 API Key | 必须填写 |
| `UPSTREAM_GROUP_ID` | MiniMax GroupId（可选） | 空 |
| `PROXY_TIMEOUT` | 上游请求超时（秒） | 60 |
| `API_KEY_PREFIX` | 签发 Key 的前缀 | `sk-sn-` |
| `ADMIN_TOKEN` | 管理后台登录 Token | 必须修改 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | access_token 有效期 | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | refresh_token 有效期 | 7 |
