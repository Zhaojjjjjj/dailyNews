"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import AnimatedBackground from "./components/AnimatedBackground";
import Logo from "./components/Logo";
import Pagination from "./components/Pagination";
import { staggerCards, animateNumber, animateTitle } from "@/lib/animations";

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
	const [error, setError] = useState("");

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
				const statsRes = await fetch("/api/stats");
				const statsData = await statsRes.json();
				if (statsData.success) {
					setStats(statsData.data);
				}

				// 获取最新 50 条新闻用于分页
				const newsRes = await fetch("/api/news?limit=50");
				const newsData = await newsRes.json();
				if (newsData.success) {
					setAllNews(newsData.data);
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

	// 计算当前页显示的新闻
	const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);
	const currentNews = allNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
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
				const cards = statsRef.current.querySelectorAll(".stat-card");
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
			const items = newsListRef.current.querySelectorAll(".news-item");
			setTimeout(() => {
				staggerCards(items);
			}, 100);
		}
	}, [loading, error, currentPage, currentNews]);

	if (loading) {
		return (
			<div>
				<header className="header">
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
		<div className="page-wrapper">
			<AnimatedBackground />
			
			{/* 导航栏 */}
			<header className="header">
				<div className="header-inner">
					<Logo showText={false} />
					<nav className="nav-tabs">
						<Link href="/" className="nav-item active">
							首页
						</Link>
						<Link href="/archive" className="nav-item">
							完整归档
						</Link>
					</nav>
				</div>
			</header>

			{/* Hero 区域 */}
			<section className="hero-section">
				<div className="hero-content">
					<h1 className="hero-title" ref={titleRef}>
						新闻联播文字稿归档
					</h1>
					<p className="hero-subtitle">
						每日更新 · 完整收录 · 便捷查阅
					</p>
					
					{/* 统计信息 */}
					<div className="hero-stats" ref={statsRef}>
						<div className="hero-stat-item stat-card">
							<div className="hero-stat-number" ref={statNumber1}>0</div>
							<div className="hero-stat-label">文字稿</div>
						</div>
						<div className="hero-stat-divider"></div>
						<div className="hero-stat-item stat-card">
							<div className="hero-stat-number" ref={statNumber3}>0</div>
							<div className="hero-stat-label">条新闻</div>
						</div>
						<div className="hero-stat-divider"></div>
						<div className="hero-stat-item stat-card">
							<div className="hero-stat-number" ref={statNumber2}>
								{stats?.latestDate ? formatDate(stats.latestDate) : "-"}
							</div>
							<div className="hero-stat-label">最新更新</div>
						</div>
					</div>
				</div>
			</section>

			{/* 主内容区 */}
			<main className="main-content">
				<div className="container">
					<div className="content-header">
						<h2 className="section-title">最新文字稿</h2>
						<Link href="/archive" className="view-all-link">
							查看全部 →
						</Link>
					</div>
					
					<div className="news-grid" ref={newsListRef}>
						{currentNews.map((item, index) => (
							<Link href={`/news/${item.date}`} key={item.id}>
								<article className={`news-card news-item ${index === 0 ? 'featured' : ''}`}>
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
