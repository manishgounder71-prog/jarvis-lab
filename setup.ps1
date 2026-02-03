# Automatic Setup Script for 3D Hologram Visualization
# This script will download and install Node.js, then install project dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3D Hologram Visualization - Auto Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
Write-Host "Checking for Node.js installation..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if ($nodeInstalled) {
    Write-Host "[OK] Node.js is already installed!" -ForegroundColor Green
    node --version
    npm --version
} else {
    Write-Host "[!] Node.js not found. Installing..." -ForegroundColor Red
    Write-Host ""
    
    # Download Node.js installer
    $nodeVersion = "20.11.0"
    $installerUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
    $installerPath = "$env:TEMP\nodejs-installer.msi"
    
    Write-Host "Downloading Node.js v$nodeVersion..." -ForegroundColor Yellow
    Write-Host "URL: $installerUrl" -ForegroundColor Gray
    
    try {
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
        Write-Host "[OK] Download complete!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Installing Node.js (this may take a few minutes)..." -ForegroundColor Yellow
        Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
        
        Write-Host "[OK] Node.js installation complete!" -ForegroundColor Green
        Write-Host ""
        
        Remove-Item $installerPath -ErrorAction SilentlyContinue
        
        Write-Host "Refreshing environment variables..." -ForegroundColor Yellow
        $machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
        $userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
        $env:Path = $machinePath + ";" + $userPath
        
        Write-Host "[OK] Setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[!] IMPORTANT: You need to restart your terminal for changes to take effect." -ForegroundColor Yellow
        Write-Host "   After restarting, run this script again to install project dependencies." -ForegroundColor Yellow
        Write-Host ""
        
        $nodeCheck = Get-Command node -ErrorAction SilentlyContinue
        if ($nodeCheck) {
            Write-Host "[OK] Node.js is now available!" -ForegroundColor Green
        } else {
            Write-Host "[!] Please restart your terminal and run this script again." -ForegroundColor Yellow
            exit
        }
        
    } catch {
        Write-Host "[ERROR] Error downloading or installing Node.js: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual installation required:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "2. Download the LTS version" -ForegroundColor Cyan
        Write-Host "3. Run the installer" -ForegroundColor Cyan
        Write-Host "4. Restart your terminal" -ForegroundColor Cyan
        Write-Host "5. Run this script again" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Project Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "d:\3d.prototype"
Set-Location $projectDir

Write-Host "Project directory: $projectDir" -ForegroundColor Gray
Write-Host ""

if (Test-Path "package.json") {
    Write-Host "Found package.json [OK]" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Installing npm packages (this may take 2-5 minutes)..." -ForegroundColor Yellow
    Write-Host "Packages to install:" -ForegroundColor Gray
    Write-Host "  - React, React DOM" -ForegroundColor Gray
    Write-Host "  - React Three Fiber, Three.js" -ForegroundColor Gray
    Write-Host "  - MediaPipe Hands" -ForegroundColor Gray
    Write-Host "  - GSAP, Zustand" -ForegroundColor Gray
    Write-Host "  - Vite, TypeScript" -ForegroundColor Gray
    Write-Host ""
    
    try {
        npm install
        Write-Host ""
        Write-Host "[OK] All dependencies installed successfully!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Setup Complete!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Run the development server:" -ForegroundColor White
        Write-Host "   npm run dev" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "2. Open your browser to:" -ForegroundColor White
        Write-Host "   http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. Enable gesture controls:" -ForegroundColor White
        Write-Host "   - Click [Gesture: OFF] button" -ForegroundColor Gray
        Write-Host "   - Allow webcam permissions" -ForegroundColor Gray
        Write-Host "   - Use hand gestures to interact" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Enjoy your 3D Hologram Visualization!" -ForegroundColor Magenta
        
    } catch {
        Write-Host "[ERROR] Error installing dependencies: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try manually:" -ForegroundColor Yellow
        Write-Host "  cd d:\3d.prototype" -ForegroundColor Cyan
        Write-Host "  npm install" -ForegroundColor Cyan
        exit 1
    }
    
} else {
    Write-Host "[ERROR] package.json not found in $projectDir" -ForegroundColor Red
    exit 1
}
