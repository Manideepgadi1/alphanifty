# Quick Deployment Guide for http://82.25.105.18/alphanifty

## ⚡ Quick Deploy Steps

### 1. Build the Project (On Your Local Machine)
```powershell
npm run build
```

### 2. Deploy to VPS
Run the deployment script:
```powershell
.\deploy.bat
```

OR manually upload:
```powershell
scp -r build/* root@82.25.105.18:/var/www/html/alphanifty/
```

### 3. Configure Web Server on VPS

**SSH into your VPS:**
```bash
ssh root@82.25.105.18
```

**Create directory:**
```bash
mkdir -p /var/www/html/alphanifty
chmod -R 755 /var/www/html/alphanifty
```

**For Nginx:**
Edit your default site configuration:
```bash
nano /etc/nginx/sites-available/default
```

Add this inside the `server { }` block:
```nginx
location /alphanifty {
    alias /var/www/html/alphanifty;
    index index.html;
    try_files $uri $uri/ /alphanifty/index.html;
    
    location = /alphanifty {
        return 301 /alphanifty/;
    }
}
```

Test and reload:
```bash
nginx -t
systemctl reload nginx
```

**For Apache:**
Edit your default site configuration:
```bash
nano /etc/apache2/sites-available/000-default.conf
```

Add this inside the `<VirtualHost *:80>` block:
```apache
Alias /alphanifty /var/www/html/alphanifty

<Directory /var/www/html/alphanifty>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
    
    RewriteEngine On
    RewriteBase /alphanifty/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /alphanifty/index.html [L]
</Directory>
```

Enable rewrite module and reload:
```bash
a2enmod rewrite
systemctl reload apache2
```

### 4. Access Your Application
Open browser: **http://82.25.105.18/alphanifty**

---

## 🔄 Future Updates

When you make changes, just run:
```powershell
npm run build
.\deploy.bat
```

---

## ✅ Your Setup:
- **URL:** http://82.25.105.18/alphanifty
- **VPS IP:** 82.25.105.18
- **Deploy Path:** /var/www/html/alphanifty
- **Existing projects:** Will remain untouched at their current locations

---

## ⚠️ Important Notes:
1. The `vite.config.ts` is already configured with `base: '/alphanifty/'`
2. Build output goes to `build/` folder
3. Your existing website at http://82.25.105.18 will not be affected
4. Make sure port 80 is open on your VPS
