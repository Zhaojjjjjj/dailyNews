// 简化的动画系统 - 只保留必要、真实的动效

// 简单的淡入 - 用于内容加载
export const fadeInPage = (element: HTMLElement) => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(8px)';
  
  requestAnimationFrame(() => {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  });
};

// 列表交错淡入 - 克制、自然
export const staggerCards = (elements: NodeListOf<Element> | Element[]) => {
  Array.from(elements).forEach((element, index) => {
    const el = element as HTMLElement;
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 40);
  });
};

// 数字计数动画 - 保持这个，因为它实用
export const animateNumber = (
  element: HTMLElement,
  finalValue: number,
  duration: number = 1.5
) => {
  const start = 0;
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    
    // easeOut
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (finalValue - start) * eased);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = finalValue.toLocaleString();
    }
  };
  
  animate();
};

// 标题动画 - 移除逐字动画，改为简单淡入
export const animateTitle = (element: HTMLElement) => {
  fadeInPage(element);
};

// 按钮波纹 - 简化为原生效果
export const rippleEffect = (element: HTMLElement, x: number, y: number) => {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = element.getBoundingClientRect();
  ripple.style.left = `${x - rect.left}px`;
  ripple.style.top = `${y - rect.top}px`;
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.style.transform = 'scale(3)';
    ripple.style.opacity = '0';
  }, 0);
  
  setTimeout(() => ripple.remove(), 600);
};

// 移除了不必要的动画函数:
// - focusAnimation/blurAnimation (CSS 就够了)
// - hoverScale (CSS hover 更自然)
// - scrollReveal (过度设计)
// - pageTransition (不实用)
// - animateNav (CSS transition 足够)

