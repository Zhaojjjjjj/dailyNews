'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import AnimatedBackground from '../components/AnimatedBackground';
import Logo from '../components/Logo';
import Pagination from '../components/Pagination';
import { staggerCards, focusAnimation, blurAnimation } from '@/lib/animations';

interface NewsItem {
  id: number;
  date: string;
  abstract: string;
  news_count: number;
  created_at: string;
}

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

const ITEMS_PER_PAGE = 20;

export default function Archive() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const searchRef = useRef<HTMLInputElement>(null);
  const newsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/news?all=true');
        const data = await res.json();
        if (data.success) {
          setAllNews(data.data);
          setFilteredNews(data.data);
        } else {
          setError(data.error || '加载失败');
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
  
  // 动画效果（当页面改变时触发）
  useEffect(() => {
    if (!loading && !error && newsListRef.current) {
      const items = newsListRef.current.querySelectorAll('.news-item');
      setTimeout(() => {
        staggerCards(items);
      }, 100);
    }
  }, [loading, error, currentPage, filteredNews]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1); // 重置到第一页
    if (!keyword.trim()) {
      setFilteredNews(allNews);
      return;
    }

    const filtered = allNews.filter(
      (item) =>
        item.abstract.toLowerCase().includes(keyword.toLowerCase()) ||
        formatDate(item.date).includes(keyword)
    );
    setFilteredNews(filtered);
  };
  
  // 计算当前页显示的新闻
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div>
        <header className="header">
          <div className="header-content">
            <h1 className="site-title">《新闻联播》文字稿</h1>
            <p className="site-subtitle">每日自动更新 · 权威新闻归档</p>
          </div>
          <nav className="nav-tabs">
            <Link href="/" className="nav-item">
              首页
            </Link>
            <Link href="/archive" className="nav-item active">
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
            <Link href="/" className="nav-item">
              首页
            </Link>
            <Link href="/archive" className="nav-item active">
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
          <h1 className="site-title">《新闻联播》文字稿</h1>
          <p className="site-subtitle">每日自动更新 · 权威新闻归档</p>
        </div>
        <nav className="nav-tabs">
          <Link href="/" className="nav-item">
            首页
          </Link>
          <Link href="/archive" className="nav-item active">
            完整归档
          </Link>
        </nav>
      </header>

      <div className="container">
        {/* 搜索栏 */}
        <div className="search-bar">
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            placeholder="🔍 搜索关键词..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={(e) => focusAnimation(e.currentTarget)}
            onBlur={(e) => blurAnimation(e.currentTarget)}
          />
        </div>

        {/* 完整归档列表 */}
        <div className="content-section">
          <h2 className="section-title">
            完整归档 ({filteredNews.length} 条记录)
          </h2>
          
          {filteredNews.length === 0 ? (
            <div className="error">
              <p>没有找到匹配的结果</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2022-2025 新闻联播文字稿归档 | 数据来源: CCTV</p>
      </footer>
    </div>
  );
}

