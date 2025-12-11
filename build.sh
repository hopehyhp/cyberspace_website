#!/bin/bash

# 快速构建脚本（仅构建前端，不启动服务）
# 使用方法: chmod +x build.sh && ./build.sh

echo "🔨 开始构建前端项目..."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 获取项目根目录
PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)
cd "$PROJECT_ROOT"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  依赖未安装，正在安装...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
fi

# 构建
echo -e "${YELLOW}📦 构建中...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建完成！文件位于 dist/ 目录${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

