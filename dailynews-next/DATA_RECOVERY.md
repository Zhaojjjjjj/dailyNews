# 📦 数据恢复与批量爬取指南

## 🎯 两种数据恢复方式

### 方式 1: 从旧项目导入数据（推荐，如果有旧数据）

如果你有旧版本项目的 Markdown 文件和 `catalogue.json`，可以直接导入。

### 方式 2: 重新爬取历史数据

从 CCTV 官网重新爬取指定日期范围的数据。

---

## 📖 方式 1: 从旧项目导入数据

### 前提条件
- ✅ 旧项目的 `/public/news/` 目录存在
- ✅ 包含 `catalogue.json` 文件
- ✅ 包含 `YYYYMMDD.md` 格式的 Markdown 文件

### 步骤

#### 1. 检查旧项目路径

默认路径是相对于新项目的：
```
dailyNews.git/
├── public/news/              # 旧项目数据
│   ├── catalogue.json
│   ├── 20241001.md
│   ├── 20241002.md
│   └── ...
└── dailynews-next/           # 新项目
    └── scripts/
        └── import-old-data.js
```

如果路径不同，编辑 `scripts/import-old-data.js`：
```javascript
// 修改这一行
const OLD_PROJECT_PATH = path.join(__dirname, '../../public/news');
```

#### 2. 运行导入脚本

```bash
cd /Users/ss/web/LOCAL/dailyNews.git/dailynews-next

# 确保数据库已初始化
npm run db:migrate

# 运行导入脚本
node scripts/import-old-data.js
```

#### 3. 查看结果

你会看到类似输出：
```
🚀 开始导入旧数据到数据库
================================

📖 读取旧项目数据...
✓ 找到 100 条记录

🔌 连接数据库...
✓ 数据库连接成功

📥 开始导入...

[1/100] ✅ 成功 20241001 - 12 条新闻
[2/100] ✅ 成功 20241002 - 15 条新闻
...

📊 导入完成
================================
✅ 成功导入: 98
⏭️  已跳过: 2
❌ 导入失败: 0
📈 总计: 100
```

---

## 🕷️ 方式 2: 批量爬取历史数据

### 使用场景
- 没有旧项目数据
- 需要补充某个时间段的数据
- 旧数据文件损坏或不完整

### 步骤

#### 1. 本地环境批量爬取

```bash
cd /Users/ss/web/LOCAL/dailyNews.git/dailynews-next

# 确保本地服务器运行中
npm run dev

# 在另一个终端运行爬取脚本
# 格式: node scripts/batch-crawl.js <开始日期> <结束日期>

# 示例：爬取 2024年10月1日 到 10月27日
node scripts/batch-crawl.js 20241001 20241027

# 爬取最近一周
node scripts/batch-crawl.js 20241020 20241027

# 爬取整个10月
node scripts/batch-crawl.js 20241001 20241031
```

#### 2. 生产环境批量爬取

```bash
# 编辑 scripts/batch-crawl.js，修改生产环境配置
# 将 'your-domain.vercel.app' 替换为你的实际域名

# 然后运行
node scripts/batch-crawl.js 20241001 20241027 prod
```

或者直接编辑脚本：
```javascript
// 找到这一行并修改
prod: {
  baseUrl: 'https://your-actual-domain.vercel.app',  // 改成你的域名
  secret: 'a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952'
}
```

#### 3. 查看进度

你会看到实时进度：
```
🚀 批量爬取历史数据
====================
📅 日期范围: 2024-10-01 到 2024-10-27
🌍 目标环境: 本地
🔗 API 地址: http://localhost:3000

📊 共 27 天需要爬取

[1/27] 正在爬取 2024-10-01...
  ✅ 成功 - 爬取 12 条新闻
[2/27] 正在爬取 2024-10-02...
  ✅ 成功 - 爬取 15 条新闻
[3/27] 正在爬取 2024-10-03...
  ⏭️  跳过 - 数据已存在
...

📊 爬取完成
====================
✅ 成功: 20
⏭️  跳过: 5
❌ 失败: 2
📈 总计: 27
```

---

## 🚀 手动触发单次爬取

### 方法 1: 使用 curl（推荐）

