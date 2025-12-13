# Alphanifty Backend Deployment Commands

## Step 1: SSH into your VPS
ssh root@82.25.105.18

## Step 2: Navigate to project directory
cd /var/www/html/alphanifty_root/alphanifty

## Step 3: Pull latest changes
git pull origin main

## Step 4: Install Python dependencies
pip3 install -r backend/requirements.txt

## Step 5: Create Flask backend systemd service
cat > /etc/systemd/system/alphanifty-backend.service << 'EOF'
[Unit]
Description=Alphanifty Flask Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/html/alphanifty_root/alphanifty/backend
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

## Step 6: Start the backend service
systemctl daemon-reload
systemctl enable alphanifty-backend
systemctl start alphanifty-backend
systemctl status alphanifty-backend

## Step 7: Update Nginx configuration
nano /etc/nginx/sites-available/combined

# Add this BEFORE the "location /alphanifty/" block:

    # Alphanifty Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

## Step 8: Test and reload Nginx
nginx -t
systemctl reload nginx

## Step 9: Rebuild frontend
cd /var/www/html/alphanifty_root/alphanifty
npm install
npm run build

## Step 10: Test the deployment
curl http://127.0.0.1:5000/api/health
curl http://82.25.105.18/api/health

# Visit: http://82.25.105.18/alphanifty/
