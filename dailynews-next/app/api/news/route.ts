import { NextRequest, NextResponse } from 'next/server';
import { getAllNewsList, getLatestNews, searchNews } from '@/lib/db';

/**
 * 获取新闻列表 API
 * GET /api/news?limit=10
 * GET /api/news?all=true
 * GET /api/news?search=keyword
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const all = searchParams.get('all');
    const searchKeyword = searchParams.get('search');
    
    // 搜索功能
    if (searchKeyword) {
      const results = await searchNews(searchKeyword);
      return NextResponse.json({
        success: true,
        data: results,
        count: results.length,
      });
    }
    
    // 获取所有新闻
    if (all === 'true') {
      const results = await getAllNewsList();
      return NextResponse.json({
        success: true,
        data: results,
        count: results.length,
      });
    }
    
    // 获取最新 N 条
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const results = await getLatestNews(limitNum);
    
    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    console.error('获取新闻列表失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || '获取新闻列表失败',
      },
      { status: 500 }
    );
  }
}

