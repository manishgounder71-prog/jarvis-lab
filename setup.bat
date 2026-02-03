@echo off
REM Batch script to run the PowerShell setup script

echo ========================================
echo 3D Hologram Visualization - Auto Setup
echo ========================================
echo.

echo Running setup script...
echo This will install Node.js and project dependencies.
echo.

REM Run PowerShell script with execution policy bypass
powershell -ExecutionPolicy Bypass -File "%~dp0setup.ps1"

pause
