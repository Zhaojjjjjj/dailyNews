# 🔧 Vercel 生产环境配置指南

## 🔴 问题

生产环境报错：
```
VercelPostgresError - 'invalid_connection_string': This connection string is meant to be used with a direct connection.
```

## ✅ 原因

Vercel 项目中缺少标准格式的环境变量（`POSTGRES_URL` 等），只有带前缀的变量（`news_POSTGRES_URL`）。

## 🛠️ 解决方案

### 步骤 1: 在 Vercel Dashboard 添加环境变量

1. **打开 Vercel 项目页面**
   - 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 选择你的 `dailynews-next` 项目

2. **进入环境变量设置**
   - 点击顶部 **Settings** 标签
   - 左侧菜单选择 **Environment Variables**

3. **添加以下 8 个环境变量**

   **重要提示**：
   - ⚠️ 变量名和值之间**不要有空格**
   - ⚠️ 值**不要加引号**（直接粘贴内容）
   - ✅ 每个变量都要勾选所有环境：**Production, Preview, Development**

   | 变量名 | 值 |
   |--------|-----|
   | `POSTGRES_URL` | `postgresql://neondb_owner:npg_8qGwiUFbhVR0@ep-polished-art-a4q08tsp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` |
   | `POSTGRES_PRISMA_URL` | `postgresql://neondb_owner:npg_8qGwiUFbhVR0@ep-polished-art-a4q08tsp-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require` |
   | `POSTGRES_URL_NON_POOLING` | `postgresql://neondb_owner:npg_8qGwiUFbhVR0@ep-polished-art-a4q08tsp.us-east-1.aws.neon.tech/neondb?sslmode=require` |
   | `POSTGRES_USER` | `neondb_owner` |
   | `POSTGRES_HOST` | `ep-polished-art-a4q08tsp-pooler.us-east-1.aws.neon.tech` |
   | `POSTGRES_PASSWORD` | `npg_8qGwiUFbhVR0` |
   | `POSTGRES_DATABASE` | `neondb` |
   | `CRON_SECRET` | `a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952` |

4. **保存每个变量**
   - 点击 "Add" 按钮
   - 确认变量已保存

### 步骤 2: 重新部署

添加完所有环境变量后：

1. **触发重新部署**
   - 回到 **Deployments** 标签
   - 找到最新的部署
   - 点击右侧的 **"..."** 按钮
   - 选择 **"Redeploy"**
   - 勾选 **"Use existing Build Cache"**（可选，更快）
   - 点击 **"Redeploy"**

2. **等待部署完成**
   - 大约 1-2 分钟
   - 部署成功后会显示绿色 ✓

### 步骤 3: 验证

部署完成后，测试以下功能：

1. **访问首页**
   ```
   https://your-domain.vercel.app
   ```
   应该能看到页面（即使没有数据）

2. **测试统计 API**
   ```bash
   curl https://your-domain.vercel.app/api/stats
   ```
   应该返回 JSON 数据

3. **测试爬虫 API**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/crawler \
     -H "Authorization: Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952" \
     -H "Content-Type: application/json"
   ```
   应该成功爬取并保存新闻

## 🎯 快速命令（显示需要的环境变量）

运行这个脚本查看需要添加的环境变量：

```bash
cd /Users/ss/web/LOCAL/dailyNews.git/dailynews-next
./scripts/setup-vercel-env.sh
```

这会显示所有需要在 Vercel 中设置的环境变量。

## 📋 环境变量检查清单

在 Vercel Settings → Environment Variables 中确认：

- [ ] `POSTGRES_URL` 已添加
- [ ] `POSTGRES_PRISMA_URL` 已添加
- [ ] `POSTGRES_URL_NON_POOLING` 已添加
- [ ] `POSTGRES_USER` 已添加
- [ ] `POSTGRES_HOST` 已添加
- [ ] `POSTGRES_PASSWORD` 已添加
- [ ] `POSTGRES_DATABASE` 已添加
- [ ] `CRON_SECRET` 已添加
- [ ] 所有变量都勾选了 **Production**
- [ ] 所有变量都勾选了 **Preview**（可选）
- [ ] 所有变量都勾选了 **Development**（可选）

## 🆘 常见问题

### Q: 为什么需要添加这些变量？

A: Vercel 从数据库复制的环境变量带有 `news_` 前缀（如 `news_POSTGRES_URL`），但我们的代码使用的是标准名称（如 `POSTGRES_URL`）。

### Q: 可以删除带 news_ 前缀的变量吗？

A: 可以，但建议保留它们，不会有影响。

### Q: 如何确认环境变量生效？

A: 重新部署后，查看部署日志。如果没有连接错误，说明已生效。

### Q: 还是报同样的错误怎么办？

A: 检查：
1. 确认所有 8 个变量都已添加
2. 确认变量值没有引号
3. 确认已重新部署（不是重新访问）
4. 查看 Vercel 部署日志中的详细错误

### Q: 使用 Vercel CLI 如何添加？

A: 如果安装了 Vercel CLI：

```bash
# 一个一个添加
vercel env add POSTGRES_URL production
# 输入值（不加引号）

vercel env add POSTGRES_PRISMA_URL production
# 输入值...

# 重复以上步骤添加所有 8 个变量
```

## 📸 示例截图说明

### 1. 环境变量页面
应该看到至少 8 个变量：
```
POSTGRES_URL                 ✓ Production
POSTGRES_PRISMA_URL          ✓ Production
POSTGRES_URL_NON_POOLING     ✓ Production
POSTGRES_USER                ✓ Production
POSTGRES_HOST                ✓ Production
POSTGRES_PASSWORD            ✓ Production (hidden)
POSTGRES_DATABASE            ✓ Production
CRON_SECRET                  ✓ Production (hidden)
```

### 2. 添加变量界面
```
Name:  POSTGRES_URL
Value: postgresql://neondb_owner:npg_8qGwiUFbhVR0@ep-...
Environment: ✓ Production ✓ Preview ✓ Development
```

## 🎉 完成

完成以上步骤后：
1. ✅ 生产环境可以正常连接数据库
2. ✅ API 可以正常工作
3. ✅ Cron 定时任务可以自动运行
4. ✅ 页面可以正常显示数据

---

**提示**: 环境变量设置后，必须重新部署才能生效！

