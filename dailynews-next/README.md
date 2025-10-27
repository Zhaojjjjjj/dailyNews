# 新闻联播文字稿归档系统 - Next.js 版本

> 基于 Next.js 14 + Vercel Postgres 的现代化新闻爬虫与归档系统

## 📋 项目简介

这是《新闻联播》文字稿归档系统的 Next.js 重构版本，主要特性：

- ✅ **全栈 Next.js 架构** - 使用 App Router 和 Server Components
- ✅ **Vercel Postgres** - 云数据库存储，无需本地文件
- ✅ **自动定时任务** - Vercel Cron Jobs 每天自动爬取
- ✅ **TypeScript** - 类型安全，更好的开发体验
- ✅ **响应式设计** - 完美适配桌面和移动端
- ✅ **SEO 优化** - 服务端渲染，搜索引擎友好

## 🚀 快速开始

### 1. 安装依赖

```bash
cd dailynews-next
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的数据库配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env



```

### 3. 初始化数据库

```bash
# 先安装依赖（包括 dotenv）
npm install

# 运行迁移脚本
npm run db:migrate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

## 📦 部署到 Vercel

### 方式一: 通过 Git 自动部署 (推荐)

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel 中导入仓库
3. 配置环境变量 (在 Vercel 项目设置中)
4. 部署！

### 方式二: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### Vercel 部署配置清单

在 Vercel 项目设置中添加以下环境变量：

1. **数据库配置** (Vercel Postgres)

   - 在 Vercel 项目中创建 Postgres 数据库
   - 会自动注入所有 `POSTGRES_*` 变量
2. **CRON_SECRET**

   - 生成一个随机字符串
   - 用于保护定时任务 API
3. **部署后操作**

   - 访问 `/api/crawler` 验证爬虫功能
   - Vercel Cron 会自动在每天 20:30 (UTC 12:30) 运行

## 🗄️ 数据库设置

### 在 Vercel 创建数据库

1. 进入 Vercel 项目页面
2. Storage → Create Database → Postgres
3. 选择区域 (建议选择离你最近的)
4. 创建完成后会自动注入环境变量

### 本地连接 Vercel Postgres

```bash
# 拉取环境变量到本地
vercel env pull .env.local

# 运行迁移
npm run db:migrate
```

## 📖 API 文档

### 爬虫 API

**POST /api/crawler**

触发爬虫任务 (需要认证)

```bash
# 爬取今天的新闻
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"

# 爬取指定日期
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"date": "20241027"}'

# 强制重新爬取
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"date": "20241027", "force": true}'
```

**GET /api/crawler**

获取爬虫状态

```bash
curl https://your-domain.vercel.app/api/crawler
```

### 新闻列表 API

**GET /api/news**

查询参数：

- `limit`: 获取最新 N 条 (默认 10)
- `all`: 获取所有新闻 (`?all=true`)
- `search`: 搜索关键词 (`?search=keyword`)

```bash
# 获取最新 10 条
curl https://your-domain.vercel.app/api/news?limit=10

# 获取所有新闻
curl https://your-domain.vercel.app/api/news?all=true