```bash
# 爬取今天的新闻（本地）
curl -X POST http://localhost:3000/api/crawler \
  -H "Authorization: Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952" \
  -H "Content-Type: application/json"

# 爬取指定日期（本地）
curl -X POST http://localhost:3000/api/crawler \
  -H "Authorization: Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952" \
  -H "Content-Type: application/json" \
  -d '{"date": "20241027"}'

# 爬取今天的新闻（生产环境）
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952" \
  -H "Content-Type: application/json"

# 强制重新爬取（覆盖已有数据）
curl -X POST https://your-domain.vercel.app/api/crawler \
  -H "Authorization: Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952" \
  -H "Content-Type: application/json" \
  -d '{"date": "20241027", "force": true}'
```

### 方法 2: 使用浏览器控制台

打开浏览器控制台（F12），运行：

```javascript
// 本地环境
fetch('http://localhost:3000/api/crawler', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ date: '20241027' })
})
.then(res => res.json())
.then(data => console.log(data));

// 生产环境（替换域名）
fetch('https://your-domain.vercel.app/api/crawler', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ date: '20241027' })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 方法 3: 使用 Postman 或 Insomnia

1. 创建新的 POST 请求
2. URL: `https://your-domain.vercel.app/api/crawler`
3. Headers:
   - `Authorization`: `Bearer a06621a3c673422152bf19f4e2fe903d79d399ebe1bf687be4ffdd5e4b69b952`
   - `Content-Type`: `application/json`
4. Body (JSON):
   ```json
   {
     "date": "20241027"
   }
   ```
5. 点击 Send

---

## ⚠️ 注意事项

### 1. 爬取限制
- 每次请求间隔建议 3 秒以上
- 避免短时间内大量请求
- CCTV 网站可能有反爬虫机制

### 2. 失败原因
批量爬取时部分日期可能失败，常见原因：
- ❌ 该日期没有新闻联播（周末、节假日）
- ❌ CCTV 官网该日期数据不可用
- ❌ 网络连接问题
- ❌ 被限流或拦截

### 3. 数据验证
爬取完成后验证：
```bash
# 查看数据库中的数据
# 访问首页应该能看到统计信息和新闻列表
http://localhost:3000
```

### 4. 时间建议
- 建议在**工作日的晚上 8 点后**爬取当天数据
- 历史数据随时可以爬取
- 避免在高峰时段大批量爬取

---

## 📊 推荐的数据恢复策略

### 策略 1: 有旧数据 ✅

```bash
# 1. 导入旧数据（快速）
node scripts/import-old-data.js

# 2. 补充最近几天的数据（从旧数据最后一天到今天）
node scripts/batch-crawl.js 20241020 20241027
```

### 策略 2: 没有旧数据 🕷️

```bash
# 分批爬取，避免一次性爬取太多

# 第一批：最近一周（测试爬虫是否正常）
node scripts/batch-crawl.js 20241020 20241027

# 第二批：本月其他日期
node scripts/batch-crawl.js 20241001 20241019

# 第三批：上个月
node scripts/batch-crawl.js 20240901 20240930

# 依此类推...
```

### 策略 3: 生产环境 🌐

```bash
# 1. 先在本地环境导入/爬取数据
node scripts/import-old-data.js
# 或
node scripts/batch-crawl.js 20241001 20241027

# 2. 本地验证数据正确后，部署到 Vercel
git add .
git commit -m "Update data"
git push

# 3. Vercel 会自动部署，数据库是共享的
```

---

## 🎯 完整示例

### 场景：恢复最近一个月的数据

```bash
cd /Users/ss/web/LOCAL/dailyNews.git/dailynews-next

# 1. 确保环境配置正确
cat .env.local | grep POSTGRES_URL

# 2. 确保数据库已初始化
npm run db:migrate

# 3. 启动本地服务器（新终端）
npm run dev

# 4. 爬取数据（另一个终端）
node scripts/batch-crawl.js 20240927 20241027

# 5. 验证结果
# 访问 http://localhost:3000
# 查看首页统计信息和新闻列表

# 6. 如果满意，推送到生产环境
git add .
git commit -m "Add historical data"
git push
```

---

## 📞 需要帮助？

- 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 解决常见问题
- 查看 [README.md](./README.md) 了解 API 文档
- 检查爬虫日志定位问题

---

**提示**: 批量爬取会花费较长时间，请耐心等待！建议在网络稳定的环境下进行。

