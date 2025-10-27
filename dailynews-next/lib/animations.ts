import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 页面淡入动画
export const fadeInPage = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );
};

// 卡片交错动画
export const staggerCards = (elements: NodeListOf<Element> | Element[]) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    }
  );
};

// 统计数字动画
export const animateNumber = (
  element: HTMLElement,
  finalValue: number,
  duration: number = 2
) => {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: finalValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.value).toLocaleString();
    },
  });
};

// 悬浮动画
export const hoverScale = (element: HTMLElement) => {
  const handleMouseEnter = () => {
    gsap.to(element, {
      scale: 1.03,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// 标题动画
export const animateTitle = (element: HTMLElement) => {
  const chars = element.textContent?.split('') || [];
  element.innerHTML = chars
    .map((char) => `<span class="char">${char}</span>`)
    .join('');

  gsap.fromTo(
    element.querySelectorAll('.char'),
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'back.out(1.7)',
    }
  );
};

// 滚动触发动画
export const scrollReveal = (elements: NodeListOf<Element> | Element[]) => {
  elements.forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
};

// 按钮波纹效果
export const rippleEffect = (element: HTMLElement, x: number, y: number) => {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = element.getBoundingClientRect();
  ripple.style.left = `${x - rect.left}px`;
  ripple.style.top = `${y - rect.top}px`;
  element.appendChild(ripple);

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 4,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    }
  );
};

// 页面转场动画
export const pageTransition = (onComplete?: () => void) => {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  const tl = gsap.timeline({
    onComplete: () => {
      overlay.remove();
      onComplete?.();
    },
  });

  tl.fromTo(
    overlay,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.4, ease: 'power2.in' }
  ).to(overlay, { scaleX: 0, duration: 0.4, ease: 'power2.out' });
};

// 导航栏动画
export const animateNav = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
  );
};

// 搜索框聚焦动画
export const focusAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
  });
};

export const blurAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

