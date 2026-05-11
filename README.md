
# ✈️ CFII Aviation Intelligence System

一个面向：

- CFII
- 飞行教员
- 通航飞行员
- FAA / NTSB 关注者
- 航空安全研究

的 AI 航空情报系统。

系统会：

1. 自动抓取 RSS
2. AI 自动筛选重要内容
3. AI 自动总结
4. 自动去重
5. 自动生成航空安全简报
6. 自动推送到飞书

---

# 系统功能

## 已实现功能

### RSS 管理

后台地址：

```txt
/dashboard/sources
```

支持：

- 添加 RSS
- 删除 RSS
- 启用/禁用 RSS
- 查看抓取状态
- 查看抓取错误

---

### Prompt 管理

后台地址：

```txt
/dashboard/prompts
```

支持在线修改：

- score prompt
- summary prompt
- digest prompt
- push prompt

无需改代码。

---

### Settings 管理

后台地址：

```txt
/dashboard/settings
```

支持在线修改：

- min_score
- hot_threshold
- context_days
- keep_days
- push_context_days
- llm_model
- fetch_interval_minutes

等配置。

---

### AI 功能

支持：

- AI 评分
- AI 总结
- AI 日报
- AI 结构化输出
- AI 去重

---

### 飞书推送

支持：

- 飞书 Interactive Card
- 风险等级
- 类型分类
- Markdown
- 航空安全卡片 UI

---

### Push Memory

系统会记录：

- 已推送 article
- articleId
- 推送时间

避免重复推送。

---

# 技术栈

## 前端

- Next.js
- React
- TailwindCSS

---

## 后端

- Next.js Route Handler
- Prisma ORM
- PostgreSQL

---

## AI

支持：

- Ollama
- OpenAI
- OpenRouter

---

## 部署

支持：

- Docker
- Docker Compose
- NAS
- Linux

---

# 本地开发

## 1. 安装 Node.js

推荐：

```txt
Node.js 20+
```

下载：

https://nodejs.org

安装完成后测试：

```bash
node -v
npm -v
```

---

## 2. 安装项目依赖

进入项目目录：

```bash
cd my-app
```

安装：

```bash
npm install
```

---

## 3. 配置环境变量

创建：

```txt
.env.local
```

内容：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ainews"

OPENAI_API_KEY=""

FEISHU_WEBHOOK_URL=""

OLLAMA_URL="http://192.168.1.20:11434/api/generate"
```

---

## 4. 启动 PostgreSQL

推荐 Docker：

```bash
docker run --name postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=ainews \
-p 5432:5432 \
-d postgres:16
```

---

## 5. 初始化数据库

执行：

```bash
npx prisma db push
```

然后：

```bash
npx prisma generate
```

---

## 6. 启动项目

```bash
npm run dev
```

打开：

```txt
http://localhost:3000
```

---

# 后台页面

## Dashboard

```txt
/dashboard
```

---

## RSS Sources

```txt
/dashboard/sources
```

---

## Prompts

```txt
/dashboard/prompts
```

---

## Settings

```txt
/dashboard/settings
```

---

# API

## 抓取 RSS

```txt
/api/fetch
```

---

## AI 总结

```txt
/api/top
```

---

## 飞书推送

```txt
/api/push
```

---

# Docker 部署（推荐）

## 1. 安装 Docker

NAS 需要安装：

- Docker
- Docker Compose

---

## 2. 克隆项目

推荐 GitHub：

```bash
git clone YOUR_REPO_URL
```

进入目录：

```bash
cd my-app
```

---

## 3. 创建生产环境变量

创建：

```txt
.env.production
```

内容：

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/ainews

FEISHU_WEBHOOK_URL=

OPENAI_API_KEY=

OLLAMA_URL=http://192.168.1.20:11434/api/generate
```

---

## 4. 启动 Docker

执行：

```bash
docker compose up -d
```

第一次启动会：

- 自动创建 PostgreSQL
- 自动 build Next.js
- 自动启动容器

---

## 5. 初始化数据库

执行：

```bash
docker exec -it cfii-intel sh
```

进入容器后：

```bash
npx prisma db push
```

然后：

```bash
npx prisma generate
```

退出：

```bash
exit
```

---

## 6. 打开系统

浏览器访问：

```txt
http://NAS_IP:3000
```

例如：

```txt
http://192.168.1.100:3000
```

---

# NAS 自动定时任务

系统不会自动抓取。

必须配置 NAS cron。

---

## 1. 给脚本权限

```bash
chmod +x scripts/cron.sh
```

---

## 2. 配置 cron

例如每30分钟执行：

```cron
*/30 * * * * /volume1/docker/ai-news/scripts/cron.sh
```

作用：

1. 抓取 RSS
2. AI 总结
3. AI 推送

---

# 推荐 RSS

推荐航空类：

- FAA
- NTSB
- AVweb
- AOPA
- Aviation Safety
- NASA ASRS
- Boldmethod
- IFR Magazine
- Flying Magazine

---

# 推荐 Prompt 调整

建议 score prompt 增加：

```txt
商业融资
企业宣传
产品发布
营销新闻
AI客服
创业融资
```

降低分数。

---

# 常见问题

## Docker 无法启动

检查：

```bash
docker ps
```

---

## PostgreSQL 连接失败

检查：

```txt
DATABASE_URL
```

是否正确。

---

## 飞书不推送

检查：

```txt
FEISHU_WEBHOOK_URL
```

是否正确。

---

## Ollama 无法访问

检查：

```txt
OLLAMA_URL
```

是否可访问。

---

## RSS 无内容

去：

```txt
/dashboard/sources
```

查看：

- lastFetched
- lastError

---

# 当前系统架构

```txt
RSS
 ↓
Fetch
 ↓
Article
 ↓
AI Score
 ↓
AI Summary
 ↓
Push Memory
 ↓
AI Digest
 ↓
Feishu Card
```

---

# 未来可扩展

未来可增加：

- Discord
- Telegram
- Email
- 多语言
- 向量搜索
- Embedding 去重
- AI Agent
- FAA AD 自动分析
- NTSB 趋势统计
- 飞行训练风险识别

---

# License

Private Internal Project
