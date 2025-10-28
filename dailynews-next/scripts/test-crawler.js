/**
 * 爬虫诊断测试脚本
 * 用于测试爬虫各个环节是否正常工作
 */

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// 获取当前日期
function getDate() {
  const add0 = (num) => (num < 10 ? '0' + num : num);
  const date = new Date();
  return '' + date.getFullYear() + add0(date.getMonth() + 1) + add0(date.getDate());
}

// HTTP 请求封装
async function fetchHTML(url) {
  console.log(`\n🌐 正在请求: ${url}`);
  
  try {
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
    
    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 响应内容长度: ${html.length} 字符`);
    
    return html;
  } catch (error) {
    console.error(`❌ 请求失败:`, error.message);
    throw error;
  }
}

// 测试获取新闻列表
async function testGetNewsList(date) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 测试 1: 获取新闻列表');
  console.log('='.repeat(60));
  
  try {
    const url = `http://tv.cctv.com/lm/xwlb/day/${date}.shtml`;
    const html = await fetchHTML(url);
    
    // 保存原始 HTML 用于调试
    const fs = require('fs');
    const debugPath = `/tmp/cctv-${date}.html`;
    fs.writeFileSync(debugPath, html);
    console.log(`💾 原始 HTML 已保存到: ${debugPath}`);
    
    const fullHTML = `<!DOCTYPE html><html><head></head><body>${html}</body></html>`;
    const dom = new JSDOM(fullHTML);
    const nodes = dom.window.document.querySelectorAll('a');
    
    console.log(`\n🔗 找到 ${nodes.length} 个链接`);
    
    const links = [];
    nodes.forEach((node) => {
      const link = node.href;
      if (link && !links.includes(link)) {
        links.push(link);
      }
    });
    
    console.log(`📊 去重后: ${links.length} 个唯一链接`);
    
    if (links.length > 0) {
      console.log(`\n前 5 个链接:`);
      links.slice(0, 5).forEach((link, i) => {
        console.log(`  ${i + 1}. ${link}`);
      });
    }
    
    const abstract = links.shift();
    
    if (!abstract || links.length === 0) {
      console.error('\n❌ 错误: 未能获取到新闻列表');
      console.log('\n可能的原因:');
      console.log('  1. CCTV 网站 HTML 结构已变化');
      console.log('  2. 该日期没有新闻联播数据');
      console.log('  3. 网站返回了错误页面');
      return null;
    }
    
    console.log(`\n✅ 成功获取新闻列表`);
    console.log(`   摘要链接: ${abstract}`);
    console.log(`   新闻数量: ${links.length}`);
    
    return { abstract, news: links };
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    return null;
  }
}

// 测试获取新闻摘要
async function testGetAbstract(link) {
  console.log('\n' + '='.repeat(60));
  console.log('📝 测试 2: 获取新闻摘要');
  console.log('='.repeat(60));
  
  try {
    const html = await fetchHTML(link);
    const dom = new JSDOM(html);
    
    const selector = '#page_body > div.allcontent > div.video18847 > div.playingCon > div.nrjianjie_shadow > div > ul > li:nth-child(1) > p';
    console.log(`\n🎯 使用选择器: ${selector}`);
    
    const element = dom.window.document.querySelector(selector);
    
    if (!element) {
      console.error('\n❌ 错误: 无法找到摘要元素');
      console.log('\n尝试查找可能的摘要容器...');
      
      // 尝试其他可能的选择器
      const alternatives = [
        '.nrjianjie_shadow',
        '.playingCon',
        '#content_area',
        '.video_brief'
      ];
      
      for (const alt of alternatives) {
        const altElement = dom.window.document.querySelector(alt);
        if (altElement) {
          console.log(`  ✓ 找到元素: ${alt}`);
          console.log(`    内容预览: ${altElement.textContent.substring(0, 100)}...`);
        }
      }
      
      return null;
    }
    
    const abstract = element.innerHTML;
    console.log(`\n✅ 成功获取摘要`);
    console.log(`   长度: ${abstract.length} 字符`);
    console.log(`   预览: ${abstract.substring(0, 100)}...`);
    
    return abstract;
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    return null;
  }
}

// 测试获取单条新闻
async function testGetSingleNews(url) {
  console.log('\n' + '='.repeat(60));
  console.log('📰 测试 3: 获取单条新闻详情');
  console.log('='.repeat(60));
  
  try {
    const html = await fetchHTML(url);
    const dom = new JSDOM(html);
    
    const titleSelector = '#page_body > div.allcontent > div.video18847 > div.playingVideo > div.tit';
    const contentSelector = '#content_area';
    
    console.log(`\n🎯 标题选择器: ${titleSelector}`);
    console.log(`🎯 内容选择器: ${contentSelector}`);
    
    const titleElement = dom.window.document.querySelector(titleSelector);
    const contentElement = dom.window.document.querySelector(contentSelector);
    
    if (!titleElement) {
      console.error('\n❌ 错误: 无法找到标题元素');
    } else {
      const title = titleElement.innerHTML.replace('[视频]', '').trim();
      console.log(`\n✅ 标题: ${title}`);
    }
    
    if (!contentElement) {
      console.error('\n❌ 错误: 无法找到内容元素');
    } else {
      const content = contentElement.innerHTML.trim();
      console.log(`✅ 内容长度: ${content.length} 字符`);
      console.log(`   预览: ${content.substring(0, 100)}...`);
    }
    
    return {
      title: titleElement?.innerHTML?.replace('[视频]', '').trim() || '无标题',
      content: contentElement?.innerHTML?.trim() || '无内容'
    };
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    return null;
  }
}

// 主测试函数
async function main() {
  console.log('\n🚀 开始爬虫诊断测试');
  console.log('='.repeat(60));
  
  // 获取测试日期（可以从命令行参数指定）
  const testDate = process.argv[2] || getDate();
  console.log(`📅 测试日期: ${testDate}`);
  
  // 测试 1: 获取新闻列表
  const newsList = await testGetNewsList(testDate);
  
  if (!newsList) {
    console.log('\n❌ 新闻列表获取失败，无法继续测试');
    process.exit(1);
  }
  
  // 测试 2: 获取摘要
  await testGetAbstract(newsList.abstract);
  
  // 测试 3: 获取第一条新闻详情
  if (newsList.news.length > 0) {
    await testGetSingleNews(newsList.news[0]);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 诊断测试完成');
  console.log('='.repeat(60));
  console.log('\n如果所有测试都通过，说明爬虫代码本身没问题。');
  console.log('如果某个测试失败，请检查对应的选择器或网站结构。');
}

main().catch(console.error);
