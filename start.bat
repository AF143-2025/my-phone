@echo off
chcp 65001 > nul
title Mobilya Platform - قضاء أبو غريب
echo ======================================================
echo   📱 Mobilya Platform - تشغيل منصة موبيليا
echo   سوق الموبايلات في قضاء أبو غريب
echo ======================================================
echo.
echo جاري تشغيل السيرفر وفتح المتصفح...
start http://localhost:5000
node backend/server.js
if %errorlevel% neq 0 (
    echo.
    echo حدث خطأ أثناء التشغيل. يرجى التأكد من تثبيت Node.js
    pause
)
