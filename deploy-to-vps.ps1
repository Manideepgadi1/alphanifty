# Alphanifty Backend Deployment via SSH
# Run this in PowerShell

$VPS_IP = "82.25.105.18"
$VPS_USER = "root"
$PROJECT_PATH = "/var/www/html/alphanifty_root/alphanifty"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Alphanifty Backend Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create deployment commands
$deployCommands = @"
cd $PROJECT_PATH &&
echo 'Pulling latest code...' &&
git pull origin main &&
echo 'Installing Python dependencies...' &&
pip3 install -r backend/requirements.txt &&
echo 'Creating backend service...' &&
cat > /etc/systemd/system/alphanifty-backend.service << 'EOF'
[Unit]
Description=Alphanifty Flask Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_PATH/backend
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
echo 'Starting backend service...' &&
systemctl daemon-reload &&
systemctl enable alphanifty-backend &&
systemctl restart alphanifty-backend &&
echo 'Building frontend...' &&
npm install &&
npm run build &&
echo 'Testing backend...' &&
curl -s http://127.0.0.1:5000/api/health &&
echo '' &&
echo 'Deployment completed!' &&
systemctl status alphanifty-backend --no-pager
"@

Write-Host "Connecting to VPS..." -ForegroundColor Yellow
Write-Host "Please enter your VPS password when prompted." -ForegroundColor Yellow
Write-Host ""

# Execute deployment
ssh "$VPS_USER@$VPS_IP" $deployCommands

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Status Check" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://$VPS_IP/alphanifty/" -ForegroundColor Cyan
Write-Host "Backend API: http://$VPS_IP:5000/api/health" -ForegroundColor Cyan
