@echo off
chcp 65001 >nul
echo ==========================================
echo  物历 WùLì - 一键部署脚本
echo ==========================================
echo.

REM 检查Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git，请先安装 Git：https://git-scm.com/download/win
    pause
    exit /b 1
)

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js：https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] 检查环境... 通过
echo.

REM 询问GitHub用户名
set /p GITHUB_USER="请输入你的 GitHub 用户名（例如：sxdlike）："
if "%GITHUB_USER%"=="" (
    echo [错误] 用户名不能为空
    pause
    exit /b 1
)

echo.
echo [2/5] 配置 Git 远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/wuli-app.git
git branch -M main

echo.
echo [3/5] 推送到 GitHub...
echo.
echo 提示：如果要求输入密码，请使用 GitHub Personal Access Token
echo 获取方式：https://github.com/settings/tokens
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [错误] 推送失败。可能的原因：
    echo 1. GitHub 仓库尚未创建，请访问 https://github.com/new 创建名为 wuli-app 的仓库
    echo 2. 认证失败，请确保使用 Personal Access Token 作为密码
    echo.
    pause
    exit /b 1
)

echo.
echo [4/5] 安装 Vercel CLI...
npm install -g vercel

echo.
echo [5/5] 部署到 Vercel...
echo 提示：首次部署需要在浏览器中登录 Vercel
echo.
vercel --prod

echo.
echo ==========================================
echo  部署完成！
echo ==========================================
echo.
echo 你的应用已部署到 Vercel，上方输出中包含访问链接。
echo.
pause
