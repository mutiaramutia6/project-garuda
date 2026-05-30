@echo off
cd /d "%~dp0"
echo Menjalankan Project Garuda di http://localhost:8000
echo Tekan Ctrl+C untuk menghentikan server.
node server.mjs
pause
