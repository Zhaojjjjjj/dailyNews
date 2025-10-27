import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/db';

/**
 * 获取统计信息 API
 * GET /api/stats
 */
export async function GET() {
  try {
    const stats = await getStatistics();
    
    return NextResponse.json({
      success: true,
      data: {
        totalCount: parseInt(stats.total_count || '0', 10),
        latestDate: stats.latest_date || '',
        totalNews: parseInt(stats.total_news || '0', 10),
      },
    });
  } catch (error: any) {
    console.error('获取统计信息失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || '获取统计信息失败',
      },
      { status: 500 }
    );
  }
}

