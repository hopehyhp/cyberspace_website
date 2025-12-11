#!/bin/bash

echo "========================================"
echo "  启动个人网站项目"
echo "========================================"
echo ""

echo "[1/2] 启动后端服务器..."
cd server && npm run dev &
BACKEND_PID=$!

echo ""
echo "等待后端服务器启动..."
sleep 3

echo ""
echo "[2/2] 启动前端开发服务器..."
cd .. && npm run serve &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  启动完成！"
echo "========================================"
echo ""
echo "前端地址: http://localhost:8080"
echo "后端 API: http://localhost:3000/api"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

