/**
 * 从旧项目导入历史数据
 * 将旧的 Markdown 文件和 catalogue.json 导入到数据库
 *
 * 使用方法:
 * node scripts/import-old-data.js
 */

const fs = require("fs").promises;
const path = require("path");
const { createClient } = require("@vercel/postgres");
require("dotenv").config({ path: ".env.local" });

// 旧项目路径（相对于当前脚本）
const OLD_PROJECT_PATH = path.join(__dirname, "../../public/news");
const CATALOGUE_PATH = path.join(OLD_PROJECT_PATH, "catalogue.json");

/**
 * 读取旧的 catalogue.json
 */
async function readOldCatalogue() {
	try {
		const data = await fs.readFile(CATALOGUE_PATH, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		process.exit(1);
	}
}

/**
 * 读取单个 Markdown 文件
 */
async function readMarkdownFile(date) {
	const mdPath = path.join(OLD_PROJECT_PATH, `${date}.md`);
	try {
		return await fs.readFile(mdPath, "utf-8");
	} catch (error) {
		return null;
	}
}

/**
 * 从 Markdown 内容中提取新闻数量
 */
function extractNewsCount(content) {
	// 统计 "### " 标题数量（每条新闻一个标题）
	const matches = content.match(/^### /gm);
	return matches ? matches.length : 0;
}

/**
 * 导入数据到数据库
 */
async function importData() {
	console.log("开始导入旧数据到数据库");

	const catalogue = await readOldCatalogue();
	// 连接数据库
	const client = createClient();
	await client.connect();

	let successCount = 0;
	let skipCount = 0;
	let failCount = 0;

	for (let i = 0; i < catalogue.length; i++) {
		const item = catalogue[i];
		const { date, abstract } = item;
		const progress = `[${i + 1}/${catalogue.length}]`;

		try {
			// 检查是否已存在
			const existsResult = await client.sql`
        SELECT EXISTS(SELECT 1 FROM news_articles WHERE date = ${date}) as exists
      `;

			if (existsResult.rows[0].exists) {
				skipCount++;
				continue;
			}

			// 读取 Markdown 文件
			const content = await readMarkdownFile(date);

			if (!content) {
				failCount++;
				continue;
			}

			// 提取新闻数量
			const newsCount = extractNewsCount(content);

			// 插入数据库
			await client.sql`
        INSERT INTO news_articles (date, abstract, content, news_count)
        VALUES (${date}, ${abstract}, ${content}, ${newsCount})
      `;

			successCount++;
		} catch (error) {
			failCount++;
		}
	}

	await client.end();
}

// 主函数
async function main() {
	await new Promise((resolve) => setTimeout(resolve, 3000));

	await importData();
}

main().catch((error) => {
	process.exit(1);
});
