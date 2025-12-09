from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load Nifty 50 historical data
NIFTY_DATA_FILE = os.path.join(os.path.dirname(__file__), 'nifty_data.csv')
nifty_df = pd.read_csv(NIFTY_DATA_FILE)
nifty_df['DATE'] = pd.to_datetime(nifty_df['DATE'], format='%d/%m/%y')
nifty_df = nifty_df.sort_values('DATE')

# Fund data from Excel
CONSERVATIVE_BALANCED_FUNDS = [
    {
        'id': 'f17',
        'name': 'ICICI Pru Balanced Advantage Fund(G)',
        'age': 18,
        'aum': 68449.94,
        'incpRet': 11.42,
        'std': 7.15,
        'ret3Y': 13.43,
        'ret5Y': 13.22,
        'sharpe': 0.36,
        'expenseRatio': 1.44,
        'allocation': 14.29
    },
    {
        'id': 'f18',
        'name': 'SBI Balanced Advantage Fund-Reg(G)',
        'age': 4,
        'aum': 38628.37,
        'incpRet': 11.64,
        'std': 7.75,
        'ret3Y': 13.8,
        'ret5Y': 0,  # NaN in data
        'sharpe': 0.18,
        'expenseRatio': 1.55,
        'allocation': 14.29
    },
    {
        'id': 'f19',
        'name': 'HDFC Balanced Advantage Fund(G)',
        'age': 25,
        'aum': 106493.55,
        'incpRet': 17.06,
        'std': 9.66,
        'ret3Y': 17.39,
        'ret5Y': 20.59,
        'sharpe': 0.05,
        'expenseRatio': 1.34,
        'allocation': 14.29
    },
    {
        'id': 'f20',
        'name': 'DSP Dynamic Asset Allocation Fund-Reg(G)',
        'age': 11,
        'aum': 3635.61,
        'incpRet': 9.24,
        'std': 5.6,
        'ret3Y': 12.11,
        'ret5Y': 9.66,
        'sharpe': 0.21,
        'expenseRatio': 1.89,
        'allocation': 14.29
    },
    {
        'id': 'f21',
        'name': 'ICICI Pru Regular Savings Fund-Reg(G)',
        'age': 21,
        'aum': 3375.12,
        'incpRet': 9.92,
        'std': 3.54,
        'ret3Y': 10.04,
        'ret5Y': 9.34,
        'sharpe': 0.39,
        'expenseRatio': 1.72,
        'allocation': 14.29
    },
    {
        'id': 'f22',
        'name': 'SBI Conservative Hybrid Fund-Reg(G)',
        'age': 24,
        'aum': 9977.35,
        'incpRet': 8.46,
        'std': 3.86,
        'ret3Y': 9.77,
        'ret5Y': 9.98,
        'sharpe': 0.19,
        'expenseRatio': 1.54,
        'allocation': 14.29
    },
    {
        'id': 'f23',
        'name': 'HDFC Hybrid Debt Fund(G)',
        'age': 21,
        'aum': 3372.76,
        'incpRet': 10.16,
        'std': 3.7,
        'ret3Y': 9.73,
        'ret5Y': 10.22,
        'sharpe': 0.1,
        'expenseRatio': 1.75,
        'allocation': 14.29
    }
]

def calculate_weighted_metrics(funds):
    """Calculate weighted average metrics for the basket"""
    total_allocation = sum(fund['allocation'] for fund in funds)
    
    # Calculate weighted averages
    weighted_incpRet = sum(fund['incpRet'] * fund['allocation'] for fund in funds) / total_allocation
    weighted_ret3Y = sum(fund['ret3Y'] * fund['allocation'] for fund in funds) / total_allocation
    
    # For 5Y return, exclude funds with 0 (NaN) values
    funds_with_5y = [f for f in funds if f['ret5Y'] > 0]
    if funds_with_5y:
        total_alloc_5y = sum(f['allocation'] for f in funds_with_5y)
        weighted_ret5Y = sum(f['ret5Y'] * f['allocation'] for f in funds_with_5y) / total_alloc_5y
    else:
        weighted_ret5Y = 0
    
    weighted_std = sum(fund['std'] * fund['allocation'] for fund in funds) / total_allocation
    weighted_sharpe = sum(fund['sharpe'] * fund['allocation'] for fund in funds) / total_allocation
    weighted_expense = sum(fund['expenseRatio'] * fund['allocation'] for fund in funds) / total_allocation
    
    return {
        'cagr1Y': round(weighted_incpRet, 2),
        'cagr3Y': round(weighted_ret3Y, 2),
        'cagr5Y': round(weighted_ret5Y, 2),
        'risk': round(weighted_std, 2),
        'sharpeRatio': round(weighted_sharpe, 2),
        'expenseRatio': round(weighted_expense, 2)
    }

