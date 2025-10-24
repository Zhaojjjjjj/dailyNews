/**
 * 工具函数模块
 */

/**
 * 格式化日期: 20220929 -> 2022-09-29
 */
export function formatDate(dateStr) {
	if (!dateStr || dateStr.length !== 8) return dateStr;
	return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

/**
 * 格式化日期: 20220929 -> 2022年09月29日
 */
export function formatDateCN(dateStr) {
	if (!dateStr || dateStr.length !== 8) return dateStr;
	return `${dateStr.substring(0, 4)}年${dateStr.substring(4, 6)}月${dateStr.substring(6, 8)}日`;
}

/**
 * 获取 URL 参数
 */
export function getQueryString(name) {
	const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	const r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

/**
 * 复制文本到剪贴板
 */
export function copyToClipboard(text) {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.select();
	
	try {
		document.execCommand('copy');
		alert('链接已复制到剪贴板！');
		return true;
	} catch (err) {
		alert('复制失败，请手动复制: ' + text);
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
}

/**
 * 分享功能
 */
export function shareArticle() {
	const url = window.location.href;
	const title = document.title;
	
	if (navigator.share) {
		// 使用 Web Share API (移动端)
		navigator.share({
			title: title,
			url: url
		}).catch(() => {
			copyToClipboard(url);
		});
	} else {
		// 复制链接到剪贴板
		copyToClipboard(url);
	}
}

/**
 * 显示加载动画
 */
export function showLoading(container) {
	container.innerHTML = `
		<div class="loading">
			<div class="spinner"></div>
			<p>加载中...</p>
		</div>
	`;
}

/**
 * 显示错误信息
 */
export function showError(container, message = '加载失败，请稍后重试') {
	container.innerHTML = `
		<div style="text-align:center;padding:3rem;color:#999;">
			<h2 style="color:#c41e3a;margin-bottom:1rem;">加载失败</h2>
			<p>${message}</p>
			<a href="/src/pages/index.html" style="display:inline-block;margin-top:2rem;padding:0.8rem 2rem;background:#c41e3a;color:white;text-decoration:none;border-radius:4px;">返回首页</a>
		</div>
	`;
}

/**
 * 加载 JSON 数据
 */
export async function loadJSON(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('加载 JSON 失败:', error);
		throw error;
	}
}

/**
 * 加载 Markdown 文件
 */
export async function loadMarkdown(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.text();
	} catch (error) {
		console.error('加载 Markdown 失败:', error);
		throw error;
	}
}
