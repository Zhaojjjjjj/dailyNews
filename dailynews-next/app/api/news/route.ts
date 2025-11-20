import { NextRequest, NextResponse } from 'next/server';
import { getAllNewsList, getLatestNews, searchNews, getNewsByPage, getNewsCount } from '@/lib/db';

/**
 * 获取新闻列表 API
 * GET /api/news?page=1&pageSize=12  // 分页查询
 * GET /api/news?limit=10            // 获取最新N条
 * GET /api/news?all=true            // 获取所有（不推荐）
 * GET /api/news?search=keyword      // 搜索
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
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
    
    // 分页查询
    if (page) {
      const pageNum = parseInt(page, 10);
      const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 12;
      const [results, total] = await Promise.all([
        getNewsByPage(pageNum, pageSizeNum),
        getNewsCount()
      ]);
      
      return NextResponse.json({
        success: true,
        data: results,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages: Math.ceil(total / pageSizeNum)
        }
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

