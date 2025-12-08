# Alphanifty Investment Platform - Deployment Guide for Hostinger VPS

## Prerequisites
- SSH access to your Hostinger VPS
- Node.js installed on VPS (v16 or higher)
- Nginx or Apache web server configured
- Your existing project should remain untouched

## Deployment Steps

### 1. Build the Project Locally

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `dist` folder with optimized production files.

### 2. Connect to Your VPS

```bash
ssh username@your-vps-ip
```

### 3. Create a New Directory for This Project

```bash
# Navigate to web root (adjust path based on your setup)
cd /var/www/

# Create directory for Alphanifty project
sudo mkdir -p alphanifty
sudo chown $USER:$USER alphanifty
cd alphanifty
```

### 4. Upload Files to VPS

**Option A: Using SCP (from your local machine)**
```bash
# From your project directory on local machine
scp -r dist/* username@your-vps-ip:/var/www/alphanifty/
```

**Option B: Using FTP/SFTP**
- Use FileZilla or WinSCP
- Connect to your VPS
- Upload the `dist` folder contents to `/var/www/alphanifty/`

**Option C: Using Git (Recommended)**
```bash
# On VPS
cd /var/www/alphanifty
git clone <your-repository-url> .
npm install
npm run build
```

### 5. Configure Nginx (If using Nginx)

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/alphanifty
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name alphanifty.yourdomain.com;  # Use subdomain
    # OR use: yourdomain.com/alphanifty;     # Use subfolder

    root /var/www/alphanifty/dist;
    index index.html;

    # For subfolder setup, use:
    # location /alphanifty {
    #     alias /var/www/alphanifty/dist;
    #     try_files $uri $uri/ /alphanifty/index.html;
    # }

    # For subdomain setup, use:
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 6;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site and test configuration:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/alphanifty /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. Configure Apache (If using Apache)

Create a new configuration file:

```bash
sudo nano /etc/apache2/sites-available/alphanifty.conf
```

Add this configuration:

```apache
<VirtualHost *:80>
    ServerName alphanifty.yourdomain.com
    DocumentRoot /var/www/alphanifty/dist

    <Directory /var/www/alphanifty/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>

    ErrorLog ${APACHE_LOG_DIR}/alphanifty_error.log
    CustomLog ${APACHE_LOG_DIR}/alphanifty_access.log combined
</VirtualHost>
```

Enable the site:

```bash
# Enable rewrite module
sudo a2enmod rewrite

# Enable the site
sudo a2ensite alphanifty.conf

# Test Apache configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

### 7. Set Up SSL (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx  # For Nginx
# OR
sudo apt install certbot python3-certbot-apache  # For Apache

# Get SSL certificate
sudo certbot --nginx -d alphanifty.yourdomain.com  # For Nginx
# OR
sudo certbot --apache -d alphanifty.yourdomain.com  # For Apache
```

### 8. DNS Configuration

**For Subdomain (Recommended):**
- In your domain's DNS settings (Hostinger panel)
- Add an A record:
  - Name: `alphanifty`
  - Points to: Your VPS IP address
  - TTL: 3600

**For Subfolder:**
- No DNS changes needed
- Access via: `yourdomain.com/alphanifty`

## Deployment Options

### Option 1: Subdomain (Recommended)
- URL: `https://alphanifty.yourdomain.com`
- Benefits: Clean separation, independent SSL, easier to manage
- Your existing site remains at: `https://yourdomain.com`

### Option 2: Subfolder
- URL: `https://yourdomain.com/alphanifty`
- Benefits: Same domain, no DNS changes needed
- Requires base URL configuration in Vite config

## If Using Subfolder Option

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/alphanifty/',  // Add this line
  plugins: [react()],
  // ... rest of config
});
```

Then rebuild:
```bash
npm run build
```

## Updating the Application

When you make changes:

```bash
# On local machine
npm run build

# Upload new dist folder to VPS
scp -r dist/* username@your-vps-ip:/var/www/alphanifty/

# OR if using Git on VPS
ssh username@your-vps-ip
cd /var/www/alphanifty
git pull
npm run build
```

## Troubleshooting

### 404 Errors on Refresh
- Ensure your web server is configured to redirect all routes to `index.html`
- Check the `try_files` directive in Nginx or `RewriteRule` in Apache

### Assets Not Loading
- Check the `base` URL in `vite.config.ts` if using subfolder
- Verify file permissions: `sudo chmod -R 755 /var/www/alphanifty`

### Nginx/Apache Not Starting
- Check logs: `sudo tail -f /var/log/nginx/error.log` or `/var/log/apache2/error.log`
- Test configuration: `sudo nginx -t` or `sudo apache2ctl configtest`

## File Permissions

```bash
# Set correct permissions
sudo chown -R www-data:www-data /var/www/alphanifty
sudo chmod -R 755 /var/www/alphanifty
```

## Quick Deployment Script

Create `deploy.sh` in your project:

```bash
#!/bin/bash
echo "Building project..."
npm run build

echo "Uploading to VPS..."
scp -r dist/* username@your-vps-ip:/var/www/alphanifty/

echo "Deployment complete!"
```

Make it executable: `chmod +x deploy.sh`

Run: `./deploy.sh`

---

## Summary

Your existing project at `yourdomain.com` will remain untouched. The Alphanifty platform will be accessible at:
- **Subdomain**: `https://alphanifty.yourdomain.com` (Recommended)
- **Subfolder**: `https://yourdomain.com/alphanifty`

Both sites run independently on the same VPS.