# 搜索新闻
curl https://your-domain.vercel.app/api/news?search=关键词
```

### 新闻详情 API

**GET /api/news/[date]**

```bash
curl https://your-domain.vercel.app/api/news/20241027
```

### 统计信息 API

**GET /api/stats**

```bash
curl https://your-domain.vercel.app/api/stats
```

## ⏰ 定时任务配置

### Vercel Cron Jobs

项目已配置 `vercel.json`，会自动在每天 **20:30 (北京时间)** 运行爬虫。

```json
{
  "crons": [
    {
      "path": "/api/crawler",
      "schedule": "30 12 * * *"
    }
  ]
}
```

**注意**: Vercel Cron 使用 UTC 时间，`30 12 * * *` 对应北京时间 20:30。

### Cron 表达式说明

```
30 12 * * *
│  │  │ │ │
│  │  │ │ └─ 星期 (0-7, 0 和 7 都代表周日)
│  │  │ └─── 月份 (1-12)
│  │  └───── 日期 (1-31)
│  └──────── 小时 (0-23, UTC)
└─────────── 分钟 (0-59)
```

## 🧪 测试

### 测试 API

启动开发服务器后，访问：

- http://localhost:3000 - 首页
- http://localhost:3000/archive - 归档页
- http://localhost:3000/news/20241027 - 详情页
- http://localhost:3000/api/stats - 统计 API
- http://localhost:3000/api/news?limit=10 - 新闻列表 API

## 📁 项目结构

```
dailynews-next/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── crawler/            # 爬虫 API
│   │   ├── news/               # 新闻查询 API
│   │   └── stats/              # 统计 API
│   ├── archive/                # 归档页面
│   ├── news/[date]/           # 新闻详情页 (动态路由)
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页
│   └── globals.css            # 全局样式
├── lib/                         # 工具库
│   ├── db.ts                  # 数据库操作
│   └── crawler.ts             # 爬虫逻辑
├── scripts/                     # 脚本
│   ├── migrate.js             # 数据库迁移
│   └── test-crawler.js        # 爬虫测试
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json                  # Vercel 配置 (Cron)
├── .env.example                 # 环境变量示例
└── README.md
```

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **数据库**: Vercel Postgres
- **爬虫**: jsdom + node-fetch
- **Markdown**: marked
- **部署**: Vercel
- **定时任务**: Vercel Cron Jobs

## 🆚 与旧版本对比

| 特性     | 旧版本                   | Next.js 版本           |
| -------- | ------------------------ | ---------------------- |
| 架构     | 静态 HTML + Node.js 脚本 | 全栈 Next.js           |
| 数据存储 | 本地 Markdown 文件       | Vercel Postgres 数据库 |
| 定时任务 | 手动/系统 Cron           | Vercel Cron Jobs       |
| 部署     | 需要服务器               | Vercel 一键部署        |
| 类型安全 | JavaScript               | TypeScript             |
| SEO      | 客户端渲染               | 服务端渲染             |
| 响应速度 | 读取文件                 | 数据库查询 + 缓存      |
| 维护成本 | 需要管理文件             | 云端托管，零维护       |

## 🔒 安全建议

1. **保护 CRON_SECRET**

   - 使用强随机字符串
   - 不要提交到 Git
2. **数据库安全**

   - Vercel Postgres 默认加密连接
   - 使用 Prisma URL 启用连接池
3. **API 限流**

   - 考虑添加 rate limiting
   - 可使用 Vercel Edge Middleware

## 📝 常见问题

### Q: 如何手动触发爬虫？

A: 发送 POST 请求到 `/api/crawler`，带上 Authorization 头：

```bash
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Q: 为什么爬虫没有自动运行？

A: 检查以下几点：

1. `vercel.json` 是否正确配置
2. `CRON_SECRET` 环境变量是否设置
3. 在 Vercel 项目 Cron 设置中查看执行日志

### Q: 如何迁移旧数据？

A: 可以编写一个脚本读取旧的 Markdown 文件，解析后插入数据库：

```javascript
import { saveNewsArticle } from './lib/db';
import fs from 'fs';

// 读取旧的 catalogue.json
const catalogue = JSON.parse(fs.readFileSync('./old/public/news/catalogue.json', 'utf8'));

for (const item of catalogue) {
  const mdContent = fs.readFileSync(`./old/public/news/${item.date}.md`, 'utf8');
  await saveNewsArticle(item.date, item.abstract, mdContent, 0);
}
```

### Q: 数据库连接失败？

A: 确保：

1. 在 Vercel 创建了 Postgres 数据库
2. 环境变量正确配置
3. 运行了 `npm run db:migrate`

## 📄 License

ISC

---

&copy; 2022-2025 新闻联播文字稿归档 | Powered by Next.js & Vercel
