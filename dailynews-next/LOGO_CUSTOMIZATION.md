# Logo 自定义指南

本项目支持灵活的 Logo 自定义功能，您可以轻松更换网站的 Logo 和品牌标识。

## Logo 组件位置

Logo 组件位于：`app/components/Logo.tsx`

## 自定义方法

### 方法 1: 修改 SVG Logo（推荐）

直接编辑 `Logo.tsx` 文件中的 SVG 代码：

```tsx
// 在 Logo.tsx 中找到 <svg> 标签
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  {/* 这里是 SVG 图形代码 */}
  {/* 您可以使用任何 SVG 编辑器（如 Figma, Illustrator）设计 Logo */}
  {/* 然后导出为 SVG 代码并粘贴到这里 */}
</svg>
```

**优点**：
- 矢量图形，任何尺寸都清晰
- 可以使用渐变色和动画效果
- 文件体积小

### 方法 2: 使用图片文件

1. 将您的 Logo 图片（PNG/SVG）放到 `public/` 目录下，例如：`public/logo.png`

2. 修改 `Logo.tsx` 文件：

```tsx
import Image from 'next/image';

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link href="/">
      <div className="logo" ref={logoRef}>
        <div className="logo-icon">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={60} 
            height={60}
            priority
          />
        </div>
        {showText && (
          <div className="logo-text">
            <span className="logo-title">新闻联播</span>
            <span className="logo-subtitle">Daily News</span>
          </div>
        )}
      </div>
    </Link>
  );
}
```

### 方法 3: 修改渐变色

Logo 使用渐变色，您可以在 `Logo.tsx` 中修改颜色：

```tsx
<linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor="#c41e3a" />  {/* 起始颜色 */}
  <stop offset="100%" stopColor="#e63946" /> {/* 结束颜色 */}
</linearGradient>
```

## 自定义文字内容

在 `Logo.tsx` 中修改文字部分：

```tsx
<div className="logo-text">
  <span className="logo-title">新闻联播</span>     {/* 主标题 */}
  <span className="logo-subtitle">Daily News</span> {/* 副标题 */}
</div>
```

## 自定义样式

Logo 的样式在 `app/globals.css` 中定义，您可以修改：

```css
.logo-icon {
  width: 60px;        /* Logo 宽度 */
  height: 60px;       /* Logo 高度 */
}

.logo-title {
  font-size: 1.5rem;  /* 主标题字体大小 */
  font-weight: 800;   /* 字体粗细 */
}

.logo-subtitle {
  font-size: 0.75rem; /* 副标题字体大小 */
}
```

## 禁用 Logo 文字

如果您只想显示图标，不显示文字，可以在使用 Logo 组件时传入 `showText={false}`：

```tsx
<Logo showText={false} />
```

## 动画效果自定义

Logo 包含入场动画和悬浮效果，您可以在 `Logo.tsx` 的 `useEffect` 中调整动画参数：

```tsx
useEffect(() => {
  if (logoRef.current) {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, rotate: -10 },
      { 
        opacity: 1, 
        scale: 1, 
        rotate: 0, 
        duration: 0.8,        // 动画持续时间
        ease: 'back.out(1.7)' // 动画缓动函数
      }
    );
  }
}, []);
```

## 在线 SVG Logo 工具推荐

- **Figma**: https://www.figma.com/
- **SVG Editor**: https://editor.method.ac/
- **Vectr**: https://vectr.com/
- **LogoMakr**: https://logomakr.com/

## 示例：快速替换为自己的 Logo

1. 使用 Figma 等工具设计您的 Logo
2. 导出为 SVG 格式
3. 打开 SVG 文件，复制内部的 `<path>` 等元素
4. 粘贴到 `Logo.tsx` 的 `<svg>` 标签内
5. 调整 `viewBox` 和尺寸以适配您的设计
6. 保存文件，刷新浏览器查看效果

## 需要帮助？

如果您在自定义 Logo 时遇到问题：

1. 确保 SVG viewBox 设置正确
2. 检查颜色代码格式是否正确（#rrggbb）
3. 确保图片路径以 `/` 开头（相对于 public 目录）
4. 使用浏览器开发工具检查 CSS 样式是否生效

---

**提示**：修改后如果看不到效果，请尝试清除浏览器缓存或使用隐身模式打开。

