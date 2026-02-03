@echo off
echo ========================================
echo Starting Development Server
echo ========================================
echo.

cd /d d:\3d.prototype

echo Checking for node_modules...
if not exist "node_modules\" (
    echo [!] Dependencies not installed yet.
    echo Please run: install-dependencies.bat first
    echo.
    pause
    exit /b 1
)

echo Starting server...
echo.
echo The application will open at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev
