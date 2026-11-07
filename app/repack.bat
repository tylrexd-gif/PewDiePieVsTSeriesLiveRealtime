@echo off
cd /d "%~dp0"
node scripts\repack-all.mjs %*
echo.
pause
