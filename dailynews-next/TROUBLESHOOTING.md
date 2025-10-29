# 故障排查指南

## 常见问题和解决方案

### 1. 数据库迁移失败

#### 问题: `npm run db:migrate` 报错 "ERR_REQUIRE_CYCLE_MODULE"

**已解决！** 已将脚本从 ES Module 改为 CommonJS 格式。

**解决方案**:
```bash
# 1. 确保已安装最新依赖
npm install

# 2. 确保 .env.local 文件存在且包含数据库配置
vercel env pull .env.local

# 3. 运行迁移
npm run db:migrate
```

#### 问题: 连接数据库超时

**原因**: 没有正确配置环境变量

**解决方案**:
1. 在 Vercel 创建 Postgres 数据库
2. 运行 `vercel env pull .env.local` 拉取环境变量
3. 检查 `.env.local` 文件是否包含 `POSTGRES_URL` 等变量

### 2. Next.js 构建问题

#### 问题: `npm run build` 失败

**解决方案**:
```bash
# 清除缓存
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 问题: TypeScript 类型错误

**解决方案**:
```bash
# 检查 TypeScript 配置
npx tsc --noEmit

# 如果有错误，根据提示修复
```

### 3. API 调用问题

#### 问题: API 返回 401 未授权

**原因**: `CRON_SECRET` 不匹配

**解决方案**:
```bash
# 1. 检查环境变量
echo $CRON_SECRET

# 2. 在 Vercel Dashboard 确认环境变量设置正确

# 3. 使用正确的 Authorization 头
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### 问题: API 返回 500 服务器错误

**解决方案**:
1. 查看 Vercel 日志: `vercel logs`
2. 检查数据库连接是否正常
3. 确认数据库表已创建

### 4. 爬虫问题

#### 问题: 爬虫无法获取新闻

**可能原因**:
1. CCTV 官网改版，CSS 选择器失效
2. 网络连接问题
3. 反爬虫机制拦截

**解决方案**:
```bash
# 1. 查看详细错误日志
vercel logs --follow

# 2. 手动测试爬虫 API
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"

# 3. 如果是选择器问题，需要更新 lib/crawler.ts 中的选择器
```

### 5. Vercel Cron 未执行

#### 问题: 定时任务没有自动运行

**检查清单**:
- [ ] `vercel.json` 文件存在且配置正确
- [ ] Cron 路径为 `/api/crawler`
- [ ] `CRON_SECRET` 环境变量已在 Vercel 中设置
- [ ] 项目已部署到生产环境（Cron 仅在生产环境运行）
- [ ] API 路由同时支持 GET 和 POST 方法

**解决方案**:
1. **检查 Vercel Dashboard**
   - 进入项目 → Settings → Cron Jobs
   - 确认 Cron 任务已启用
   - 查看执行历史和日志

2. **手动测试 GET 方法**（Vercel Cron 使用 GET）
   ```bash
   curl https://your-domain.vercel.app/api/crawler \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

3. **验证环境变量**
   - 在 Vercel Dashboard → Settings → Environment Variables
   - 确认 `CRON_SECRET` 已设置且应用到 Production 环境

4. **查看执行日志**
   ```bash
   vercel logs --prod
   ```

### 6. 本地开发问题

#### 问题: `npm run dev` 启动失败

**解决方案**:
```bash
# 1. 清除所有缓存
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 2. 重新安装
npm install

# 3. 确保环境变量存在
cp .env.example .env.local
# 编辑 .env.local 填入真实配置

# 4. 启动
npm run dev
```

#### 问题: 端口 3000 被占用

**解决方案**:
```bash
# 使用其他端口
PORT=3001 npm run dev

# 或者杀掉占用端口的进程
lsof -ti:3000 | xargs kill -9
```

### 7. 依赖安装问题

#### 问题: `npm install` 报错

**解决方案**:
```bash
# 1. 清除 npm 缓存
npm cache clean --force

# 2. 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 3. 使用 legacy-peer-deps
npm install --legacy-peer-deps

# 4. 或者使用 yarn
yarn install
```

### 8. 部署问题

#### 问题: Vercel 部署失败

**检查**:
1. 查看 Vercel 部署日志
2. 确认所有环境变量已设置
3. 检查 `next.config.js` 配置

**解决方案**:
```bash
# 1. 本地测试构建
npm run build
npm start

# 2. 如果本地构建成功，重新部署
vercel --prod --force
```

#### 问题: 部署后页面空白

**可能原因**:
1. 数据库未初始化
2. 环境变量未设置
3. API 路由错误

**解决方案**:
1. 运行数据库迁移: `npm run db:migrate`
2. 检查 Vercel 环境变量
3. 查看浏览器控制台错误
4. 查看 Vercel 日志

## 调试技巧

### 查看日志

```bash
# Vercel 日志
vercel logs
vercel logs --follow  # 实时日志

# 本地开发日志
# 直接在终端查看
```

### 测试数据库连接

在 `scripts/` 目录创建测试文件 `test-db.js`:

```javascript
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✓ 数据库连接成功:', result.rows[0]);
  } catch (error) {
    console.error('✗ 数据库连接失败:', error);
  }
  process.exit(0);
}

test();
```

运行: `node scripts/test-db.js`

### 测试 API

```bash
# 测试统计 API
curl https://your-domain.vercel.app/api/stats

# 测试新闻列表 API
curl https://your-domain.vercel.app/api/news?limit=5

# 测试爬虫 API
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"date": "20241027"}'
```

## 获取帮助

如果以上方法都无法解决问题:

1. **查看文档**
   - README.md - 完整功能文档
   - DEPLOY.md - 部署指南
   - QUICKSTART.md - 快速开始

2. **查看日志**
   - Vercel Dashboard 日志
   - 浏览器控制台
   - 终端输出

3. **检查配置**
   - 环境变量
   - Vercel 设置
   - 数据库状态

4. **社区帮助**
   - Vercel Discord
   - Next.js GitHub Discussions
   - Stack Overflow

## 预防措施

### 开发前检查清单

- [ ] Node.js 版本 >= 18
- [ ] npm 已更新到最新版本
- [ ] Git 已配置
- [ ] 已创建 Vercel 账号
- [ ] 已安装 Vercel CLI

### 部署前检查清单

- [ ] 本地构建成功 (`npm run build`)
- [ ] 所有测试通过
- [ ] 环境变量已配置
- [ ] 数据库已创建
- [ ] `.env.local` 不包含在 Git 中

### 上线后检查清单

- [ ] 首页可正常访问
- [ ] API 接口正常响应
- [ ] 数据库连接正常
- [ ] Cron 任务已配置
- [ ] 手动触发爬虫成功

---

**提示**: 大部分问题都与环境变量配置和数据库连接有关。请优先检查这两项！

