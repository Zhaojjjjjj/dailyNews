import { NextRequest, NextResponse } from 'next/server';
import { crawlNews, getDate } from '@/lib/crawler';
import { saveNewsArticle, checkDateExists } from '@/lib/db';

/**
 * 爬虫 API
 * POST /api/crawler
 * 手动触发爬虫或通过 Vercel Cron 定时触发
 */
export async function POST(request: NextRequest) {
  try {
    // 验证 Cron Secret (生产环境保护)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 获取要爬取的日期（可以从请求中指定，否则使用今天）
    const body = await request.json().catch(() => ({}));
    const targetDate = body.date || getDate();
    
    console.log(`开始爬取日期: ${targetDate}`);
    
    // 检查是否已存在
    const exists = await checkDateExists(targetDate);
    if (exists && !body.force) {
      return NextResponse.json({
        success: true,
        message: `${targetDate} 的新闻已存在，跳过爬取`,
        date: targetDate,
        skipped: true,
      });
    }
    
    // 执行爬虫
    const result = await crawlNews(targetDate);
    
    // 保存到数据库
    await saveNewsArticle(
      result.date,
      result.abstract,
      result.content,
      result.newsCount
    );
    
    console.log(`成功保存 ${targetDate} 的新闻到数据库`);
    
    return NextResponse.json({
      success: true,
      message: '爬取并保存成功',
      data: {
        date: result.date,
        newsCount: result.newsCount,
      },
    });
  } catch (error: any) {
    console.error('爬虫执行失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || '爬虫执行失败',
      },
      { status: 500 }
    );
  }
}

/**
 * 获取爬虫状态
 * GET /api/crawler
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    currentDate: getDate(),
    message: '爬虫服务运行正常',
  });
}

