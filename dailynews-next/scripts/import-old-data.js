/**
 * 从旧项目导入历史数据
 * 将旧的 Markdown 文件和 catalogue.json 导入到数据库
 * 
 * 使用方法:
 * node scripts/import-old-data.js
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

// 旧项目路径（相对于当前脚本）
const OLD_PROJECT_PATH = path.join(__dirname, '../../public/news');
const CATALOGUE_PATH = path.join(OLD_PROJECT_PATH, 'catalogue.json');

/**
 * 读取旧的 catalogue.json
 */
async function readOldCatalogue() {
  try {
    const data = await fs.readFile(CATALOGUE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ 无法读取 catalogue.json:', error.message);
    console.log('');
    console.log('请确认旧项目路径正确:');
    console.log(`  期望路径: ${CATALOGUE_PATH}`);
    console.log('');
    console.log('如果路径不对，请修改脚本中的 OLD_PROJECT_PATH');
    process.exit(1);
  }
}

/**
 * 读取单个 Markdown 文件
 */
async function readMarkdownFile(date) {
  const mdPath = path.join(OLD_PROJECT_PATH, `${date}.md`);
  try {
    return await fs.readFile(mdPath, 'utf-8');
  } catch (error) {
    console.log(`  ⚠️  找不到文件: ${date}.md`);
    return null;
  }
}

/**
 * 从 Markdown 内容中提取新闻数量
 */
function extractNewsCount(content) {
  // 统计 "### " 标题数量（每条新闻一个标题）
  const matches = content.match(/^### /gm);
  return matches ? matches.length : 0;
}

/**
 * 导入数据到数据库
 */
async function importData() {
  console.log('🚀 开始导入旧数据到数据库');
  console.log('================================');
  console.log('');
  
  // 读取旧数据
  console.log('📖 读取旧项目数据...');
  const catalogue = await readOldCatalogue();
  console.log(`✓ 找到 ${catalogue.length} 条记录`);
  console.log('');
  
  // 连接数据库
  console.log('🔌 连接数据库...');
  const client = createClient();
  await client.connect();
  console.log('✓ 数据库连接成功');
  console.log('');
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  console.log('📥 开始导入...');
  console.log('');
  
  for (let i = 0; i < catalogue.length; i++) {
    const item = catalogue[i];
    const { date, abstract } = item;
    const progress = `[${i + 1}/${catalogue.length}]`;
    
    try {
      // 检查是否已存在
      const existsResult = await client.sql`
        SELECT EXISTS(SELECT 1 FROM news_articles WHERE date = ${date}) as exists
      `;
      
      if (existsResult.rows[0].exists) {
        console.log(`${progress} ⏭️  跳过 ${date} - 已存在`);
        skipCount++;
        continue;
      }
      
      // 读取 Markdown 文件
      const content = await readMarkdownFile(date);
      
      if (!content) {
        console.log(`${progress} ❌ 失败 ${date} - 找不到 MD 文件`);
        failCount++;
        continue;
      }
      
      // 提取新闻数量
      const newsCount = extractNewsCount(content);
      
      // 插入数据库
      await client.sql`
        INSERT INTO news_articles (date, abstract, content, news_count)
        VALUES (${date}, ${abstract}, ${content}, ${newsCount})
      `;
      
      console.log(`${progress} ✅ 成功 ${date} - ${newsCount} 条新闻`);
      successCount++;
      
    } catch (error) {
      console.log(`${progress} ❌ 失败 ${date} - ${error.message}`);
      failCount++;
    }
  }
  
  await client.end();
  
  console.log('');
  console.log('📊 导入完成');
  console.log('================================');
  console.log(`✅ 成功导入: ${successCount}`);
  console.log(`⏭️  已跳过: ${skipCount}`);
  console.log(`❌ 导入失败: ${failCount}`);
  console.log(`📈 总计: ${catalogue.length}`);
  console.log('');
}

// 主函数
async function main() {
  console.log('');
  console.log('📦 旧数据导入工具');
  console.log('================================');
  console.log('');
  console.log('⚠️  注意事项:');
  console.log('  1. 确保 .env.local 文件已正确配置');
  console.log('  2. 确保数据库表已创建 (npm run db:migrate)');
  console.log('  3. 确保旧项目路径正确');
  console.log('');
  console.log(`📂 旧项目路径: ${OLD_PROJECT_PATH}`);
  console.log('');
  
  // 确认是否继续
  console.log('按 Ctrl+C 取消，或等待 3 秒自动开始...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('');
  
  await importData();
}

main().catch((error) => {
  console.error('');
  console.error('❌ 导入失败:', error);
  console.error('');
  process.exit(1);
});

