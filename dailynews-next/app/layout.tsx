import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '新闻联播文字稿归档',
  description: '每日自动爬取央视《新闻联播》文字稿，提供 Web 界面查看和归档',
  keywords: ['新闻联播', '文字稿', '新闻归档', 'CCTV'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

