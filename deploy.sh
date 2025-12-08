#!/bin/bash

# Alphanifty Deployment Script
# This script builds and deploys the project to your Hostinger VPS

# Configuration
VPS_USER="your-username"
VPS_IP="your-vps-ip"
VPS_PATH="/var/www/alphanifty"

echo "🚀 Starting Alphanifty Deployment..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

echo "✅ Build successful!"

# Upload to VPS
echo "📤 Uploading to VPS..."
scp -r dist/* ${VPS_USER}@${VPS_IP}:${VPS_PATH}/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed."
    exit 1
fi

echo "✅ Upload successful!"

# Optional: Restart web server (uncomment if needed)
# ssh ${VPS_USER}@${VPS_IP} "sudo systemctl reload nginx"

echo "🎉 Deployment complete!"
echo "Your application should be live at your configured domain/subdomain."