def generate_nav_based_graph_data(funds, years=5):
    """Generate NAV-based performance graph data"""
    # Starting NAV (assumed base of 100 for each fund)
    base_nav = 100
    
    # Generate monthly data points
    months = years * 12
    dates = []
    current_date = datetime.now()
    
    for i in range(months, -1, -1):
        date = current_date - timedelta(days=i*30)
        dates.append(date.strftime('%Y-%m'))
    
    # Calculate portfolio NAV over time using weighted returns
    portfolio_navs = []
    
    for i, date in enumerate(dates):
        # Calculate time elapsed in years
        time_years = i / 12
        
        # Calculate NAV for each fund and weight it
        portfolio_nav = 0
        
        for fund in funds:
            # Use appropriate return based on time period
            if time_years <= 1:
                annual_return = fund['incpRet']
            elif time_years <= 3:
                annual_return = fund['ret3Y']
            elif time_years <= 5 and fund['ret5Y'] > 0:
                annual_return = fund['ret5Y']
            else:
                annual_return = fund['ret3Y']  # Fallback to 3Y return
            
            # Calculate NAV using compound interest formula
            # Add volatility (standard deviation) for realistic fluctuations
            volatility_factor = np.random.normal(0, fund['std'] / 100 / 12)
            monthly_return = (1 + annual_return / 100) ** (1/12) - 1
            adjusted_return = monthly_return + volatility_factor
            
            fund_nav = base_nav * ((1 + adjusted_return) ** i)
            
            # Weight by allocation
            portfolio_nav += fund_nav * (fund['allocation'] / 100)
        
        portfolio_navs.append(round(portfolio_nav, 2))
    
    # Get actual Nifty 50 historical data
    nifty_navs = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years*365)
    
    # Filter Nifty data for the time period
    nifty_period = nifty_df[(nifty_df['DATE'] >= start_date) & (nifty_df['DATE'] <= end_date)].copy()
    
    if len(nifty_period) > 0:
        # Get the earliest Nifty 50 value as base
        base_nifty_value = float(nifty_period.iloc[0]['NIFTY 50'])
        
        # Resample to monthly data - using set_value to avoid SettingWithCopyWarning
        nifty_period.loc[:, 'year_month'] = nifty_period['DATE'].dt.to_period('M')  # type: ignore
        nifty_monthly = nifty_period.groupby('year_month')['NIFTY 50'].last().reset_index()
        nifty_monthly.loc[:, 'year_month'] = nifty_monthly['year_month'].astype(str).apply(lambda x: pd.to_datetime(x))
        
        # Align with our date labels
        for date_str in dates:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m')
                # Find closest month in nifty data
                time_diffs = (nifty_monthly['year_month'] - target_date).abs()
                closest_idx = int(time_diffs.idxmin())
                nifty_value = float(nifty_monthly.loc[closest_idx, 'NIFTY 50'])  # type: ignore
                
                # Normalize to base 100 for comparison
                normalized_nav = (nifty_value / base_nifty_value) * base_nav
                nifty_navs.append(round(normalized_nav, 2))
            except:
                # Fallback to portfolio NAV if date not found
                if len(nifty_navs) > 0:
                    nifty_navs.append(nifty_navs[-1])
                else:
                    nifty_navs.append(base_nav)
    else:
        # Fallback: use estimated CAGR if no data available
        nifty_cagr = 12.0
        for i in range(len(dates)):
            time_years = i / 12
            nifty_nav = base_nav * ((1 + nifty_cagr / 100) ** time_years)
            nifty_navs.append(round(nifty_nav, 2))
    
    return {
        'labels': dates,
        'basketData': portfolio_navs,
        'niftyData': nifty_navs
    }

def calculate_returns_from_nav(navs):
    """Calculate returns from NAV data"""
    if len(navs) < 2:
        return {'1M': 0, '3M': 0, '6M': 0, '1Y': 0, '3Y': 0, '5Y': 0}
    
    latest = navs[-1]
    
    returns = {}
    
    # 1 Month (1 data point back)
    if len(navs) > 1:
        returns['1M'] = round(((latest - navs[-2]) / navs[-2]) * 100, 2)
    
    # 3 Months (3 data points back)
    if len(navs) > 3:
        returns['3M'] = round(((latest - navs[-4]) / navs[-4]) * 100, 2)
    
    # 6 Months (6 data points back)
    if len(navs) > 6:
        returns['6M'] = round(((latest - navs[-7]) / navs[-7]) * 100, 2)
    
    # 1 Year (12 data points back)
    if len(navs) > 12:
        returns['1Y'] = round(((latest - navs[-13]) / navs[-13]) * 100, 2)
    
    # 3 Years (36 data points back)
    if len(navs) > 36:
        returns['3Y'] = round(((latest - navs[-37]) / navs[-37]) * 100 / 3, 2)
    
    # 5 Years (60 data points back)
    if len(navs) > 60:
        returns['5Y'] = round(((latest - navs[-61]) / navs[-61]) * 100 / 5, 2)
    
    return returns

