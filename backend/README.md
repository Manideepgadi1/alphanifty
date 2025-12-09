# Alphanifty Backend API

Python Flask backend for calculating basket metrics and generating graph data.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will run on `http://localhost:5000`

## API Endpoints

### GET /api/baskets/conservative-balanced
Returns Conservative Balanced Basket data with:
- Calculated weighted metrics (CAGR, risk, Sharpe ratio)
- NAV-based graph data
- Period returns (1M, 3M, 6M, 1Y, 3Y, 5Y)
- Fund details

### GET /api/baskets/aggressive-hybrid
Returns Aggressive Hybrid Basket data with same structure

### GET /api/health
Health check endpoint

## Deployment on VPS

```bash
# Install Python and pip
sudo apt update
sudo apt install python3 python3-pip -y

# Clone and setup
cd /var/www/html/alphanifty
pip3 install -r backend/requirements.txt

# Run with gunicorn (production)
pip3 install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app

# Or use systemd service (recommended)
# Create /etc/systemd/system/alphanifty-api.service
```

## Systemd Service File

Create `/etc/systemd/system/alphanifty-api.service`:

```ini
[Unit]
Description=Alphanifty Backend API
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/html/alphanifty
ExecStart=/usr/bin/python3 backend/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable alphanifty-api
sudo systemctl start alphanifty-api
sudo systemctl status alphanifty-api
```
