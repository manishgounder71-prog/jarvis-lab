@echo off
echo ========================================
echo Installing Project Dependencies
echo ========================================
echo.

cd /d d:\3d.prototype

echo Checking Node.js...
node --version
npm --version

if errorlevel 1 (
    echo.
    echo [ERROR] Node.js not found!
    echo Please restart your terminal and run this script again.
    echo.
    pause
    exit /b 1
)

echo.
echo Installing npm packages...
echo This may take 2-5 minutes.
echo.

npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:5173
echo.
pause
