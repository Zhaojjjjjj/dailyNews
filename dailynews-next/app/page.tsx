'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  date: string;
  abstract: string;
  news_count: number;
  created_at: string;
}

interface Stats {
  totalCount: number;
  latestDate: string;
  totalNews: number;
}

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取统计信息
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // 获取最新 10 条新闻
        const newsRes = await fetch('/api/news?limit=10');
        const newsData = await newsRes.json();
        if (newsData.success) {
          setLatestNews(newsData.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <header className="header">
          <div className="header-content">
            <h1 className="site-title">《新闻联播》文字稿</h1>
            <p className="site-subtitle">每日自动更新 · 权威新闻归档</p>
          </div>
          <nav className="nav-tabs">
            <Link href="/" className="nav-item active">
              首页
            </Link>
            <Link href="/archive" className="nav-item">
              完整归档
            </Link>
          </nav>
        </header>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="header">
          <div className="header-content">
            <h1 className="site-title">《新闻联播》文字稿</h1>
            <p className="site-subtitle">每日自动更新 · 权威新闻归档</p>
          </div>
          <nav className="nav-tabs">
            <Link href="/" className="nav-item active">
              首页
            </Link>
            <Link href="/archive" className="nav-item">
              完整归档
            </Link>
          </nav>
        </header>
        <div className="container">
          <div className="error">
            <h2>加载失败</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 className="site-title">《新闻联播》文字稿</h1>
          <p className="site-subtitle">每日自动更新 · 权威新闻归档</p>
        </div>
        <nav className="nav-tabs">
          <Link href="/" className="nav-item active">
            首页
          </Link>
          <Link href="/archive" className="nav-item">
            完整归档
          </Link>
        </nav>
      </header>

      <div className="container">
        {/* 统计信息卡片 */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats?.totalCount || 0}</div>
            <div className="stat-label">总计文字稿</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {stats?.latestDate ? formatDate(stats.latestDate) : '-'}
            </div>
            <div className="stat-label">最新更新</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.totalNews || 0}</div>
            <div className="stat-label">累计新闻</div>
          </div>
        </div>

        {/* 最新内容 */}
        <div className="content-section">
          <h2 className="section-title">最新文字稿</h2>
          <div className="news-list">
            {latestNews.map((item) => (
              <Link href={`/news/${item.date}`} key={item.id}>
                <div className="news-item">
                  <div className="news-date">{formatDate(item.date)}</div>
                  <div className="news-abstract">{item.abstract}</div>
                  <div className="news-meta">共 {item.news_count} 条新闻</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2022-2025 新闻联播文字稿归档 | 数据来源: CCTV</p>
      </footer>
    </div>
  );
}

