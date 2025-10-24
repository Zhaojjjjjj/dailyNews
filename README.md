# 《新闻联播》文字稿归档系统

> 每日自动爬取央视《新闻联播》文字稿，提供 Web 界面查看和归档

## 📁 项目结构

```
dailyNews/
├── src/                      # 源代码
│   ├── assets/              # 静态资源
│   │   ├── css/            # 样式文件
│   │   ├── js/             # JavaScript 模块
│   │   └── lib/            # 第三方库
│   ├── pages/              # 页面文件
│   │   ├── index.html      # 首页
│   │   ├── archive.html    # 归档页
│   │   └── detail.html     # 详情页
│   └── crawler/            # 爬虫模块
│       ├── index.js        # 爬虫主程序
│       └── fetch.js        # 请求封装
├── public/                  # 公共资源
│   └── news/               # 新闻数据
│       ├── catalogue.json  # 目录索引
│       └── *.md            # 文字稿
├── docs/                    # 文档
├── package.json
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行爬虫

```bash
npm run crawler
```

### 3. 启动 Web 服务

```bash
npm run dev
```

然后访问: http://localhost:8000/src/pages/index.html

## 📖 功能特性

- ✅ **自动爬取** - 每日自动抓取新闻联播文字稿
- ✅ **三页架构** - 首页/归档页/详情页，层次清晰
- ✅ **搜索功能** - 支持关键词搜索历史记录
- ✅ **响应式设计** - 完美适配桌面和移动端
- ✅ **工程化结构** - CSS/JS 分离，模块化开发

## 🎨 页面说明

### 首页 (`index.html`)
- 统计信息展示
- 最新 10 条文字稿
- 快速访问入口

### 归档页 (`archive.html`)
- 完整历史列表
- 关键词搜索
- 锚点跳转定位

### 详情页 (`detail.html`)
- 完整文字稿内容
- 工具栏(返回/打印/分享)
- 优化阅读体验

## 📝 开发说明

### 目录规范

- `src/assets/css/` - 样式文件，按页面分离
- `src/assets/js/` - JavaScript 模块，ES6 Module
- `src/pages/` - HTML 页面文件
- `src/crawler/` - 爬虫相关代码
- `public/news/` - 数据存储目录

### 样式文件

- `common.css` - 公共样式(导航、底部、按钮等)
- `home.css` - 首页专属样式
- `archive.css` - 归档页专属样式
- `detail.css` - 详情页专属样式

### JavaScript 模块

- `utils.js` - 工具函数(日期格式化、数据加载等)
- `home.js` - 首页逻辑
- `archive.js` - 归档页逻辑
- `detail.js` - 详情页逻辑

## 🔧 技术栈

- **前端**: 原生 HTML/CSS/JavaScript (ES6 Module)
- **后端**: Node.js
- **爬虫**: jsdom + node-fetch
- **Markdown**: showdown.js

## 📦 部署

### 静态部署

将 `src/pages/` 和 `public/` 目录部署到静态服务器即可。

### 自动化爬虫

使用 Cron 或 GitHub Actions 定时运行:

```bash
# 每天 20:30 运行
30 20 * * * cd /path/to/project && npm run crawler
```

## 📄 License

ISC

---

&copy; 2022-2025 新闻联播文字稿归档
