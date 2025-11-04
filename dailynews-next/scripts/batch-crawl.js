/**
 * 批量爬取历史数据脚本
 * 用于恢复历史新闻数据
 *
 * 使用方法:
 * node scripts/batch-crawl.js <开始日期> <结束日期> [环境]
 *
 * 示例:
 * node scripts/batch-crawl.js 20241001 20241027          # 本地环境
 * node scripts/batch-crawl.js 20241001 20241027 prod     # 生产环境
 */

const https = require("https");
const http = require("http");

// 配置
const config = {
	// 本地环境
	local: {
		baseUrl: "http://localhost:3000",
		secret: process.env.CRON_SECRET || "xxx",
	},
	// 生产环境（替换为你的域名）
	prod: {
		baseUrl: "https://news.jieer.dpdns.org",
		secret: "xxx",
	},
};

// 延迟函数（避免请求过快）
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 格式化日期
function formatDate(dateStr) {
	const year = dateStr.substring(0, 4);
	const month = dateStr.substring(4, 6);
	const day = dateStr.substring(6, 8);
	return `${year}-${month}-${day}`;
}

// 生成日期范围
function generateDateRange(startDate, endDate) {
	const dates = [];
	const start = new Date(parseInt(startDate.substring(0, 4)), parseInt(startDate.substring(4, 6)) - 1, parseInt(startDate.substring(6, 8)));
	const end = new Date(parseInt(endDate.substring(0, 4)), parseInt(endDate.substring(4, 6)) - 1, parseInt(endDate.substring(6, 8)));

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		dates.push(`${year}${month}${day}`);
	}

	return dates;
}

// 发送爬虫请求
async function crawlDate(date, env = "local") {
	const { baseUrl, secret } = config[env];
	const url = new URL("/api/crawler", baseUrl);

	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({ date });

		const options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${secret}`,
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(postData),
			},
		};

		const client = baseUrl.startsWith("https") ? https : http;

		const req = client.request(url, options, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				try {
					const result = JSON.parse(data);
					resolve({ success: true, status: res.statusCode, data: result });
				} catch (e) {
					resolve({ success: false, status: res.statusCode, error: data });
				}
			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		req.write(postData);
		req.end();
	});
}

// 主函数
async function main() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		process.exit(1);
	}

	const startDate = args[0];
	const endDate = args[1];
	const env = args[2] || "local";

	// 验证日期格式
	if (!/^\d{8}$/.test(startDate) || !/^\d{8}$/.test(endDate)) {
		process.exit(1);
	}

	// 验证环境
	if (!["local", "prod"].includes(env)) {
		process.exit(1);
	}

	const dates = generateDateRange(startDate, endDate);

	let successCount = 0;
	let skipCount = 0;
	let failCount = 0;

	for (let i = 0; i < dates.length; i++) {
		const date = dates[i];
		const progress = `[${i + 1}/${dates.length}]`;

		try {
			const result = await crawlDate(date, env);

			if (result.success) {
				if (result.data.skipped) {
					skipCount++;
				} else if (result.data.success) {
					successCount++;
				} else {
					failCount++;
				}
			} else {
				failCount++;
			}

			// 避免请求过快，等待 3 秒
			if (i < dates.length - 1) {
				await sleep(3000);
			}
		} catch (error) {
			failCount++;
		}
	}
}

main().catch(console.error);
