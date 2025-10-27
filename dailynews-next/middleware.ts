import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * 在请求到达 API 或页面之前执行
 */
export function middleware(request: NextRequest) {
  // 为 API 响应添加 CORS 头 (如果需要跨域访问)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // 添加安全头
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }
  
  return NextResponse.next();
}

// 配置 middleware 应用的路径
export const config = {
  matcher: [
    '/api/:path*',
  ],
};

