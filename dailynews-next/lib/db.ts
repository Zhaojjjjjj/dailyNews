import { sql } from '@vercel/postgres';

export interface NewsArticle {
  id: number;
  date: string;
  abstract: string;
  content: string;
  news_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 初始化数据库表
 */
export async function initDatabase() {
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
  
  // 创建索引
  await sql`
    CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles(date DESC);
  `;
  
  console.log('数据库表初始化完成');
}

/**
 * 保存新闻文章
 */
export async function saveNewsArticle(
  date: string,
  abstract: string,
  content: string,
  newsCount: number
) {
  try {
    const result = await sql`
      INSERT INTO news_articles (date, abstract, content, news_count)
      VALUES (${date}, ${abstract}, ${content}, ${newsCount})
      ON CONFLICT (date) 
      DO UPDATE SET 
        abstract = ${abstract},
        content = ${content},
        news_count = ${newsCount},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return result.rows[0] as NewsArticle;
  } catch (error) {
    console.error('保存新闻失败:', error);
    throw error;
  }
}

/**
 * 获取所有新闻列表（仅包含日期和摘要）
 */
export async function getAllNewsList() {
  try {
    const result = await sql`
      SELECT id, date, abstract, news_count, created_at
      FROM news_articles
      ORDER BY date DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    throw error;
  }
}

/**
 * 获取最新 N 条新闻
 */
export async function getLatestNews(limit: number = 10) {
  try {
    const result = await sql`
      SELECT id, date, abstract, news_count, created_at
      FROM news_articles
      ORDER BY date DESC
      LIMIT ${limit};
    `;
    return result.rows;
  } catch (error) {
    console.error('获取最新新闻失败:', error);
    throw error;
  }
}

/**
 * 根据日期获取新闻详情
 */
export async function getNewsByDate(date: string) {
  try {
    const result = await sql`
      SELECT *
      FROM news_articles
      WHERE date = ${date}
      LIMIT 1;
    `;
    return result.rows[0] as NewsArticle | undefined;
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    throw error;
  }
}

/**
 * 获取统计信息
 */
export async function getStatistics() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_count,
        MAX(date) as latest_date,
        SUM(news_count) as total_news
      FROM news_articles;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('获取统计信息失败:', error);
    throw error;
  }
}

/**
 * 检查日期是否已存在
 */
export async function checkDateExists(date: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS(SELECT 1 FROM news_articles WHERE date = ${date}) as exists;
    `;
    return result.rows[0].exists;
  } catch (error) {
    console.error('检查日期存在性失败:', error);
    throw error;
  }
}

/**
 * 搜索新闻
 */
export async function searchNews(keyword: string) {
  try {
    const result = await sql`
      SELECT id, date, abstract, news_count, created_at
      FROM news_articles
      WHERE abstract ILIKE ${'%' + keyword + '%'} OR content ILIKE ${'%' + keyword + '%'}
      ORDER BY date DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('搜索新闻失败:', error);
    throw error;
  }
}

