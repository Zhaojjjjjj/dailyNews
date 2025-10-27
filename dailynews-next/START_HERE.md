# 🚀 从这里开始！

欢迎使用新闻联播文字稿归档系统 Next.js 版本！

## 📚 文档导航

根据你的需求，选择合适的文档：

### 🏃 我想快速部署 (5 分钟)
👉 阅读 [QUICKSTART.md](./QUICKSTART.md)
- 最快速的部署流程
- 适合想立即看到效果的用户

### 🔧 我需要配置环境变量
👉 阅读 [ENV_SETUP.md](./ENV_SETUP.md) ⭐ **推荐先看**
- 详细的环境变量配置指南
- 如何从 Vercel 获取数据库连接
- 常见配置问题解决

### 📖 我想了解完整功能
👉 阅读 [README.md](./README.md)
- 完整的功能介绍
- API 文档
- 本地开发指南

### 🚀 我想详细了解部署
👉 阅读 [DEPLOY.md](./DEPLOY.md)
- 详细的部署步骤
- Vercel 配置说明
- 故障排查指南

### 🆘 遇到问题了
👉 阅读 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 常见错误解决方案
- 调试技巧
- 快速修复指南

### 📊 我想了解项目架构
👉 阅读 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- 完整的项目结构
- 技术栈详解
- 与旧版对比

## 🎯 快速决策树

```
开始
 │
 ├─ 从未部署过？
 │   └─ 👉 QUICKSTART.md (5分钟快速部署)
 │
 ├─ 想本地开发？
 │   └─ 👉 README.md (本地开发部分)
 │
 ├─ 部署遇到问题？
 │   └─ 👉 DEPLOY.md (故障排查)
 │
 └─ 想了解技术细节？
     └─ 👉 PROJECT_SUMMARY.md (技术详解)
```

## ⚡ 超快速启动 (仅需 3 个命令)

```bash
# 1. 安装依赖
npm install

# 2. 部署到 Vercel
npx vercel --prod

# 3. 创建数据库并初始化
# (在 Vercel Dashboard 创建 Postgres，然后运行)
npm run db:migrate
```

完成！访问你的 Vercel 域名即可。

## 📋 需要准备的内容

- [ ] GitHub/GitLab/Bitbucket 账号
- [ ] Vercel 账号 (免费，用 GitHub 登录)
- [ ] 10 分钟时间

## 🆘 常见问题

### Q: 需要付费吗？
A: **不需要！** Vercel 和 Postgres 都有免费额度，足够个人使用。

### Q: 需要服务器吗？
A: **不需要！** 完全使用 Vercel Serverless，无需管理服务器。

### Q: 技术要求高吗？
A: **不高！** 按照 QUICKSTART.md 操作即可，无需深入了解 Next.js。

### Q: 能自动更新吗？
A: **能！** 每天 20:30 自动爬取新闻，无需手动操作。

### Q: 旧数据怎么办？
A: 旧版本和新版本可以共存，互不影响。新版本从部署开始积累数据。

## 🎁 项目特色

- ✅ **零成本** - 使用 Vercel 免费额度
- ✅ **零维护** - 自动化定时任务
- ✅ **零服务器** - Serverless 架构
- ✅ **高性能** - 数据库 + CDN
- ✅ **响应式** - 移动端完美适配
- ✅ **SEO 友好** - 服务端渲染 + Sitemap

## 📞 获取帮助

1. 查看对应的文档文件
2. 检查 Vercel 项目日志
3. 查看 GitHub Issues

## 🎉 现在开始吧！

**推荐路线**:
1. 先看 [QUICKSTART.md](./QUICKSTART.md) 快速部署
2. 部署成功后，阅读 [README.md](./README.md) 了解功能
3. 有问题查看 [DEPLOY.md](./DEPLOY.md) 故障排查

---

**提示**: 如果这是你第一次接触，强烈推荐先按照 QUICKSTART.md 部署一次，看到效果后会更有动力深入学习！

开始你的新闻归档之旅吧！🚀

