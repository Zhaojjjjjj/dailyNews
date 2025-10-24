/**
 * 详情页逻辑
 */
import { getQueryString, formatDateCN, shareArticle, loadMarkdown, showError } from './utils.js';

// 将 shareArticle 暴露到全局
window.shareArticle = shareArticle;

// 主逻辑
const date = getQueryString('date') || 'Error';
const formattedDate = formatDateCN(date);

// 更新标题和副标题
document.title = formattedDate + ' - 新闻联播文字稿';
document.getElementById('current-date').textContent = formattedDate;

// 加载文字稿
loadMarkdown(`/public/news/${date}.md`)
	.then((md) => {
		render(md);
	})
	.catch((error) => {
		console.error('加载失败:', error);
		// 尝试加载错误页面
		loadMarkdown('/src/assets/lib/Error.md')
			.then((errMd) => {
				render(errMd);
			})
			.catch(() => {
				const viewContainer = document.getElementById('view');
				showError(viewContainer, '无法加载该日期的文字稿，请检查日期是否正确或稍后重试。');
			});
	});

function render(markdown) {
	const converter = new showdown.Converter({
		tables: true,
		strikethrough: true,
		tasklists: true,
		openLinksInNewWindow: true
	});
	document.getElementById('view').innerHTML = converter.makeHtml(markdown);
	
	// 添加平滑滚动到顶部
	window.scrollTo({ top: 0, behavior: 'smooth' });
}
