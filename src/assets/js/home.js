/**
 * 首页逻辑
 */
import { formatDate, loadJSON, showError } from './utils.js';

// 加载数据
loadJSON('/public/news/catalogue.json')
	.then((data) => {
		renderHomePage(data);
	})
	.catch((error) => {
		console.error('加载失败:', error);
		const listContainer = document.getElementById('latest-list');
		showError(listContainer, '加载失败，请刷新重试');
	});

function renderHomePage(data) {
	// 更新统计信息
	const totalCount = data.length;
	const latestDate = data[0]?.date || '-';
	const totalNews = totalCount * 19; // 估算,每天约19条新闻

	document.getElementById('total-count').textContent = totalCount;
	document.getElementById('latest-date').textContent = formatDate(latestDate);
	document.getElementById('total-news').textContent = totalNews + '+';

	// 渲染最新10条
	const latestNews = data.slice(0, 10);
	const listContainer = document.getElementById('latest-list');
	
	if (latestNews.length === 0) {
		listContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;">暂无数据</div>';
		return;
	}

	let html = '';
	latestNews.forEach((item) => {
		const date = item.date;
		const abstract = item.abstract.replaceAll('\n', ' ').substring(0, 200) + '...';
		
		html += `
			<div class="news-item">
				<div class="news-date">${formatDate(date)}</div>
				<div class="news-abstract">${abstract}</div>
				<div class="news-actions">
					<a href="detail.html?date=${date}" class="btn btn-primary">阅读全文</a>
					<a href="archive.html#${date}" class="btn btn-secondary">查看归档</a>
				</div>
			</div>
		`;
	});

	listContainer.innerHTML = html;
}
