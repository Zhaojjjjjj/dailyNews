import { NextRequest, NextResponse } from 'next/server';
import { crawlNews, getDate } from '@/lib/crawler';
import { saveNewsArticle, checkDateExists } from '@/lib/db';

/**
 * 核心爬虫执行逻辑
 * 提取为独立函数，消除 HTTP 方法耦合
 */
async function executeCrawler(targetDate?: string, force?: boolean) {
  const date = targetDate || getDate();
  console.log(`开始爬取日期: ${date}`);
  
  const exists = await checkDateExists(date);
  if (exists && !force) {
    return {
      success: true,
      message: `${date} 的新闻已存在，跳过爬取`,
      date,
      skipped: true,
    };
  }
  
  const result = await crawlNews(date);
  await saveNewsArticle(
    result.date,
    result.abstract,
    result.content,
    result.newsCount
  );
  
  console.log(`成功保存 ${date} 的新闻到数据库`);
  
  return {
    success: true,
    message: '爬取并保存成功',
    data: {
      date: result.date,
      newsCount: result.newsCount,
    },
  };
}

/**
 * GET /api/crawler
 * Vercel Cron 使用 GET 方法触发定时任务
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    
    const result = await executeCrawler();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('爬虫执行失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '爬虫执行失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crawler
 * 手动触发爬虫，支持指定日期和强制更新
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    
    const body = await request.json().catch(() => ({}));
    const result = await executeCrawler(body.date, body.force);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('爬虫执行失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '爬虫执行失败' },
      { status: 500 }
    );
  }
}

