# 环境变量配置指南

## 📋 需要的环境变量

你需要配置以下环境变量才能运行项目：

### 1. 数据库连接（从 Vercel 获取）

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="xxx.vercel-storage.com"
POSTGRES_PASSWORD="xxxxx"
POSTGRES_DATABASE="verceldb"
```

### 2. 定时任务密钥（自己生成）

```env
CRON_SECRET="your-random-secret-key"
```

## 🔧 获取环境变量的方法

### 方法 1: 从 Vercel 网页复制（推荐）

1. **创建 Postgres 数据库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 选择你的项目
   - 点击 "Storage" 标签
   - "Create Database" → "Postgres"
   - 选择区域（推荐 Hong Kong 或 Singapore）

2. **复制环境变量**
   - 数据库创建后，点击数据库名称
   - 点击 ".env.local" 标签
   - 点击 "Show secret" 显示密码
   - 复制所有内容

3. **创建本地配置文件**
   ```bash
   cd dailynews-next
   nano .env.local
   # 或使用任何文本编辑器
   ```

4. **粘贴并添加 CRON_SECRET**
   ```env
   # 粘贴从 Vercel 复制的所有 POSTGRES_* 变量
   POSTGRES_URL="..."
   POSTGRES_PRISMA_URL="..."
   # ... 其他变量
   
   # 添加自己生成的 CRON_SECRET
   CRON_SECRET="your-random-secret"
   ```

### 方法 2: 使用 Vercel CLI

```bash
# 1. 安装 CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量
vercel env pull .env.local

# 5. 手动添加 CRON_SECRET（如果还没有）
echo 'CRON_SECRET="'$(openssl rand -base64 32)'"' >> .env.local
```

## 🔑 生成 CRON_SECRET

选择一种方式生成随机密钥：

### macOS/Linux:
```bash
openssl rand -base64 32
```

### Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 在线生成:
访问 [randomkeygen.com](https://randomkeygen.com) 复制一个 "CodeIgniter Encryption Key"

## 📝 完整的 .env.local 示例

```env
# Vercel Postgres Database
POSTGRES_URL="postgres://default:AbCdEf123456@ep-xxx-pooler.xxx.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:AbCdEf123456@ep-xxx-pooler.xxx.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:AbCdEf123456@ep-xxx.xxx.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="ep-xxx-pooler.xxx.vercel-storage.com"
POSTGRES_PASSWORD="AbCdEf123456"
POSTGRES_DATABASE="verceldb"

# Cron Job Secret (随机生成)
CRON_SECRET="XyZ789AbC456DeF123GhI456JkL789MnO012PqR345="
```

## ✅ 验证配置

运行以下命令检查配置是否正确：

```bash
# 1. 检查文件是否存在
ls -la .env.local

# 2. 查看环境变量（不显示密码）
cat .env.local | grep -v PASSWORD

# 3. 测试数据库连接
npm run db:migrate
```

如果看到以下输出，说明配置成功：
```
✓ 数据库连接成功
开始数据库迁移...
✓ 创建 news_articles 表
✓ 创建日期索引
✅ 数据库迁移完成！
```

## ⚠️ 常见问题

### 问题 1: "invalid_connection_string" 错误

**原因**: 使用了错误的连接字符串类型

**解决**: 确保 `.env.local` 包含所有必需的变量，特别是 `POSTGRES_URL` 和 `POSTGRES_PRISMA_URL`

### 问题 2: 连接超时

**原因**: 网络问题或数据库未创建

**解决**:
1. 确认 Vercel 上已创建 Postgres 数据库
2. 检查网络连接
3. 尝试从 Vercel Dashboard 重新复制环境变量

### 问题 3: .env.local 不生效

**原因**: 文件位置错误或格式问题

**解决**:
1. 确保文件在 `dailynews-next/` 目录下
2. 文件名必须是 `.env.local`（前面有个点）
3. 不要有空格或特殊字符
4. 每个变量独占一行

### 问题 4: CRON_SECRET 是什么？

**答**: 这是保护爬虫 API 的密钥，防止未经授权的访问。

**设置后的使用**:
```bash
# 调用爬虫 API 时需要在 Authorization 头中提供
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🔒 安全提示

1. **不要提交到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 确保不要 `git add .env.local`

2. **不要分享密码**
   - 环境变量包含敏感信息
   - 不要截图或分享

3. **定期更换密钥**
   - 如果密钥泄露，立即在 Vercel 更换
   - 重新生成 CRON_SECRET

4. **使用环境变量**
   - 在 Vercel Dashboard 设置
   - 不要在代码中硬编码

## 📞 需要帮助？

如果配置遇到问题：

1. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 检查 Vercel 项目日志
3. 确认数据库已创建
4. 重新从 Vercel 复制环境变量

---

**提示**: 配置环境变量是最关键的一步，请仔细按照步骤操作！

