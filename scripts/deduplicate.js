import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = path.resolve(__dirname, '..');
const CATALOGUE_PATH = path.join(ROOT_PATH, 'public/news/catalogue.json');

console.log('开始清理重复数据...');
console.log('文件路径:', CATALOGUE_PATH);

// 读取 catalogue.json
const data = JSON.parse(fs.readFileSync(CATALOGUE_PATH, 'utf-8'));
console.log('原始记录数:', data.length);

// 去重: 使用 Map 保留第一次出现的记录
const seen = new Map();
const deduplicated = [];

for (const item of data) {
	if (!seen.has(item.date)) {
		seen.set(item.date, true);
		deduplicated.push(item);
	}
}

console.log('去重后记录数:', deduplicated.length);
console.log('删除重复记录数:', data.length - deduplicated.length);

// 写回文件
fs.writeFileSync(CATALOGUE_PATH, JSON.stringify(deduplicated, null, 2));
console.log('清理完成!');
