# 快速启动指南

## 🚀 5 分钟快速部署

### 步骤 1: 克隆并安装 (1 分钟)

```bash
cd dailynews-next
npm install
```

### 步骤 2: 部署到 Vercel (2 分钟)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

在部署过程中，Vercel 会询问一些问题，全部按回车使用默认值即可。

### 步骤 3: 创建数据库 (1 分钟)

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你刚部署的项目
3. 点击 "Storage" → "Create Database" → "Postgres"
4. 选择区域后点击 "Create"

### 步骤 4: 配置环境变量 (30 秒)

在 Vercel 项目设置中添加：

```env
CRON_SECRET=your-random-secret-here
```

生成随机密钥：
```bash
openssl rand -base64 32
```

### 步骤 5: 初始化数据库 (30 秒)

```bash
# 拉取环境变量
vercel env pull .env.local

# 运行迁移
npm run db:migrate
```

### 完成！🎉

访问你的 Vercel 域名，例如：`https://your-project.vercel.app`

## 🧪 测试爬虫

手动触发一次爬虫，验证功能：

```bash
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

## 📅 定时任务

爬虫会自动在每天 **20:30 (北京时间)** 运行。

无需额外配置，`vercel.json` 已包含 Cron 配置。

## ⚙️ 本地开发

```bash
# 1. 拉取环境变量
vercel env pull .env.local

# 2. 启动开发服务器
npm run dev

# 3. 访问
open http://localhost:3000
```

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 部署到 Vercel
vercel --prod

# 查看 Vercel 日志
vercel logs
```

## 📞 遇到问题？

1. 查看 [README.md](./README.md) 完整文档
2. 查看 [DEPLOY.md](./DEPLOY.md) 部署指南
3. 检查 Vercel Logs

---

就这么简单！现在你有一个全自动的新闻归档系统了 🚀

