# 开发规划

## 已完成

- [x] **v0.1.0 骨架** — FastAPI + SQLAlchemy 2.0 async + Alembic 迁移
- [x] 用户模型 `User`（email, nickname, balance, used_total, is_active, is_superuser）
- [x] 认证系统 — bcrypt 密码哈希，JWT access+refresh 双令牌
- [x] 限流 — slowapi 60req/min
- [x] Git 版本管理

## 下一步候选

### 资源模块
- [ ] `Resource` 模型（voice_id, display_name, type, tags, metadata_json）
- [ ] 资源 CRUD API（管理员增删改，用户只读列表/详情）
- [ ] 资源搜索与分页（模糊搜索 + 标签过滤）

### 用户模块
- [ ] `GET /users/me` — 查看个人信息、余额、用量
- [ ] `PATCH /users/me` — 修改昵称、密码
- [ ] JWT 依赖注入中间件 `get_current_user`

### API Key 模块
- [ ] `ApiKey` 模型（key_hash, user_id, name, rate_limit, is_active）
- [ ] API Key 生成/管理（用户自服务 + 管理员管理）
- [ ] API Key 认证中间件
- [ ] API Key 级限流

### 计费模块
- [ ] 充值记录 `Transaction` 模型
- [ ] 调用日志 `UsageLog` 模型
- [ ] 余额预扣 + 回调扣费
- [ ] 用量统计 API

### 管理后台
- [ ] Jinja2 + Tailwind 管理面板
- [ ] 管理员登录
- [ ] 用户管理（列表/封禁/充值）
- [ ] 资源管理
- [ ] 用量监控

### 部署
- [ ] Docker 化
- [ ] PostgreSQL 生产配置
- [ ] Nginx 反向代理
- [ ] HTTPS
