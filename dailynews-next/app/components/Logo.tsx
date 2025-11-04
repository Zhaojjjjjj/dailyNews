import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link href="/">
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* 简化的标识 - 使用当前文字颜色 */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            
            {/* "新"字简化设计 */}
            <path
              d="M 30 25 L 30 75 M 50 35 L 50 75 M 70 25 L 70 75 M 25 45 L 75 45"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            
            <circle cx="50" cy="50" r="2.5" fill="currentColor" />
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

