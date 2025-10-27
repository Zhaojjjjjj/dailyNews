# 部署指南

## 📦 部署到 Vercel (推荐)

### 前置准备

1. GitHub/GitLab/Bitbucket 账号
2. Vercel 账号 (可使用 GitHub 登录)
3. 项目代码已推送到 Git 仓库

### 步骤 1: 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 导入你的 Git 仓库
4. 选择 `dailynews-next` 目录作为根目录
5. 保持默认的 Framework Preset (Next.js)

### 步骤 2: 创建 Postgres 数据库

1. 在 Vercel 项目页面，点击 "Storage" 标签
2. 点击 "Create Database"
3. 选择 "Postgres"
4. 选择数据库名称和区域 (建议选择离用户最近的区域)
5. 点击 "Create"
6. 创建完成后，环境变量会自动注入到项目中

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加额外的环境变量：

1. 进入 "Settings" → "Environment Variables"
2. 添加以下变量：

```env
CRON_SECRET=your-random-secret-key-here
```

**生成随机密钥的方法:**

```bash
# macOS/Linux
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤 4: 初始化数据库

有两种方式：

**方式 A: 使用 Vercel CLI (推荐)**

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 链接到项目
vercel link

# 拉取环境变量
vercel env pull .env.local

# 运行迁移脚本
npm run db:migrate
```

**方式 B: 在本地直接连接**

1. 从 Vercel 复制 `POSTGRES_URL` 环境变量
2. 创建 `.env.local` 文件并粘贴
3. 运行 `npm run db:migrate`

### 步骤 5: 部署

1. 提交所有更改到 Git
2. 推送到远程仓库
3. Vercel 会自动检测并部署
4. 部署完成后，访问 Vercel 提供的域名

### 步骤 6: 验证

1. 访问首页，检查页面是否正常显示
2. 手动触发一次爬虫：

```bash
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

3. 检查 Vercel 日志，确认爬虫执行成功
4. 刷新首页，查看是否有新数据

### 步骤 7: 配置自定义域名 (可选)

1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加你的域名
3. 根据提示配置 DNS 记录
4. 等待 DNS 生效

## ⏰ 定时任务配置

### Vercel Cron Jobs

项目已包含 `vercel.json` 配置，部署后会自动启用 Cron。

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

### 查看 Cron 执行日志

1. 进入 Vercel 项目页面
2. 点击 "Logs" 标签
3. 筛选 `/api/crawler` 的请求
4. 查看执行结果

### 修改执行时间

如果需要修改执行时间，编辑 `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/crawler",
      "schedule": "0 13 * * *"  // 北京时间 21:00
    }
  ]
}
```

**常用时间转换 (UTC → 北京时间 +8h):**

| UTC 时间 | 北京时间 | Cron 表达式 |
|----------|----------|-------------|
| 12:00    | 20:00    | `0 12 * * *` |
| 12:30    | 20:30    | `30 12 * * *` |
| 13:00    | 21:00    | `0 13 * * *` |
| 14:00    | 22:00    | `0 14 * * *` |

## 🔄 持续集成

### 自动部署流程

1. 推送代码到 main/master 分支
2. Vercel 自动检测更改
3. 触发构建和部署
4. 部署成功后自动激活

### 预览部署

- 每个 Pull Request 都会自动创建预览部署
- 预览部署有独立的 URL
- 不会影响生产环境

## 🚨 故障排查

### 问题: 页面空白或加载失败

**解决方案:**

1. 检查 Vercel 日志，查看是否有报错
2. 确认数据库连接正常
3. 验证环境变量是否正确设置

### 问题: 爬虫执行失败

**解决方案:**

1. 检查 CCTV 官网是否可访问
2. 查看错误日志，确认是网络问题还是解析问题
3. 手动测试爬虫 API
4. 检查 CSS 选择器是否失效 (官网改版)

### 问题: Cron 任务没有执行

**解决方案:**

1. 确认 `vercel.json` 配置正确
2. 检查 Vercel 项目的 Cron 设置
3. 验证 `CRON_SECRET` 环境变量
4. 查看 Vercel Logs 中的 Cron 执行记录

### 问题: 数据库连接超时

**解决方案:**

1. 使用 `POSTGRES_PRISMA_URL` (带连接池)
2. 增加连接超时时间
3. 检查数据库区域是否离 Vercel 部署区域太远

## 🔧 性能优化

### 1. 启用 Vercel Edge Caching

在 API Route 中添加缓存头：

```typescript
export async function GET() {
  // ...
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

### 2. 数据库查询优化

- 使用索引 (已在 `lib/db.ts` 中配置)
- 限制返回字段
- 使用分页

### 3. 图片优化 (如果添加图片)

使用 Next.js 的 `<Image>` 组件自动优化。

## 🔒 安全配置

### 1. 环境变量管理

- ✅ 使用 Vercel 的环境变量系统
- ✅ 不要在代码中硬编码敏感信息
- ✅ 为不同环境 (开发/生产) 设置不同的值

### 2. API 保护

爬虫 API 已通过 `CRON_SECRET` 保护：

```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: '未授权' }, { status: 401 });
}
```

### 3. 速率限制 (可选)

使用 Vercel Edge Middleware 添加速率限制：

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 实现速率限制逻辑
}
```

## 📊 监控和日志

### Vercel Analytics

1. 在 Vercel 项目设置中启用 Analytics
2. 查看页面访问数据
3. 监控 Web Vitals

### 自定义日志

使用 `console.log` 输出的内容会自动显示在 Vercel Logs 中：

```typescript
console.log('爬虫开始执行:', date);
console.error('爬虫失败:', error);
```

## 🎯 生产环境清单

部署前检查：

- [ ] 所有环境变量已配置
- [ ] 数据库已创建并初始化
- [ ] `vercel.json` 配置正确
- [ ] 爬虫手动测试成功
- [ ] 所有页面可正常访问
- [ ] 搜索功能正常
- [ ] 移动端显示正常
- [ ] Cron 任务配置正确
- [ ] 自定义域名已配置 (可选)

## 📞 支持

遇到问题？

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Next.js 文档](https://nextjs.org/docs)
3. 查看项目 Issues
4. Vercel 支持团队

---

部署成功后，你的新闻归档系统就上线了！🎉

