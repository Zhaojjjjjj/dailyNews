import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
	title: "Daily News",
	description: "每日自动爬取央视《新闻联播》文字稿，提供 Web 界面查看和归档",
	keywords: ["新闻联播", "文字稿", "新闻归档", "CCTV"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh-CN">
			<body>
				{children}
				<ThemeToggle />
			</body>
		</html>
	);
}
