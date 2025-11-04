import { useEffect, useRef } from 'react';
import * as animations from './animations';

// 页面淡入Hook
export const useFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.fadeInPage(ref.current);
    }
  }, []);

  return ref;
};

// 卡片交错动画Hook
export const useStaggerCards = (selector: string) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(selector);
      if (elements.length > 0) {
        animations.staggerCards(elements);
      }
    }
  }, [selector]);

  return containerRef;
};

// 数字动画Hook
export const useNumberAnimation = (value: number) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && value) {
      animations.animateNumber(ref.current, value);
    }
  }, [value]);

  return ref;
};

// 标题动画Hook
export const useTitleAnimation = () => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (ref.current) {
      animations.animateTitle(ref.current);
    }
  }, []);

  return ref;
};

// 移除了以下 Hooks，因为对应的动画函数已删除：
// - useScrollReveal (过度设计)
// - useHoverScale (CSS hover 更自然)