@app.route('/api/baskets/conservative-balanced', methods=['GET'])
def get_conservative_balanced_basket():
    """Get Conservative Balanced Basket data with calculations"""
    
    # Get years parameter from query string (default: 5)
    years = request.args.get('years', default=5, type=int)
    
    # Calculate weighted metrics
    metrics = calculate_weighted_metrics(CONSERVATIVE_BALANCED_FUNDS)
    
    # Generate graph data
    graph_data = generate_nav_based_graph_data(CONSERVATIVE_BALANCED_FUNDS, years=years)
    
    # Calculate period returns from NAV
    period_returns = calculate_returns_from_nav(graph_data['basketData'])
    
    basket_data = {
        'id': 'b10',
        'name': 'Conservative Balanced Basket',
        'color': '#10B981',
        'description': 'Conservative hybrid balanced portfolio for shorter horizons',
        'ageRange': 'All ages',
        'riskLevel': 'Low',
        'minInvestment': 10000,
        'timeHorizon': '1-3 years',
        'goals': ['Short-term Goals', 'Parking Fund', 'Emergency Buffer', 'Marriage'],
        'experienceLevel': 'Beginner to Expert',
        
        # Calculated metrics
        'metrics': metrics,
        'periodReturns': period_returns,
        
        # Graph data
        'graphData': graph_data,
        
        # Fund details
        'funds': CONSERVATIVE_BALANCED_FUNDS,
        
        # Philosophy and rationale
        'rationale': 'A conservative balanced approach designed for shorter investment horizons and capital preservation with modest growth. The portfolio features top-performing balanced advantage funds from ICICI, SBI, and HDFC, along with conservative hybrid and regular savings funds. This diversified mix across seven funds provides stability while generating better-than-debt returns, ideal for near-term financial goals where capital safety is paramount.',
        
        'philosophy': 'Conservative investing doesn\'t mean sacrificing returns—it means prioritizing capital protection while seeking reasonable growth. Our philosophy for short-term goals emphasizes balanced advantage and conservative hybrid funds that dynamically manage equity exposure. We believe that 1-3 year horizons demand a defensive posture with tactical growth opportunities. Through broad diversification across conservative hybrid strategies, we aim to deliver stable, predictable returns that exceed traditional fixed deposits while minimizing downside risk.',
        
        'suitableFor': 'Risk-averse investors or those with short-term goals (1-3 years) requiring capital safety with moderate growth',
        'rebalancingFrequency': 'Half-yearly'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/aggressive-hybrid', methods=['GET'])
def get_aggressive_hybrid_basket():
    """Get Aggressive Hybrid Basket data"""
    
    # Get years parameter from query string (default: 5)
    years = request.args.get('years', default=5, type=int)
    
    AGGRESSIVE_HYBRID_FUNDS = [
        {'id': 'f11', 'name': 'HDFC Hybrid Equity Fund(G)', 'incpRet': 12.82, 'ret3Y': 11.6, 'ret5Y': 14.97, 'std': 9.9, 'sharpe': 0, 'expenseRatio': 1.68, 'allocation': 16.67},
        {'id': 'f12', 'name': 'ICICI Pru Equity & Debt Fund(G)', 'incpRet': 15.31, 'ret3Y': 18.58, 'ret5Y': 22.77, 'std': 10.7, 'sharpe': 0.25, 'expenseRatio': 1.54, 'allocation': 16.67},
        {'id': 'f13', 'name': 'SBI Equity Hybrid Fund-Reg(G)', 'incpRet': 15.43, 'ret3Y': 13.61, 'ret5Y': 14.34, 'std': 10.48, 'sharpe': 0.24, 'expenseRatio': 1.38, 'allocation': 16.67},
        {'id': 'f14', 'name': 'HDFC Hybrid Equity Fund(G)(Adjusted)', 'incpRet': 15.09, 'ret3Y': 11.6, 'ret5Y': 14.97, 'std': 9.9, 'sharpe': 0, 'expenseRatio': 1.68, 'allocation': 16.67},
        {'id': 'f15', 'name': 'Tata Equity Savings Fund-Reg(G)', 'incpRet': 7.95, 'ret3Y': 9.65, 'ret5Y': 9.18, 'std': 3.42, 'sharpe': 0.22, 'expenseRatio': 1.13, 'allocation': 16.67},
        {'id': 'f16', 'name': 'Kotak Bond Short Term Fund(G)', 'incpRet': 7.37, 'ret3Y': 7.22, 'ret5Y': 5.58, 'std': 1.11, 'sharpe': 1.17, 'expenseRatio': 1.12, 'allocation': 16.67}
    ]
    
    metrics = calculate_weighted_metrics(AGGRESSIVE_HYBRID_FUNDS)
    graph_data = generate_nav_based_graph_data(AGGRESSIVE_HYBRID_FUNDS, years=years)
    period_returns = calculate_returns_from_nav(graph_data['basketData'])
    
    basket_data = {
        'id': 'b9',
        'name': 'Aggressive Hybrid Basket',
        'color': '#DC2626',
        'description': 'Hybrid aggressive portfolio for medium to long-term goals',
        'metrics': metrics,
        'periodReturns': period_returns,
        'graphData': graph_data,
        'funds': AGGRESSIVE_HYBRID_FUNDS
    }
    
    return jsonify(basket_data)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Alphanifty Backend API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
