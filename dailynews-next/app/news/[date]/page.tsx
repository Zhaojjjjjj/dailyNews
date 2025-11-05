"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { marked } from "marked";
import AnimatedBackground from "../../components/AnimatedBackground";
import { fadeInPage, rippleEffect } from "@/lib/animations";

interface NewsDetail {
	id: number;
	date: string;
	abstract: string;
	content: string;
	news_count: number;
	created_at: string;
	updated_at: string;
}

function formatDate(dateStr: string) {
	if (!dateStr || dateStr.length !== 8) return dateStr;
	return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

export default function NewsDetail() {
	const router = useRouter();
	const params = useParams();
	const date = params.date as string;

	const [news, setNews] = useState<NewsDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`/api/news/${date}`);
				const data = await res.json();
				if (data.success) {
					setNews(data.data);
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

		if (date) {
			fetchData();
		}
	}, [date]);

	// 内容淡入动画
	useEffect(() => {
		if (!loading && !error && contentRef.current) {
			fadeInPage(contentRef.current);
		}
	}, [loading, error, news]);

	const handlePrint = () => {
		window.print();
	};

	const handleShare = () => {
		const url = window.location.href;
		const title = `新闻联播文字稿 - ${formatDate(date)}`;

		if (navigator.share) {
			navigator
				.share({
					title,
					url,
				})
				.catch(() => {
					copyToClipboard(url);
				});
		} else {
			copyToClipboard(url);
		}
	};

	const copyToClipboard = (text: string) => {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.select();

		try {
			document.execCommand("copy");
			alert("链接已复制到剪贴板！");
		} catch (err) {
			alert("复制失败，请手动复制: " + text);
		} finally {
			document.body.removeChild(textarea);
		}
	};

	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
		rippleEffect(e.currentTarget, e.clientX, e.clientY);
		callback();
	};

	if (loading) {
		return (
			<div>
				<div className="container">
					<div className="toolbar">
						<button className="btn" onClick={() => router.back()}>
							返回
						</button>
					</div>
					<div className="loading">
						<div className="spinner"></div>
						<p>加载中...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !news) {
		return (
			<div>
				<div className="container">
					<div className="toolbar">
						<button className="btn" onClick={() => router.back()}>
							返回
						</button>
					</div>
					<div className="error">
						<h2>加载失败</h2>
						<p>{error || "未找到该日期的新闻"}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="page-wrapper detail-page">
			<AnimatedBackground />
			
			{/* 工具栏 */}
			<div className="detail-toolbar">
				<div className="toolbar-inner">
					<button 
						className="btn btn-back" 
						onClick={(e) => handleButtonClick(e, () => router.back())}
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						返回
					</button>
					<div className="toolbar-actions">
						<button 
							className="btn btn-icon" 
							onClick={(e) => handleButtonClick(e, handlePrint)}
							title="打印"
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M5 7V3h10v4M5 14H3a1 1 0 01-1-1V9a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1h-2M5 14v4h10v-4M5 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
						<button 
							className="btn btn-icon" 
							onClick={(e) => handleButtonClick(e, handleShare)}
							title="分享"
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M4 12v5a1 1 0 001 1h10a1 1 0 001-1v-5M14 6l-4-4m0 0L6 6m4-4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* 主内容 */}
			<main className="detail-content" ref={contentRef}>
				<div className="container">
					<article className="article-wrapper">
						<div
							className="markdown-content"
							dangerouslySetInnerHTML={{
								__html: marked(news.content, { async: false }) as string,
							}}
						/>
					</article>
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
