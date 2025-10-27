import { NextRequest, NextResponse } from 'next/server';
import { getNewsByDate } from '@/lib/db';

/**
 * 获取指定日期的新闻详情 API
 * GET /api/news/20241027
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    
    // 验证日期格式
    if (!/^\d{8}$/.test(date)) {
      return NextResponse.json(
        {
          success: false,
          error: '日期格式错误，应为 YYYYMMDD 格式',
        },
        { status: 400 }
      );
    }
    
    const result = await getNewsByDate(date);
    
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: '未找到该日期的新闻',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('获取新闻详情失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || '获取新闻详情失败',
      },
      { status: 500 }
    );
  }
}

