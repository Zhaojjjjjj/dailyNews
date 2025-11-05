"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import AnimatedBackground from "../components/AnimatedBackground";
import Logo from "../components/Logo";
import Pagination from "../components/Pagination";
import { staggerCards } from "@/lib/animations";

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
	const [error, setError] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	const searchRef = useRef<HTMLInputElement>(null);
	const newsListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/news?all=true");
				const data = await res.json();
				if (data.success) {
					setAllNews(data.data);
					setFilteredNews(data.data);
				} else {
					setError(data.error || "加载失败");
				}
				setLoading(false);
			} catch (err) {
				console.error("加载数据失败:", err);
				setError("加载数据失败，请稍后重试");
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// 动画效果（当页面改变时触发）
	useEffect(() => {
		if (!loading && !error && newsListRef.current) {
			const items = newsListRef.current.querySelectorAll(".news-item");
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

		const filtered = allNews.filter((item) => item.abstract.toLowerCase().includes(keyword.toLowerCase()) || formatDate(item.date).includes(keyword));
		setFilteredNews(filtered);
	};

	// 计算当前页显示的新闻
	const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
	const currentNews = filteredNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (loading) {
		return (
			<div>
				<header className="header">
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
		<div className="page-wrapper">
			<AnimatedBackground />
			
			{/* 导航栏 */}
			<header className="header">
				<div className="header-inner">
					<Logo showText={false} />
					<nav className="nav-tabs">
						<Link href="/" className="nav-item">
							首页
						</Link>
						<Link href="/archive" className="nav-item active">
							完整归档
						</Link>
					</nav>
				</div>
			</header>

			{/* 页面头部 */}
			<section className="archive-header">
				<div className="container">
					<h1 className="archive-title">完整归档</h1>
					<p className="archive-subtitle">共 {filteredNews.length} 条记录</p>
					
					{/* 搜索栏 */}
					<div className="search-wrapper">
						<svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<input 
							ref={searchRef} 
							type="text" 
							className="search-input" 
							placeholder="搜索日期或关键词..." 
							value={searchKeyword} 
							onChange={(e) => handleSearch(e.target.value)} 
						/>
						{searchKeyword && (
							<button 
								className="search-clear"
								onClick={() => handleSearch('')}
								aria-label="清除搜索"
							>
								×
							</button>
						)}
					</div>
				</div>
			</section>

			{/* 主内容区 */}
			<main className="main-content">
				<div className="container">
					{filteredNews.length === 0 ? (
						<div className="empty-state">
							<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
								<circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
								<path d="M32 20v24M20 32h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
							</svg>
							<h3>没有找到匹配的结果</h3>
							<p>试试其他关键词</p>
						</div>
					) : (
						<>
							<div className="news-grid" ref={newsListRef}>
								{currentNews.map((item) => (
									<Link href={`/news/${item.date}`} key={item.id}>
										<article className="news-card news-item">
											<div className="news-card-header">
												<time className="news-date">{formatDate(item.date)}</time>
												<span className="news-badge">{item.news_count} 条</span>
											</div>
											<p className="news-abstract">{item.abstract}</p>
											<div className="news-card-footer">
												<span className="read-more">阅读全文 →</span>
											</div>
										</article>
									</Link>
								))}
							</div>

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
			</main>

			<footer className="footer">
				<div className="footer-content">
					<p>&copy; 2022-{new Date().getFullYear()} 新闻联播文字稿归档</p>
					<p className="footer-source">数据来源: CCTV</p>
				</div>
			</footer>
		</div>
	);
}
