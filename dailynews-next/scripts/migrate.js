/**
 * 数据库迁移脚本
 * 运行方式: node scripts/migrate.js
 */

import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
  try {
    console.log('开始数据库迁移...');

    // 创建新闻文章表
    await sql`
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
    await sql`
      CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles(date DESC);
    `;
    console.log('✓ 创建日期索引');

    console.log('数据库迁移完成！');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrate();

