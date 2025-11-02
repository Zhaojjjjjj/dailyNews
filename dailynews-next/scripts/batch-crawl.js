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
		console.log("使用方法:");
		console.log("  node scripts/batch-crawl.js <开始日期> <结束日期> [环境]");
		console.log("");
		console.log("参数:");
		console.log("  开始日期: YYYYMMDD 格式，如 20241001");
		console.log("  结束日期: YYYYMMDD 格式，如 20241027");
		console.log("  环境: local (默认) 或 prod");
		console.log("");
		console.log("示例:");
		console.log("  node scripts/batch-crawl.js 20241001 20241027");
		console.log("  node scripts/batch-crawl.js 20241001 20241027 prod");
		console.log("");
		console.log("⚠️  注意:");
		console.log("  1. 使用 prod 环境前，请先在 config.prod.baseUrl 设置你的域名");
		console.log("  2. 批量爬取会花费较长时间，每个日期间隔 3 秒");
		console.log("  3. 只会爬取工作日的数据（周末可能没有新闻联播）");
		process.exit(1);
	}

	const startDate = args[0];
	const endDate = args[1];
	const env = args[2] || "local";

	// 验证日期格式
	if (!/^\d{8}$/.test(startDate) || !/^\d{8}$/.test(endDate)) {
		console.error("❌ 日期格式错误，应为 YYYYMMDD");
		process.exit(1);
	}

	// 验证环境
	if (!["local", "prod"].includes(env)) {
		console.error("❌ 环境参数错误，应为 local 或 prod");
		process.exit(1);
	}

	console.log("🚀 批量爬取历史数据");
	console.log("====================");
	console.log(`📅 日期范围: ${formatDate(startDate)} 到 ${formatDate(endDate)}`);
	console.log(`🌍 目标环境: ${env === "local" ? "本地" : "生产"}`);
	console.log(`🔗 API 地址: ${config[env].baseUrl}`);
	console.log("");

	const dates = generateDateRange(startDate, endDate);
	console.log(`📊 共 ${dates.length} 天需要爬取`);
	console.log("");

	let successCount = 0;
	let skipCount = 0;
	let failCount = 0;

	for (let i = 0; i < dates.length; i++) {
		const date = dates[i];
		const progress = `[${i + 1}/${dates.length}]`;

		try {
			console.log(`${progress} 正在爬取 ${formatDate(date)}...`);

			const result = await crawlDate(date, env);

			if (result.success) {
				if (result.data.skipped) {
					console.log(`  ⏭️  跳过 - 数据已存在`);
					skipCount++;
				} else if (result.data.success) {
					console.log(`  ✅ 成功 - 爬取 ${result.data.data?.newsCount || 0} 条新闻`);
					successCount++;
				} else {
					console.log(`  ❌ 失败 - ${result.data.error}`);
					failCount++;
				}
			} else {
				console.log(`  ❌ 失败 - HTTP ${result.status}: ${result.error}`);
				failCount++;
			}

			// 避免请求过快，等待 3 秒
			if (i < dates.length - 1) {
				await sleep(3000);
			}
		} catch (error) {
			console.log(`  ❌ 失败 - ${error.message}`);
			failCount++;
		}
	}

	console.log("");
	console.log("📊 爬取完成");
	console.log("====================");
	console.log(`✅ 成功: ${successCount}`);
	console.log(`⏭️  跳过: ${skipCount}`);
	console.log(`❌ 失败: ${failCount}`);
	console.log(`📈 总计: ${dates.length}`);
	console.log("");

	if (failCount > 0) {
		console.log("⚠️  有部分日期爬取失败，可能原因：");
		console.log("  1. 该日期没有新闻联播（周末或节假日）");
		console.log("  2. CCTV 官网该日期的数据不可用");
		console.log("  3. 网络连接问题");
		console.log("  4. 爬虫被限流");
	}
}

main().catch(console.error);
