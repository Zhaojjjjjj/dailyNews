/**
 * 数据库迁移脚本
 * 运行方式: node scripts/migrate.js
 */
const { createClient } = require("@vercel/postgres");
require("dotenv").config({ path: ".env.local" });

async function migrate() {
	const client = createClient();

	try {
		await client.connect();

		// 创建新闻文章表
		await client.sql`
      CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        date VARCHAR(8) UNIQUE NOT NULL,
        abstract TEXT NOT NULL,
        content TEXT NOT NULL,
        news_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

		// 创建索引
		await client.sql`
      CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles(date DESC);
    `;

		await client.end();
		process.exit(0);
	} catch (error) {
		await client.end();
		process.exit(1);
	}
}

migrate();
