# Vercel Cron 定时任务修复说明

## 问题根源

**原始设计缺陷**：
- Vercel Cron 默认使用 **GET 请求** 触发定时任务
- 原代码中 `GET /api/crawler` 仅返回状态信息，不执行爬虫
- 爬虫逻辑仅在 `POST` 方法中实现
- 导致定时任务虽然触发，但不执行实际工作

## 修复方案

### 1. 代码重构

**核心改进**：将爬虫逻辑提取为独立函数 `executeCrawler()`，消除 HTTP 方法耦合。

```typescript
// 修复前：逻辑绑定在 POST 方法中
export async function POST() { /* 爬虫逻辑 */ }
export async function GET() { return { status: 'ready' }; } // 仅返回状态

// 修复后：逻辑独立，两个方法共享
async function executeCrawler() { /* 爬虫逻辑 */ }
export async function GET() { return executeCrawler(); }  // 执行爬虫
export async function POST() { return executeCrawler(); } // 执行爬虫
```

### 2. 文件变更

**修改的文件**：
- ✅ `/app/api/crawler/route.ts` - 重构爬虫 API
- ✅ `/.env.example` - 添加 `CRON_SECRET` 说明
- ✅ `/README.md` - 更新 API 文档
- ✅ `/TROUBLESHOOTING.md` - 增强故障排查指南

## 部署检查清单

### 必须完成的步骤

#### 1. 环境变量配置

在 Vercel Dashboard → 项目 → Settings → Environment Variables 中设置：

```bash
# 生成随机密钥
openssl rand -base64 32

# 在 Vercel 中添加环境变量
CRON_SECRET=<生成的密钥>
```

**重要**：确保应用到 **Production** 环境。

#### 2. 验证 vercel.json

确认文件内容正确：

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

- `path`: 必须是 `/api/crawler`
- `schedule`: `30 12 * * *` = 每天 UTC 12:30 = 北京时间 20:30

#### 3. 部署到生产环境

```bash
# 推送代码
git add .
git commit -m "fix: Vercel Cron 定时任务修复"
git push

# 或使用 Vercel CLI
vercel --prod
```

**注意**：Vercel Cron 仅在 **生产环境** 运行，开发环境不会触发。

#### 4. 验证部署

**4.1 手动测试 GET 方法**

```bash
curl https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

预期响应：
```json
{
  "success": true,
  "message": "爬取并保存成功",
  "data": {
    "date": "20241029",
    "newsCount": 15
  }
}
```

**4.2 检查 Vercel Dashboard**

1. 进入项目 → Settings → Cron Jobs
2. 确认任务已启用
3. 查看执行历史（首次执行需等待下一个调度时间）

**4.3 查看日志**

```bash
vercel logs --prod
```

查找包含 "开始爬取日期" 的日志条目。

## 常见问题

### Q1: Cron 任务显示 401 错误

**原因**：`CRON_SECRET` 未设置或不匹配。

**解决**：
1. 检查 Vercel 环境变量是否正确设置
2. 确认应用到 Production 环境
3. 重新部署项目

### Q2: Cron 任务执行但没有数据

**原因**：爬虫逻辑失败或数据已存在。

**解决**：
1. 查看 Vercel 日志确认错误信息
2. 检查数据库连接
3. 使用 `force: true` 参数强制更新：
   ```bash
   curl -X POST https://your-domain.vercel.app/api/crawler \
     -H "Authorization: Bearer YOUR_CRON_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"force": true}'
   ```

### Q3: 如何修改执行时间？

编辑 `vercel.json` 中的 `schedule` 字段：

```json
{
  "crons": [
    {
      "path": "/api/crawler",
      "schedule": "0 14 * * *"  // 每天 UTC 14:00 = 北京时间 22:00
    }
  ]
}
```

Cron 表达式格式：`分钟 小时 日期 月份 星期`

**常用时间**：
- `0 0 * * *` - 每天 UTC 00:00 (北京时间 08:00)
- `30 12 * * *` - 每天 UTC 12:30 (北京时间 20:30)
- `0 14 * * *` - 每天 UTC 14:00 (北京时间 22:00)

## 技术细节

### 为什么 Vercel Cron 使用 GET？

Vercel Cron 的设计哲学：
- GET 方法语义上表示"触发"或"查询"
- 不需要请求体，简化配置
- 符合 RESTful 幂等性原则

### 代码改进点

**改进前的问题**：
1. 逻辑与 HTTP 方法强耦合
2. GET 和 POST 功能不一致
3. 代码重复（鉴权逻辑重复）

**改进后的优势**：
1. 单一职责：`executeCrawler()` 只负责爬虫逻辑
2. 代码复用：GET 和 POST 共享核心逻辑
3. 易于测试：独立函数便于单元测试
4. 符合 DRY 原则

## 验证成功标志

✅ **定时任务修复成功的标志**：

1. Vercel Dashboard 中 Cron Jobs 显示"Enabled"
2. 手动 GET 请求返回爬虫结果（非仅状态信息）
3. 定时执行后数据库有新数据
4. 日志中有 "成功保存 YYYYMMDD 的新闻到数据库" 记录

---

**最后提醒**：首次部署后，需等待下一个调度时间才会自动执行。如需立即验证，使用手动测试命令。
