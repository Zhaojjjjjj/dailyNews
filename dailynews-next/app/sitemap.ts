import { MetadataRoute } from 'next';
import { getAllNewsList } from '@/lib/db';

/**
 * 动态生成 sitemap.xml
 * SEO: 帮助搜索引擎发现和索引所有页面
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app';

  try {
    // 获取所有新闻日期
    const newsList = await getAllNewsList();

    const newsUrls = newsList.map((item: any) => ({
      url: `${baseUrl}/news/${item.date}`,
      lastModified: new Date(item.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...newsUrls,
    ];
  } catch (error) {
    console.error('生成 sitemap 失败:', error);
    
    // 返回基础 sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}

