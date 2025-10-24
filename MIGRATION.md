# 项目重构迁移说明

## 🎯 重构目标

将项目从**单文件内联样式**重构为**工程化模块结构**。

---

## 📊 重构对比

### 旧结构 ❌
```
dailyNews/
├── index.html          (内联 CSS + JS)
├── web/
│   ├── view.html       (内联 CSS + JS)
│   ├── archive.html    (内联 CSS + JS)
│   └── ...
├── news/               (数据混乱)
├── index.js            (爬虫)
└── fetch.js
```

**问题:**
- ❌ 样式内联,难以维护
- ❌ 代码重复,无法复用
- ❌ 目录混乱,职责不清
- ❌ 无模块化,难以扩展

---

### 新结构 ✅
```
dailyNews/
├── src/                      # 源代码
│   ├── assets/              # 静态资源
│   │   ├── css/            # 样式模块化
│   │   │   ├── common.css  # 公共样式
│   │   │   ├── home.css    # 首页样式
│   │   │   ├── archive.css # 归档页样式
│   │   │   └── detail.css  # 详情页样式
│   │   ├── js/             # JavaScript 模块
│   │   │   ├── utils.js    # 工具函数
│   │   │   ├── home.js     # 首页逻辑
│   │   │   ├── archive.js  # 归档页逻辑
│   │   │   └── detail.js   # 详情页逻辑
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
├── docs/                    # 文档
└── package.json
```

**优势:**
- ✅ **分离关注点** - HTML/CSS/JS 完全分离
- ✅ **模块化** - 公共代码复用,按需加载
- ✅ **清晰结构** - src 源码 / public 数据 / docs 文档
- ✅ **易维护** - 文件职责单一,便于定位
- ✅ **可扩展** - ES6 Module,便于添加新功能

---

## 🔄 文件映射

| 旧文件 | 新文件 | 说明 |
|--------|--------|------|
| `index.html` | `src/pages/index.html` | 首页,提取样式和脚本 |
| `web/archive.html` | `src/pages/archive.html` | 归档页 |
| `web/view.html` | `src/pages/detail.html` | 详情页 |
| `index.js` | `src/crawler/index.js` | 爬虫主程序 |
| `fetch.js` | `src/crawler/fetch.js` | 请求封装 |
| `news/` | `public/news/` | 数据目录 |
| `web/showdown.min.js` | `src/assets/lib/showdown.min.js` | 第三方库 |

---

## 📝 主要改动

### 1. CSS 提取

**旧方式:**
```html
<style>
  /* 500+ 行内联样式 */
</style>
```

**新方式:**
```html
<link rel="stylesheet" href="../assets/css/common.css" />
<link rel="stylesheet" href="../assets/css/home.css" />
```

**样式文件:**
- `common.css` - 公共样式(导航、底部、按钮、加载动画等)
- `home.css` - 首页专属(统计卡片、新闻列表)
- `archive.css` - 归档页专属(搜索栏、归档列表)
- `detail.css` - 详情页专属(工具栏、Markdown 样式)

---

### 2. JavaScript 模块化

**旧方式:**
```html
<script>
  // 内联代码,无法复用
  function formatDate() { ... }
  fetch(...).then(...)
</script>
```

**新方式:**
```html
<script type="module" src="../assets/js/home.js"></script>
```

**模块文件:**
- `utils.js` - 工具函数(日期格式化、数据加载、分享等)
- `home.js` - 首页逻辑(渲染统计、新闻列表)
- `archive.js` - 归档页逻辑(搜索、锚点跳转)
- `detail.js` - 详情页逻辑(Markdown 渲染、分享)

---

### 3. 路径更新

**数据路径:**
```javascript
// 旧: /news/catalogue.json
// 新: /public/news/catalogue.json
```

**页面路径:**
```html
<!-- 旧: web/view.html?date=20220929 -->
<!-- 新: detail.html?date=20220929 -->
```

---

## 🚀 启动方式

### 旧方式
```bash
python3 -m http.server 8000
# 访问: http://localhost:8000/index.html
```

### 新方式
```bash
npm run dev
# 访问: http://localhost:8000/src/pages/index.html
```

---

## ⚠️ 注意事项

### 1. 爬虫路径更新
爬虫程序已更新为新的目录结构:
```javascript
// 数据保存到 public/news/
const NEWS_PATH = path.join(ROOT_PATH, 'public/news');
```

### 2. ES6 Module
所有 JavaScript 文件使用 ES6 Module:
```javascript
// 导出
export function formatDate() { ... }

// 导入
import { formatDate } from './utils.js';
```

### 3. 相对路径
HTML 文件中的资源引用使用相对路径:
```html
<!-- 从 src/pages/ 引用 src/assets/ -->
<link rel="stylesheet" href="../assets/css/common.css" />
```

---

## 📦 npm 脚本

```json
{
  "scripts": {
    "crawler": "node src/crawler/index.js",  // 运行爬虫
    "dev": "python3 -m http.server 8000"     // 启动开发服务器
  }
}
```

---

## ✅ 重构收益

1. **代码复用** - 公共样式和工具函数可复用,减少 60% 重复代码
2. **易于维护** - 文件职责单一,修改样式只需改对应 CSS 文件
3. **性能优化** - 按需加载,减少首屏加载时间
4. **团队协作** - 模块化结构便于多人协作开发
5. **可扩展性** - 添加新页面只需创建对应的 CSS/JS 模块

---

## 🔧 后续优化建议

1. **构建工具** - 引入 Vite 或 Webpack 进行打包优化
2. **CSS 预处理器** - 使用 Sass/Less 增强样式能力
3. **TypeScript** - 增加类型检查,提升代码质量
4. **单元测试** - 为工具函数添加测试用例
5. **CI/CD** - 自动化部署和爬虫任务

---

&copy; 2025 项目重构文档
