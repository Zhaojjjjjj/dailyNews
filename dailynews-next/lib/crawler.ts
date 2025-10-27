import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

/**
 * HTTP 请求封装
 */
async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'accept': 'text/html, */*; q=0.01',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'referer': url,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.text();
}

/**
 * 获取当前日期 (格式: YYYYMMDD)
 */
export function getDate(): string {
  const add0 = (num: number) => (num < 10 ? '0' + num : num);
  const date = new Date();
  return '' + date.getFullYear() + add0(date.getMonth() + 1) + add0(date.getDate());
}

/**
 * 获取新闻列表
 */
export async function getNewsList(date: string) {
  try {
    const html = await fetchHTML(`http://tv.cctv.com/lm/xwlb/day/${date}.shtml`);
    const fullHTML = `<!DOCTYPE html><html><head></head><body>${html}</body></html>`;
    const dom = new JSDOM(fullHTML);
    const nodes = dom.window.document.querySelectorAll('a');
    
    const links: string[] = [];
    nodes.forEach((node) => {
      const link = node.href;
      if (link && !links.includes(link)) {
        links.push(link);
      }
    });
    
    const abstract = links.shift();
    
    if (!abstract || links.length === 0) {
      throw new Error('未能获取到新闻列表');
    }
    
    console.log(`成功获取新闻列表: ${links.length} 条新闻`);
    
    return {
      abstract,
      news: links,
    };
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    throw error;
  }
}

/**
 * 获取新闻摘要
 */
export async function getAbstract(link: string): Promise<string> {
  try {
    const html = await fetchHTML(link);
    const dom = new JSDOM(html);
    const element = dom.window.document.querySelector(
      '#page_body > div.allcontent > div.video18847 > div.playingCon > div.nrjianjie_shadow > div > ul > li:nth-child(1) > p'
    );
    
    if (!element) {
      console.warn('警告: 无法获取新闻简介, DOM 结构可能已变化');
      return '暂无简介';
    }
    
    const abstract = element.innerHTML
      .replace(/；/g, '；\n\n')
      .replace(/：/g, '：\n\n');
    
    console.log('成功获取新闻简介');
    return abstract;
  } catch (error) {
    console.error('获取新闻简介失败:', error);
    return '暂无简介';
  }
}

/**
 * 获取单条新闻详情
 */
async function getSingleNews(url: string) {
  try {
    const html = await fetchHTML(url);
    const dom = new JSDOM(html);
    
    const titleElement = dom.window.document.querySelector(
      '#page_body > div.allcontent > div.video18847 > div.playingVideo > div.tit'
    );
    const contentElement = dom.window.document.querySelector('#content_area');
    
    const title = titleElement?.innerHTML?.replace('[视频]', '').trim() || '无标题';
    const content = contentElement?.innerHTML?.trim() || '无内容';
    
    return { title, content };
  } catch (error) {
    console.error(`获取新闻详情失败 (${url}):`, error);
    return { title: '获取失败', content: '内容获取失败' };
  }
}

/**
 * 获取所有新闻详情
 */
export async function getAllNews(links: string[]) {
  const linksLength = links.length;
  console.log(`共 ${linksLength} 条新闻, 开始获取`);
  
  const news = [];
  for (let i = 0; i < linksLength; i++) {
    const url = links[i];
    const newsItem = await getSingleNews(url);
    news.push(newsItem);
    console.log(`已获取 ${i + 1}/${linksLength} 条新闻`);
    
    // 避免请求过快，添加小延迟
    if (i < linksLength - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('成功获取所有新闻');
  return news;
}

/**
 * 将新闻转换为 Markdown 格式
 */
export function newsToMarkdown(
  date: string,
  abstract: string,
  news: Array<{ title: string; content: string }>,
  links: string[]
): string {
  let mdNews = '';
  const newsLength = news.length;
  
  for (let i = 0; i < newsLength; i++) {
    const { title, content } = news[i];
    const link = links[i];
    mdNews += `### ${title}\n\n${content}\n\n[查看原文](${link})\n\n`;
  }
  
  const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
  
  return `# 《新闻联播》 (${formattedDate})\n\n## 新闻摘要\n\n${abstract}\n\n## 详细新闻\n\n${mdNews}\n\n---\n\n*更新时间: ${new Date().toLocaleString('zh-CN')}*\n`;
}

/**
 * 爬取指定日期的新闻
 */
export async function crawlNews(date: string) {
  console.log(`开始爬取 ${date} 的新闻...`);
  
  try {
    // 1. 获取新闻列表
    const newsList = await getNewsList(date);
    
    // 2. 获取摘要
    const abstract = await getAbstract(newsList.abstract);
    
    // 3. 获取所有新闻详情
    const news = await getAllNews(newsList.news);
    
    // 4. 转换为 Markdown
    const markdown = newsToMarkdown(date, abstract, news, newsList.news);
    
    console.log(`成功爬取 ${date} 的新闻, 共 ${news.length} 条`);
    
    return {
      date,
      abstract,
      content: markdown,
      newsCount: news.length,
    };
  } catch (error) {
    console.error(`爬取 ${date} 的新闻失败:`, error);
    throw error;
  }
}

