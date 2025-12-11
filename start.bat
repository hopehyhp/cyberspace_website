@echo off
echo ========================================
echo   启动个人网站项目
echo ========================================
echo.

echo [1/2] 启动后端服务器...
start "后端服务器" cmd /k "cd server && npm run dev"

echo.
echo 等待后端服务器启动...
timeout /t 3 /nobreak >nul

echo.
echo [2/2] 启动前端开发服务器...
start "前端开发服务器" cmd /k "npm run serve"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:8080
echo 后端 API: http://localhost:3000/api
echo.
echo 按任意键关闭此窗口（服务器将继续运行）...
pause >nul

