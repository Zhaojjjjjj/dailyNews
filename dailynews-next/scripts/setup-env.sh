#!/bin/bash

# 环境变量配置脚本
# 用于设置批量爬取脚本所需的环境变量

echo "🔧 配置批量爬取脚本环境变量"
echo "================================"
echo ""

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
  echo "📝 创建 .env 文件..."
  cp .env.example .env
  echo "✅ .env 文件已创建"
  echo ""
fi

# 提示用户输入配置
echo "请输入以下配置信息:"
echo ""

read -p "生产环境域名 (如 https://xxx): " prod_url
read -p "CRON_SECRET (从 Vercel 环境变量复制): " cron_secret

# 更新 .env 文件
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s|PROD_BASE_URL=.*|PROD_BASE_URL=$prod_url|" .env
  sed -i '' "s|CRON_SECRET=.*|CRON_SECRET=$cron_secret|" .env
else
  # Linux
  sed -i "s|PROD_BASE_URL=.*|PROD_BASE_URL=$prod_url|" .env
  sed -i "s|CRON_SECRET=.*|CRON_SECRET=$cron_secret|" .env
fi

echo ""
echo "✅ 环境变量配置完成"
echo ""
echo "现在可以运行批量爬取脚本:"
echo "  node scripts/batch-crawl.js 20251025 20251028 prod"
echo ""
