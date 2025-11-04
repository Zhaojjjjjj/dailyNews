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
		<div>
			<AnimatedBackground />
			<div className="container" ref={contentRef}>
				{/* 工具栏 */}
				<div className="toolbar">
					<button className="btn" onClick={(e) => handleButtonClick(e, () => router.back())}>
						← 返回
					</button>
					<button className="btn btn-secondary" onClick={(e) => handleButtonClick(e, handlePrint)}>
						打印
					</button>
					<button className="btn btn-secondary" onClick={(e) => handleButtonClick(e, handleShare)}>
						分享
					</button>
				</div>

				{/* Markdown 内容 */}
				<div
					className="markdown-content"
					dangerouslySetInnerHTML={{
						__html: marked(news.content, { async: false }) as string,
					}}
				/>
			</div>

			<footer className="footer">
				<p>&copy; 2022-2025 新闻联播文字稿归档 | 数据来源: CCTV</p>
			</footer>
		</div>
	);
}
