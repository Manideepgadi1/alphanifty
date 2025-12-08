@echo off
REM Alphanifty Deployment Script for Windows
REM This script builds and deploys the project to your Hostinger VPS

REM Configuration - UPDATE THESE VALUES
set VPS_USER=root
set VPS_IP=82.25.105.18
set VPS_PATH=/var/www/html/alphanifty

echo Starting Alphanifty Deployment...

REM Build the project
echo Building project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed. Deployment aborted.
    exit /b 1
)

echo Build successful!

REM Upload to VPS using SCP
echo Uploading to VPS...
scp -r dist/* %VPS_USER%@%VPS_IP%:%VPS_PATH%/

if %errorlevel% neq 0 (
    echo Upload failed.
    exit /b 1
)

echo Upload successful!
echo Deployment complete!
echo Your application should be live at your configured domain/subdomain.

pause
