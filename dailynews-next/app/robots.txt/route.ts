/**
 * robots.txt
 * SEO: 告诉搜索引擎哪些页面可以爬取
 */
export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/sitemap.xml

# 禁止爬取 API
Disallow: /api/
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

