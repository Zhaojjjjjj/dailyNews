/**
 * 数据库迁移脚本
 * 运行方式: node scripts/migrate.js
 */
const { createClient } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = createClient();
  
  try {
    await client.connect();
    console.log('✓ 数据库连接成功');
    console.log('开始数据库迁移...');

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
    console.log('✓ 创建 news_articles 表');

    // 创建索引
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles(date DESC);
    `;
    console.log('✓ 创建日期索引');

    console.log('✅ 数据库迁移完成！');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error.message);
    console.error('\n请检查：');
    console.error('1. .env.local 文件是否存在');
    console.error('2. POSTGRES_URL 等环境变量是否正确配置');
    console.error('3. 数据库是否已在 Vercel 创建');
    await client.end();
    process.exit(1);
  }
}

migrate();
