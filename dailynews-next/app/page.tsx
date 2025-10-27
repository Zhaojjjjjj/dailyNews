'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import AnimatedBackground from './components/AnimatedBackground';
import Logo from './components/Logo';
import Pagination from './components/Pagination';
import { staggerCards, animateNumber, animateTitle } from '@/lib/animations';

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

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const newsListRef = useRef<HTMLDivElement>(null);
  const statNumber1 = useRef<HTMLDivElement>(null);
  const statNumber2 = useRef<HTMLDivElement>(null);
  const statNumber3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取统计信息
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // 获取最新 50 条新闻用于分页
        const newsRes = await fetch('/api/news?limit=50');
        const newsData = await newsRes.json();
        if (newsData.success) {
          setAllNews(newsData.data);
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
  
  // 计算当前页显示的新闻
  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);
  const currentNews = allNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 动画效果
  useEffect(() => {
    if (!loading && !error) {
      // 标题动画
      if (titleRef.current) {
        animateTitle(titleRef.current);
      }
      
      // 统计卡片动画
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll('.stat-card');
        staggerCards(cards);
      }
      
      // 数字动画
      if (stats) {
        if (statNumber1.current) {
          animateNumber(statNumber1.current, stats.totalCount);
        }
        if (statNumber3.current) {
          animateNumber(statNumber3.current, stats.totalNews);
        }
      }
    }
  }, [loading, error, stats]);
  
  // 新闻列表动画（当页面改变时触发）
  useEffect(() => {
    if (!loading && !error && newsListRef.current) {
      const items = newsListRef.current.querySelectorAll('.news-item');
      setTimeout(() => {
        staggerCards(items);
      }, 100);
    }
  }, [loading, error, currentPage, currentNews]);

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
      <AnimatedBackground />
      <header className="header">
        <div className="header-content">
          <Logo />
          <h1 className="site-title" ref={titleRef}>《新闻联播》文字稿</h1>
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
        <div className="stats-section" ref={statsRef}>
          <div className="stat-card">
            <div className="stat-number" ref={statNumber1}>0</div>
            <div className="stat-label">总计文字稿</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" ref={statNumber2}>
              {stats?.latestDate ? formatDate(stats.latestDate) : '-'}
            </div>
            <div className="stat-label">最新更新</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" ref={statNumber3}>0</div>
            <div className="stat-label">累计新闻</div>
          </div>
        </div>

        {/* 最新内容 */}
        <div className="content-section">
          <h2 className="section-title">最新文字稿</h2>
          <div className="news-list" ref={newsListRef}>
            {currentNews.map((item) => (
              <Link href={`/news/${item.date}`} key={item.id}>
                <div className="news-item">
                  <div className="news-date">{formatDate(item.date)}</div>
                  <div className="news-abstract">{item.abstract}</div>
                  <div className="news-meta">共 {item.news_count} 条新闻</div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 分页 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2022-2025 新闻联播文字稿归档 | 数据来源: CCTV</p>
      </footer>
    </div>
  );
}

