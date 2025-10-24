/**
 * 归档页逻辑
 */
import { formatDate, loadJSON, showError } from './utils.js';

let allData = [];

// 加载数据
loadJSON('/public/news/catalogue.json')
	.then((data) => {
		allData = data;
		renderArchive(data);
	})
	.catch((error) => {
		console.error('加载失败:', error);
		const listContainer = document.getElementById('archive-list');
		showError(listContainer, '加载失败，请刷新重试');
	});

function renderArchive(data) {
	const listContainer = document.getElementById('archive-list');
	document.getElementById('total-count').textContent = data.length;

	if (data.length === 0) {
		listContainer.innerHTML = '<div class="no-result">暂无数据</div>';
		return;
	}

	let html = '';
	data.forEach((item) => {
		const date = item.date;
		const abstract = item.abstract.replaceAll('\n', ' ').substring(0, 150) + '...';
		
		html += `
			<div class="archive-item" id="${date}">
				<div class="archive-date">${formatDate(date)}</div>
				<div class="archive-abstract">${abstract}</div>
				<a href="detail.html?date=${date}" class="archive-link">阅读全文</a>
			</div>
		`;
	});

	listContainer.innerHTML = html;

	// 处理锚点跳转
	if (window.location.hash) {
		const targetId = window.location.hash.substring(1);
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			setTimeout(() => {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				targetElement.style.background = '#fff5f5';
				setTimeout(() => {
					targetElement.style.background = '';
				}, 2000);
			}, 100);
		}
	}
}

// 搜索功能
window.searchArchive = function() {
	const keyword = document.getElementById('search-input').value.trim().toLowerCase();
	
	if (!keyword) {
		renderArchive(allData);
		return;
	}

	const filtered = allData.filter((item) => {
		const date = item.date.toLowerCase();
		const abstract = item.abstract.toLowerCase();
		return date.includes(keyword) || abstract.includes(keyword);
	});

	renderArchive(filtered);

	if (filtered.length === 0) {
		document.getElementById('archive-list').innerHTML = 
			'<div class="no-result">未找到匹配的结果</div>';
	}
};

// 回车搜索
document.getElementById('search-input').addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		searchArchive();
	}
});
