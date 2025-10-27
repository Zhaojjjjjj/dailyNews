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

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

export default function Archive() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

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

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
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
        {/* 搜索栏 */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="搜索关键词..."
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* 完整归档列表 */}
        <div className="content-section">
          <h2 className="section-title">
            完整归档 ({filteredNews.length} 条记录)
          </h2>
          <div className="news-list">
            {filteredNews.map((item) => (
              <Link href={`/news/${item.date}`} key={item.id}>
                <div className="news-item">
                  <div className="news-date">{formatDate(item.date)}</div>
                  <div className="news-abstract">{item.abstract}</div>
                  <div className="news-meta">共 {item.news_count} 条新闻</div>
                </div>
              </Link>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="error">
              <p>没有找到匹配的结果</p>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2022-2025 新闻联播文字稿归档 | 数据来源: CCTV</p>
      </footer>
    </div>
  );
}

