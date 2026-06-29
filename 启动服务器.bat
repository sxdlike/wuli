@echo off
cd /d "%~dp0"
echo ================================
echo 物历 WùLì - 启动本地服务器
echo ================================
echo.
echo 正在启动服务器...
echo.
echo 打开浏览器访问: http://localhost:3000
echo 或者直接双击 index.html 在浏览器中打开
echo.
echo 按 Ctrl+C 停止服务器
echo ================================
python -m http.server 3000
