/**
 * 爬虫诊断测试脚本
 * 用于测试爬虫各个环节是否正常工作
 */

const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

// 获取当前日期
function getDate() {
	const add0 = (num) => (num < 10 ? "0" + num : num);
	const date = new Date();
	return "" + date.getFullYear() + add0(date.getMonth() + 1) + add0(date.getDate());
}

// HTTP 请求封装
async function fetchHTML(url) {
	try {
		const response = await fetch(url, {
			headers: {
				accept: "text/html, */*; q=0.01",
				"accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
				"cache-control": "no-cache",
				pragma: "no-cache",
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				referer: url,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const html = await response.text();

		return html;
	} catch (error) {
		throw error;
	}
}

// 测试获取新闻列表
async function testGetNewsList(date) {
	try {
		const url = `http://tv.cctv.com/lm/xwlb/day/${date}.shtml`;
		const html = await fetchHTML(url);

		// 保存原始 HTML 用于调试
		const fs = require("fs");
		const debugPath = `/tmp/cctv-${date}.html`;
		fs.writeFileSync(debugPath, html);

		const fullHTML = `<!DOCTYPE html><html><head></head><body>${html}</body></html>`;
		const dom = new JSDOM(fullHTML);
		const nodes = dom.window.document.querySelectorAll("a");

		const links = [];
		nodes.forEach((node) => {
			const link = node.href;
			if (link && !links.includes(link)) {
				links.push(link);
			}
		});

		if (links.length > 0) {
			links.slice(0, 5).forEach((link, i) => {});
		}

		const abstract = links.shift();

		if (!abstract || links.length === 0) {
			return null;
		}

		return { abstract, news: links };
	} catch (error) {
		return null;
	}
}

// 测试获取新闻摘要
async function testGetAbstract(link) {
	try {
		const html = await fetchHTML(link);
		const dom = new JSDOM(html);

		const selector = "#page_body > div.allcontent > div.video18847 > div.playingCon > div.nrjianjie_shadow > div > ul > li:nth-child(1) > p";

		const element = dom.window.document.querySelector(selector);

		if (!element) {
			// 尝试其他可能的选择器
			const alternatives = [".nrjianjie_shadow", ".playingCon", "#content_area", ".video_brief"];

			for (const alt of alternatives) {
				const altElement = dom.window.document.querySelector(alt);
			}

			return null;
		}

		const abstract = element.innerHTML;

		return abstract;
	} catch (error) {
		return null;
	}
}

// 测试获取单条新闻
async function testGetSingleNews(url) {
	try {
		const html = await fetchHTML(url);
		const dom = new JSDOM(html);

		const titleSelector = "#page_body > div.allcontent > div.video18847 > div.playingVideo > div.tit";
		const contentSelector = "#content_area";

		const titleElement = dom.window.document.querySelector(titleSelector);
		const contentElement = dom.window.document.querySelector(contentSelector);

		if (!titleElement) {
		} else {
			const title = titleElement.innerHTML.replace("[视频]", "").trim();
		}

		if (!contentElement) {
		} else {
			const content = contentElement.innerHTML.trim();
		}

		return {
			title: titleElement?.innerHTML?.replace("[视频]", "").trim() || "无标题",
			content: contentElement?.innerHTML?.trim() || "无内容",
		};
	} catch (error) {
		return null;
	}
}

// 主测试函数
async function main() {
	// 获取测试日期（可以从命令行参数指定）
	const testDate = process.argv[2] || getDate();

	// 测试 1: 获取新闻列表
	const newsList = await testGetNewsList(testDate);

	if (!newsList) {
		process.exit(1);
	}

	// 测试 2: 获取摘要
	await testGetAbstract(newsList.abstract);

	// 测试 3: 获取第一条新闻详情
	if (newsList.news.length > 0) {
		await testGetSingleNews(newsList.news[0]);
	}
}

main().catch(console.error);
