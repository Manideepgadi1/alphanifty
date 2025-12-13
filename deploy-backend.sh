#!/bin/bash

# Alphanifty Backend Deployment Script
# Run this on your VPS at 82.25.105.18

echo "=========================================="
echo "Alphanifty Backend Deployment"
echo "=========================================="

# Navigate to project directory
cd /var/www/html/alphanifty_root/alphanifty || exit 1
echo "✓ Changed to project directory"

# Pull latest changes from GitHub
echo ""
echo "Pulling latest code from GitHub..."
git pull origin main
echo "✓ Code updated"

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
pip3 install -r backend/requirements.txt
echo "✓ Python packages installed"

# Rebuild frontend
echo ""
echo "Building frontend..."
npm install
npm run build
echo "✓ Frontend built"

# Create systemd service for Flask backend
echo ""
echo "Setting up Flask backend service..."

cat > /etc/systemd/system/alphanifty-backend.service << 'EOF'
[Unit]
Description=Alphanifty Flask Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/html/alphanifty_root/alphanifty/backend
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 /var/www/html/alphanifty_root/alphanifty/backend/app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable alphanifty-backend
systemctl restart alphanifty-backend
echo "✓ Flask backend service created and started"

# Update Nginx to proxy API requests
echo ""
echo "Updating Nginx configuration..."

# Backup existing config
cp /etc/nginx/sites-available/combined /etc/nginx/sites-available/combined.backup-$(date +%Y%m%d-%H%M%S)

# Add API proxy to Nginx config (only if not already present)
if ! grep -q "location /api/" /etc/nginx/sites-available/combined; then
    # Insert API location block before the alphanifty location
    sed -i '/location \/alphanifty\/ {/i\    # Alphanifty Backend API\n    location /api/ {\n        proxy_pass http://127.0.0.1:5000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n' /etc/nginx/sites-available/combined
fi

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "✓ Nginx configuration updated and reloaded"
else
    echo "✗ Nginx configuration test failed"
    exit 1
fi

# Check service status
echo ""
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
echo ""
echo "Flask Backend:"
systemctl status alphanifty-backend --no-pager | grep "Active:"
echo ""
echo "Backend API URL: http://82.25.105.18:5000/api/health"
echo "Frontend URL: http://82.25.105.18/alphanifty/"
echo ""
echo "✓ Deployment completed successfully!"
echo ""
echo "Testing API endpoint..."
curl -s http://127.0.0.1:5000/api/health | python3 -m json.tool
