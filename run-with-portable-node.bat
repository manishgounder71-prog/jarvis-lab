@echo off
echo ========================================
echo 3D Hologram - Using Portable Node.js
echo ========================================
echo.

set NODE_PATH=d:\3d.prototype\node-portable\node-v20.11.0-win-x64
set PATH=%NODE_PATH%;%PATH%

echo [1/3] Checking Node.js...
"%NODE_PATH%\node.exe" --version
"%NODE_PATH%\npm.cmd" --version
echo.

echo [2/3] Installing dependencies (this may take 2-5 minutes)...
"%NODE_PATH%\npm.cmd" install
echo.

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Installation failed!
    pause
    exit /b 1
)

echo [3/3] Starting development server...
echo.
echo Your browser will open to: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
"%NODE_PATH%\npm.cmd" run dev

pause
