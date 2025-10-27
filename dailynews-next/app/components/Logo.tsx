'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  return (
    <Link href="/">
      <div className="logo" ref={logoRef}>
        <div className="logo-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c41e3a" />
                <stop offset="100%" stopColor="#e63946" />
              </linearGradient>
            </defs>
            
            {/* 外圆环 */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="4" />
            
            {/* 中文"新"字的简化设计 */}
            <path
              d="M 30 25 L 30 75 M 50 35 L 50 75 M 70 25 L 70 75 M 25 45 L 75 45"
              stroke="url(#logoGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* 装饰点 */}
            <circle cx="50" cy="50" r="3" fill="url(#logoGradient)" />
          </svg>
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

