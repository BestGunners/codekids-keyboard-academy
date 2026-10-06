@echo off
chcp 65001 >nul
title 敲敲岛 Knock Knock Island
cd /d "%~dp0"

if not exist "node_modules" (
  echo [1/2] 首次运行，正在安装依赖，请稍候...
  call npm.cmd install
)

echo.
echo 正在启动开发服务器...
echo 浏览器会自动打开 http://localhost:5173
echo 想停止：关闭这个窗口，或者按 Ctrl+C
echo.

call npm.cmd run dev

echo.
echo 服务器已停止。
pause
