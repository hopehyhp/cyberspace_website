#!/bin/bash

# 宝塔Linux服务器部署脚本
# 使用方法: chmod +x deploy.sh && ./deploy.sh

echo "🚀 开始部署个人网站..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js 版本: ${NODE_VERSION}${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

# 获取项目根目录
PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)
echo -e "${GREEN}📁 项目目录: ${PROJECT_ROOT}${NC}"

# 1. 安装前端依赖
echo -e "\n${YELLOW}📦 安装前端依赖...${NC}"
cd "$PROJECT_ROOT"
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 前端依赖安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 前端依赖已存在，跳过安装${NC}"
fi

# 2. 安装后端依赖
echo -e "\n${YELLOW}📦 安装后端依赖...${NC}"
cd "$PROJECT_ROOT/server"
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 后端依赖安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 后端依赖已存在，跳过安装${NC}"
fi

# 3. 创建环境变量文件（如果不存在）
echo -e "\n${YELLOW}⚙️  检查环境变量配置...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env 文件不存在，创建默认配置...${NC}"
    cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ 已创建 .env 文件${NC}"
else
    echo -e "${GREEN}✅ .env 文件已存在${NC}"
fi

# 4. 创建前端生产环境配置文件（如果不存在）
echo -e "\n${YELLOW}⚙️  检查前端生产环境配置...${NC}"
cd "$PROJECT_ROOT"
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production 文件不存在，创建默认配置...${NC}"
    cat > .env.production << EOF
# 生产环境配置
# 使用相对路径，因为Nginx会处理反向代理
VUE_APP_API_BASE_URL=/api
EOF
    echo -e "${GREEN}✅ 已创建 .env.production 文件${NC}"
else
    echo -e "${GREEN}✅ .env.production 文件已存在${NC}"
fi

# 5. 创建日志目录
echo -e "\n${YELLOW}📝 创建日志目录...${NC}"
mkdir -p "$PROJECT_ROOT/server/logs"
echo -e "${GREEN}✅ 日志目录已创建${NC}"

# 6. 构建前端项目
echo -e "\n${YELLOW}🔨 构建前端项目...${NC}"
cd "$PROJECT_ROOT"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 前端构建完成${NC}"

# 7. 检查PM2
echo -e "\n${YELLOW}🔍 检查 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 未安装，正在安装...${NC}"
    npm install -g pm2
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ PM2 安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ PM2 安装成功${NC}"
else
    echo -e "${GREEN}✅ PM2 已安装${NC}"
fi

# 8. 启动/重启后端服务
echo -e "\n${YELLOW}🚀 启动后端服务...${NC}"
cd "$PROJECT_ROOT/server"

# 检查服务是否已运行
pm2 describe personal-website-api > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${YELLOW}⚠️  服务已运行，正在重启...${NC}"
    pm2 restart personal-website-api
else
    echo -e "${GREEN}🆕 启动新服务...${NC}"
    pm2 start ecosystem.config.js --env production
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    exit 1
fi

# 9. 保存PM2配置
pm2 save

echo -e "\n${GREEN}✅ 部署完成！${NC}"
echo -e "\n${YELLOW}📋 后续步骤：${NC}"
echo -e "1. 配置 Nginx 反向代理（参考 README_DEPLOY.md）"
echo -e "2. 检查服务状态: ${GREEN}pm2 list${NC}"
echo -e "3. 查看服务日志: ${GREEN}pm2 logs personal-website-api${NC}"
echo -e "4. 测试API: ${GREEN}curl http://localhost:3000/api/health${NC}"

