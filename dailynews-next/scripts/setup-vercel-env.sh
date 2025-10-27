#!/bin/bash

# 设置 Vercel 环境变量的脚本
# 使用方法: ./scripts/setup-vercel-env.sh

echo "📝 开始设置 Vercel 环境变量..."

# 检查是否安装了 vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "请运行: npm install -g vercel"
    exit 1
fi

# 检查是否有 .env.local 文件
if [ ! -f .env.local ]; then
    echo "❌ .env.local 文件不存在"
    exit 1
fi

echo "✓ 找到 .env.local 文件"
echo ""
echo "请在 Vercel Dashboard 手动添加以下环境变量："
echo "Settings → Environment Variables"
echo ""
echo "================================================"
cat .env.local | grep "^POSTGRES_URL=" | head -1
cat .env.local | grep "^POSTGRES_PRISMA_URL=" | head -1
cat .env.local | grep "^POSTGRES_URL_NON_POOLING=" | head -1
cat .env.local | grep "^POSTGRES_USER=" | head -1
cat .env.local | grep "^POSTGRES_HOST=" | head -1
cat .env.local | grep "^POSTGRES_PASSWORD=" | head -1
cat .env.local | grep "^POSTGRES_DATABASE=" | head -1
cat .env.local | grep "^CRON_SECRET=" | head -1
echo "================================================"
echo ""
echo "⚠️  注意："
echo "1. 需要去掉引号"
echo "2. 勾选所有环境: Production, Preview, Development"
echo "3. 添加完成后重新部署项目"
echo ""
echo "或者使用 Vercel CLI 命令（逐个设置）："
echo ""
echo "vercel env add POSTGRES_URL"
echo "vercel env add POSTGRES_PRISMA_URL"
echo "vercel env add POSTGRES_URL_NON_POOLING"
echo "vercel env add POSTGRES_USER"
echo "vercel env add POSTGRES_HOST"
echo "vercel env add POSTGRES_PASSWORD"
echo "vercel env add POSTGRES_DATABASE"
echo "vercel env add CRON_SECRET"

