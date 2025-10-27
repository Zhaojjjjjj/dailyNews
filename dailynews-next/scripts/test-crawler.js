/**
 * 测试爬虫脚本
 * 运行方式: node scripts/test-crawler.js
 */

import { crawlNews, getDate } from '../lib/crawler.ts';

async function test() {
  try {
    const date = process.argv[2] || getDate();
    console.log(`测试爬取日期: ${date}`);
    
    const result = await crawlNews(date);
    
    console.log('\n爬取结果:');
    console.log('日期:', result.date);
    console.log('新闻数量:', result.newsCount);
    console.log('摘要长度:', result.abstract.length);
    console.log('内容长度:', result.content.length);
    console.log('\n摘要预览:');
    console.log(result.abstract.substring(0, 200) + '...');
    
    console.log('\n测试成功！');
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

test();

