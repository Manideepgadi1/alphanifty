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

# Load new basket Excel data
WHITE_BASKET_FILE = os.path.join(os.path.dirname(__file__), 'White Basket.xlsx')
EVERY_COMMON_INDIA_FILE = os.path.join(os.path.dirname(__file__), 'every_common_india.xlsx')
RAISING_INDIA_FILE = os.path.join(os.path.dirname(__file__), 'Raising_India.xlsx')
GREAT_INDIA_FILE = os.path.join(os.path.dirname(__file__), 'Greate India Basket.xlsx')
AGGRESSIVE_BASKET_FILE = os.path.join(os.path.dirname(__file__), 'aggresive basket.xlsx')
CONSERVATIVE_BASKET_FILE = os.path.join(os.path.dirname(__file__), 'CONSERVATIVE BASKET.xlsx')
DUSSHERA_BASKET_FILE = os.path.join(os.path.dirname(__file__), 'Dusshera basket.xlsx')
YELLOW_BASKET_FILE = os.path.join(os.path.dirname(__file__), 'Yellow basket.xlsx')

# Load White Basket
white_basket_df = pd.read_excel(WHITE_BASKET_FILE)
white_basket_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
white_basket_df['DATE'] = pd.to_datetime(white_basket_df['DATE'])
white_basket_df = white_basket_df.sort_values('DATE')

# Load Every Common India
every_common_df = pd.read_excel(EVERY_COMMON_INDIA_FILE)
every_common_df['DATE'] = pd.to_datetime(every_common_df['DATE'])
every_common_df = every_common_df.sort_values('DATE')

# Load Raising India Basket
raising_india_df = pd.read_excel(RAISING_INDIA_FILE)
raising_india_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
raising_india_df['DATE'] = pd.to_datetime(raising_india_df['DATE'])
raising_india_df = raising_india_df.sort_values('DATE')

# Load Great India Basket
great_india_df = pd.read_excel(GREAT_INDIA_FILE)
great_india_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
great_india_df['DATE'] = pd.to_datetime(great_india_df['DATE'], errors='coerce')
great_india_df = great_india_df.sort_values('DATE')

# Load Aggressive Basket (dates in descending order, need to sort)
aggressive_basket_df = pd.read_excel(AGGRESSIVE_BASKET_FILE)
aggressive_basket_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
aggressive_basket_df['DATE'] = pd.to_datetime(aggressive_basket_df['DATE'], errors='coerce')
aggressive_basket_df = aggressive_basket_df.sort_values('DATE')  # Sort ascending (old to new)

# Load Conservative Basket
conservative_basket_df = pd.read_excel(CONSERVATIVE_BASKET_FILE)
conservative_basket_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
conservative_basket_df['DATE'] = pd.to_datetime(conservative_basket_df['DATE'])
conservative_basket_df = conservative_basket_df.sort_values('DATE')

# Load Dusshera Basket
dusshera_basket_df = pd.read_excel(DUSSHERA_BASKET_FILE)
dusshera_basket_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
dusshera_basket_df['DATE'] = pd.to_datetime(dusshera_basket_df['DATE'])
dusshera_basket_df = dusshera_basket_df.sort_values('DATE')

# Load Yellow Basket
yellow_basket_df = pd.read_excel(YELLOW_BASKET_FILE)
yellow_basket_df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
yellow_basket_df['DATE'] = pd.to_datetime(yellow_basket_df['DATE'])
yellow_basket_df = yellow_basket_df.sort_values('DATE')

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

def generate_great_india_graph_data(years=5):
    """Generate graph data for Great India Basket from Excel with both absolute and rolling returns"""
    df = great_india_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket_NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY_50'].ffill()
    
    # Normalize to 100 at the start of the filtered period for better comparison
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12  # Convert years to months
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    # Use the full dataset for rolling returns calculation
    df_full = great_india_df.copy()
    df_full = df_full.sort_values('DATE')
    
    # Calculate rolling returns
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        past_date = df_full.iloc[i - rolling_window]['DATE']
        
        basket_current = df_full.iloc[i]['Basket_NAV']
        basket_past = df_full.iloc[i - rolling_window]['Basket_NAV']
        nifty_current = df_full.iloc[i]['NIFTY_50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY_50']
        
        # Calculate CAGR for the rolling period
        basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
        nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
        
        # Only include data points from the requested time period
        if current_date >= cutoff_date:
            rolling_labels.append(current_date.strftime('%b %Y'))
            rolling_basket.append(round(basket_cagr, 2))
            rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_aggressive_hybrid_graph_data(years=5):
    """Generate graph data for Aggressive Hybrid Basket from Excel with both absolute and rolling returns"""
    df = aggressive_basket_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket_NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY_50'].ffill()
    
    # Normalize to 100 at the start of the filtered period for better comparison
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12  # Convert years to months
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    # Use the full dataset for rolling returns calculation
    df_full = aggressive_basket_df.copy()
    df_full = df_full.sort_values('DATE')
    
    # Calculate rolling returns
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        past_date = df_full.iloc[i - rolling_window]['DATE']
        
        basket_current = df_full.iloc[i]['Basket_NAV']
        basket_past = df_full.iloc[i - rolling_window]['Basket_NAV']
        nifty_current = df_full.iloc[i]['NIFTY_50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY_50']
        
        # Calculate CAGR for the rolling period
        basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
        nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
        
        # Only include data points from the requested time period
        if current_date >= cutoff_date:
            rolling_labels.append(current_date.strftime('%b %Y'))
            rolling_basket.append(round(basket_cagr, 2))
            rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_every_common_india_graph_data(years=5):
    """Generate graph data for Every Common India Basket with both absolute and rolling returns"""
    df = every_common_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket NAV Every Common India'].ffill()
    nifty_navs_raw = df_monthly['NIFTY 50'].ffill()
    
    # Normalize to 100 at the start of the filtered period
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12  # Convert years to months
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    # Use the full dataset for rolling returns calculation
    df_full = every_common_df.copy()
    df_full = df_full.sort_values('DATE')
    
    # Calculate rolling returns
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        
        basket_current = df_full.iloc[i]['Basket NAV Every Common India']
        basket_past = df_full.iloc[i - rolling_window]['Basket NAV Every Common India']
        nifty_current = df_full.iloc[i]['NIFTY 50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY 50']
        
        # Calculate CAGR for the rolling period
        if basket_past > 0 and nifty_past > 0:
            basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
            nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
            
            # Only include data points from the requested time period
            if current_date >= cutoff_date:
                rolling_labels.append(current_date.strftime('%b %Y'))
                rolling_basket.append(round(basket_cagr, 2))
                rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_raising_india_graph_data(years=5):
    """Generate graph data for Raising India Basket from Excel with absolute returns only"""
    df = raising_india_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %Y').tolist()
    
    # Get basket NAV and Nifty 50 values and normalize to 100 at start
    basket_navs_raw = df_monthly['Weightage NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY 50'].ffill()
    
    # Normalize both to 100 at the start of the filtered period
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns from absolute data
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    # Use the full dataset for rolling calculations
    df_full = df.copy()
    df_full = df_full.sort_values('DATE')
    
    if years == 1:
        periods = 252  # ~1 year of trading days
    elif years == 3:
        periods = 756  # ~3 years of trading days
    else:
        periods = 1260  # ~5 years of trading days
    
    # Calculate rolling returns
    for i in range(periods, len(df_full)):
        date = df_full.iloc[i]['DATE']
        basket_current = df_full.iloc[i]['Weightage NAV']
        basket_past = df_full.iloc[i - periods]['Weightage NAV']
        nifty_current = df_full.iloc[i]['NIFTY 50']
        nifty_past = df_full.iloc[i - periods]['NIFTY 50']
        
        if basket_past > 0 and nifty_past > 0:
            basket_return = ((basket_current / basket_past) ** (1 / years) - 1) * 100
            nifty_return = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
            
            rolling_labels.append(date.strftime('%b %Y'))
            rolling_basket.append(round(basket_return, 2))
            rolling_nifty.append(round(nifty_return, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(v, 2) for v in basket_navs],
            'niftyData': [round(v, 2) for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_conservative_basket_graph_data(years=5):
    """Generate graph data for Conservative Basket with both absolute and rolling returns"""
    df = conservative_basket_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket_NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY_50'].ffill()
    
    # Normalize to 100 at the start
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    df_full = conservative_basket_df.copy()
    df_full = df_full.sort_values('DATE')
    
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        basket_current = df_full.iloc[i]['Basket_NAV']
        basket_past = df_full.iloc[i - rolling_window]['Basket_NAV']
        nifty_current = df_full.iloc[i]['NIFTY_50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY_50']
        
        basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
        nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
        
        if current_date >= cutoff_date:
            rolling_labels.append(current_date.strftime('%b %Y'))
            rolling_basket.append(round(basket_cagr, 2))
            rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_dusshera_basket_graph_data(years=5):
    """Generate graph data for Dusshera Basket with both absolute and rolling returns"""
    df = dusshera_basket_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket_NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY_50'].ffill()
    
    # Normalize to 100 at the start
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    df_full = dusshera_basket_df.copy()
    df_full = df_full.sort_values('DATE')
    
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        basket_current = df_full.iloc[i]['Basket_NAV']
        basket_past = df_full.iloc[i - rolling_window]['Basket_NAV']
        nifty_current = df_full.iloc[i]['NIFTY_50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY_50']
        
        basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
        nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
        
        if current_date >= cutoff_date:
            rolling_labels.append(current_date.strftime('%b %Y'))
            rolling_basket.append(round(basket_cagr, 2))
            rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

def generate_yellow_basket_graph_data(years=5):
    """Generate graph data for Yellow Basket with both absolute and rolling returns"""
    df = yellow_basket_df.copy()
    
    # Filter data based on years requested
    cutoff_date = df['DATE'].max() - pd.DateOffset(years=years)
    df_filtered = df[df['DATE'] >= cutoff_date].copy()
    
    # Resample to monthly data
    df_filtered.set_index('DATE', inplace=True)
    df_monthly = df_filtered.resample('MS').first()
    df_monthly.reset_index(inplace=True)
    
    # Prepare absolute returns data
    labels = df_monthly['DATE'].dt.strftime('%b %y').tolist()
    
    # Get basket NAV and Nifty 50 values
    basket_navs_raw = df_monthly['Basket_NAV'].ffill()
    nifty_navs_raw = df_monthly['NIFTY_50'].ffill()
    
    # Normalize to 100 at the start
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Calculate rolling returns
    rolling_window = years * 12
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    df_full = yellow_basket_df.copy()
    df_full = df_full.sort_values('DATE')
    
    for i in range(rolling_window, len(df_full)):
        current_date = df_full.iloc[i]['DATE']
        basket_current = df_full.iloc[i]['Basket_NAV']
        basket_past = df_full.iloc[i - rolling_window]['Basket_NAV']
        nifty_current = df_full.iloc[i]['NIFTY_50']
        nifty_past = df_full.iloc[i - rolling_window]['NIFTY_50']
        
        basket_cagr = ((basket_current / basket_past) ** (1 / years) - 1) * 100
        nifty_cagr = ((nifty_current / nifty_past) ** (1 / years) - 1) * 100
        
        if current_date >= cutoff_date:
            rolling_labels.append(current_date.strftime('%b %Y'))
            rolling_basket.append(round(basket_cagr, 2))
            rolling_nifty.append(round(nifty_cagr, 2))
    
    return {
        'absoluteReturns': {
            'labels': labels,
            'basketData': [round(float(v), 2) if not np.isnan(v) else 0 for v in basket_navs],
            'niftyData': [round(float(v), 2) if not np.isnan(v) else 0 for v in nifty_navs]
        },
        'rollingReturns': {
            'labels': rolling_labels,
            'basketData': rolling_basket,
            'niftyData': rolling_nifty
        }
    }

@app.route('/api/baskets/great-india', methods=['GET'])
def get_great_india_basket():
    """Get Great India Basket data with absolute and rolling returns"""
    
    years = request.args.get('years', default=5, type=int)
    
    # Generate graph data with both absolute and rolling returns
    graph_data = generate_great_india_graph_data(years=years)
    
    # Calculate metrics from absolute returns
    basket_navs = graph_data['absoluteReturns']['basketData']
    
    # Calculate CAGR
    if len(basket_navs) >= 12:
        cagr1Y = round(((basket_navs[-1] / basket_navs[-12]) ** (1/1) - 1) * 100, 2) if len(basket_navs) >= 12 else 0
    else:
        cagr1Y = 0
    
    if len(basket_navs) >= 36:
        cagr3Y = round(((basket_navs[-1] / basket_navs[-36]) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(basket_navs) >= 60:
        cagr5Y = round(((basket_navs[-1] / basket_navs[-60]) ** (1/5) - 1) * 100, 2)
    else:
        cagr5Y = 0
    
    basket_data = {
        'id': 'b14',
        'name': 'The Great India Basket',
        'color': '#FF6B35',
        'description': 'Diversified equity basket capturing India\'s growth story',
        'ageRange': 'All ages',
        'riskLevel': 'Medium-High',
        'minInvestment': 10000,
        'timeHorizon': '5-7 years',
        'goals': ['Long-term Wealth', 'Retirement', 'Children\'s Education', 'Dream Home'],
        'experienceLevel': 'Intermediate to Expert',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 12.5,
            'sharpe': 0.85
        },
        
        'graphData': graph_data,
        
        'funds': GREAT_INDIA_FUNDS,
        
        'rationale': 'The Great India Basket is designed to capture the comprehensive growth story of India across all market capitalizations and sectors. This diversified portfolio invests in funds spanning large-cap stability, mid-cap growth, and small-cap opportunities, providing exposure to India\'s dynamic economy.',
        
        'philosophy': 'India\'s economic transformation presents a unique long-term investment opportunity. Our philosophy emphasizes capturing this growth through diversified equity exposure across market caps and sectors, with a focus on quality and growth at reasonable prices.',
        
        'suitableFor': 'Investors with 5+ year horizon seeking to participate in India\'s growth story',
        'rebalancingFrequency': 'Quarterly'
    }
    
    return jsonify(basket_data)

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
    """Get Aggressive Hybrid Basket data with absolute and rolling returns"""
    
    # Get years parameter from query string (default: 5)
    years = request.args.get('years', default=5, type=int)
    
    # Generate graph data with both absolute and rolling returns
    graph_data = generate_aggressive_hybrid_graph_data(years=years)
    
    # Calculate metrics from absolute returns
    basket_navs = graph_data['absoluteReturns']['basketData']
    
    # Calculate CAGR
    if len(basket_navs) >= 12:
        cagr1Y = round(((basket_navs[-1] / basket_navs[-12]) ** (1/1) - 1) * 100, 2) if len(basket_navs) >= 12 else 0
    else:
        cagr1Y = 0
    
    if len(basket_navs) >= 36:
        cagr3Y = round(((basket_navs[-1] / basket_navs[-36]) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(basket_navs) >= 60:
        cagr5Y = round(((basket_navs[-1] / basket_navs[-60]) ** (1/5) - 1) * 100, 2)
    else:
        cagr5Y = 0
    
    AGGRESSIVE_HYBRID_FUNDS = [
        {'id': 'f11', 'name': 'HDFC Hybrid Equity Fund(G)', 'incpRet': 12.82, 'ret3Y': 11.6, 'ret5Y': 14.97, 'std': 9.9, 'sharpe': 0, 'expenseRatio': 1.68, 'allocation': 16.67},
        {'id': 'f12', 'name': 'ICICI Pru Equity & Debt Fund(G)', 'incpRet': 15.31, 'ret3Y': 18.58, 'ret5Y': 22.77, 'std': 10.7, 'sharpe': 0.25, 'expenseRatio': 1.54, 'allocation': 16.67},
        {'id': 'f13', 'name': 'SBI Equity Hybrid Fund-Reg(G)', 'incpRet': 15.43, 'ret3Y': 13.61, 'ret5Y': 14.34, 'std': 10.48, 'sharpe': 0.24, 'expenseRatio': 1.38, 'allocation': 16.67},
        {'id': 'f14', 'name': 'HDFC Hybrid Equity Fund(G)(Adjusted)', 'incpRet': 15.09, 'ret3Y': 11.6, 'ret5Y': 14.97, 'std': 9.9, 'sharpe': 0, 'expenseRatio': 1.68, 'allocation': 16.67},
        {'id': 'f15', 'name': 'Tata Equity Savings Fund-Reg(G)', 'incpRet': 7.95, 'ret3Y': 9.65, 'ret5Y': 9.18, 'std': 3.42, 'sharpe': 0.22, 'expenseRatio': 1.13, 'allocation': 16.67},
        {'id': 'f16', 'name': 'Kotak Bond Short Term Fund(G)', 'incpRet': 7.37, 'ret3Y': 7.22, 'ret5Y': 5.58, 'std': 1.11, 'sharpe': 1.17, 'expenseRatio': 1.12, 'allocation': 16.67}
    ]
    
    basket_data = {
        'id': 'b9',
        'name': 'Aggressive Hybrid Basket',
        'color': '#DC2626',
        'description': 'Hybrid aggressive portfolio for medium to long-term goals',
        'ageRange': '25-55 years',
        'riskLevel': 'Medium-High',
        'minInvestment': 10000,
        'timeHorizon': '3-5 years',
        'goals': ['Wealth Building', 'Retirement', 'Child Education', 'Major Purchase'],
        'experienceLevel': 'Intermediate to Expert',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 10.5,
            'sharpe': 0.75
        },
        
        'graphData': graph_data,
        
        'funds': AGGRESSIVE_HYBRID_FUNDS,
        
        'rationale': 'The Aggressive Hybrid Basket combines equity growth potential with debt stability through a diversified portfolio of hybrid funds. This balanced approach provides exposure to equity markets while managing risk through debt allocation.',
        
        'philosophy': 'Aggressive hybrid investing offers a middle path between pure equity and conservative strategies. This basket leverages the best hybrid funds to capture equity upside while maintaining downside protection through dynamic asset allocation.',
        
        'suitableFor': 'Investors with 3-5 year horizon seeking balanced growth with moderate risk',
        'rebalancingFrequency': 'Quarterly'
    }
    
    return jsonify(basket_data)

def generate_excel_based_graph_data(excel_df, basket_column, years=5):
    """Generate graph data from Excel NAV data"""
    # Filter data for the requested time period
    end_date = excel_df['DATE'].max()
    start_date = end_date - pd.DateOffset(years=years)
    period_df = excel_df[excel_df['DATE'] >= start_date].copy()
    
    # Resample to monthly
    period_df['year_month'] = period_df['DATE'].dt.to_period('M')
    monthly_df = period_df.groupby('year_month').agg({
        basket_column: 'last',
        'NIFTY 50': 'last'
    }).reset_index()
    
    monthly_df['year_month'] = monthly_df['year_month'].astype(str)
    
    # Normalize to base 100
    base_basket = monthly_df[basket_column].iloc[0]
    base_nifty = monthly_df['NIFTY 50'].iloc[0]
    
    basket_navs = ((monthly_df[basket_column] / base_basket) * 100).round(2).tolist()
    nifty_navs = ((monthly_df['NIFTY 50'] / base_nifty) * 100).round(2).tolist()
    
    return {
        'labels': monthly_df['year_month'].tolist(),
        'basketData': basket_navs,
        'niftyData': nifty_navs
    }

# White Basket Configuration
WHITE_BASKET_FUNDS = [
    {'id': 'wb1', 'name': 'Kotak Equity Savings Fund(G)', 'allocation': 33.33},
    {'id': 'wb2', 'name': 'HDFC Equity Savings Fund(G)', 'allocation': 33.33},
    {'id': 'wb3', 'name': 'ICICI Pru Equity Savings Fund-Reg(G)', 'allocation': 33.34}
]

# Every Common India Basket Configuration
EVERY_COMMON_INDIA_FUNDS = [
    {'id': 'eci1', 'name': 'Nippon India ETF Nifty 50 BeES', 'allocation': 20.0},
    {'id': 'eci2', 'name': 'Aditya Birla SL Flexi Cap Fund-Reg(G)', 'allocation': 20.0},
    {'id': 'eci3', 'name': 'ICICI Pru Large Cap Fund(G)', 'allocation': 20.0},
    {'id': 'eci4', 'name': 'Nippon India Growth Mid Cap Fund(G)', 'allocation': 20.0},
    {'id': 'eci5', 'name': 'Nippon India Small Cap Fund(G)', 'allocation': 20.0}
]

# Great India Basket Configuration
GREAT_INDIA_FUNDS = [
    {'id': 'gi1', 'name': 'Nippon India Small Cap Fund(G)', 'allocation': 25.0},
    {'id': 'gi2', 'name': 'Nippon India Growth Mid Cap Fund(G)', 'allocation': 25.0},
    {'id': 'gi3', 'name': 'Aditya Birla SL Flexi Cap Fund-Reg(G)', 'allocation': 25.0},
    {'id': 'gi4', 'name': 'ICICI Pru Multi-Asset Fund(G)', 'allocation': 25.0}
]

# Raising India Basket Configuration
RAISING_INDIA_FUNDS = [
    {'id': 'ri1', 'name': 'HDFC Defence Fund-Reg(G)', 'allocation': 33.33},
    {'id': 'ri2', 'name': 'Nippon India Power & Infra Fund(B)', 'allocation': 33.33},
    {'id': 'ri3', 'name': 'ICICI Pru Housing Opp Fund-Reg(G)', 'allocation': 33.34}
]

def generate_great_india_data(years=5):
    """Generate both absolute and rolling returns data for Great India Basket"""
    # Filter data for the requested time period
    end_date = great_india_df['DATE'].max()
    start_date = end_date - pd.DateOffset(years=years)
    
    # Filter the dataframe
    filtered_df = great_india_df[great_india_df['DATE'] >= start_date].copy()
    
    # Resample to monthly for better visualization
    filtered_df['year_month'] = filtered_df['DATE'].dt.to_period('M')
    monthly_df = filtered_df.groupby('year_month').last().reset_index()
    monthly_df['year_month'] = monthly_df['year_month'].astype(str)
    
    # Prepare absolute returns data
    absolute_data = {
        'labels': monthly_df['year_month'].tolist(),
        'basketData': monthly_df['Basket_NAV'].round(2).tolist(),
        'niftyData': monthly_df['NIFTY_50'].round(2).tolist()
    }
    
    # Prepare rolling returns data based on years
    if years == 3:
        rolling_col_basket = '1Y_Basket_Rolling'
        rolling_col_nifty = '1Y_Nifty_Rolling'
    elif years == 5:
        rolling_col_basket = '3Y_Basket_Rolling'
        rolling_col_nifty = '3Y_Nifty_Rolling'
    else:  # 10 years
        rolling_col_basket = '5Y_Basket_Rolling'
        rolling_col_nifty = '5Y_Nifty_Rolling'
    
    rolling_data = {
        'labels': monthly_df['year_month'].tolist(),
        'basketData': (monthly_df[rolling_col_basket] * 100).round(2).tolist(),  # Convert to percentage
        'niftyData': (monthly_df[rolling_col_nifty] * 100).round(2).tolist()  # Convert to percentage
    }
    
    # Calculate metrics
    latest_nav = filtered_df['Basket_NAV'].iloc[-1]
    start_nav = filtered_df['Basket_NAV'].iloc[0]
    total_return = ((latest_nav - start_nav) / start_nav) * 100
    cagr = ((latest_nav / start_nav) ** (1/years) - 1) * 100
    
    return {
        'absolute': absolute_data,
        'rolling': rolling_data,
        'metrics': {
            'totalReturn': round(total_return, 2),
            'cagr': round(cagr, 2)
        }
    }

@app.route('/api/baskets/white-basket', methods=['GET'])
def get_white_basket():
    """Get White Basket (Equity Savings) data"""
    years = request.args.get('years', default=5, type=int)
    
    # Generate simple graph data (White Basket doesn't have rolling returns in original implementation)
    graph_data = generate_excel_based_graph_data(
        white_basket_df, 
        'Basket_NAV', 
        years=years
    )
    period_returns = calculate_returns_from_nav(graph_data['basketData'])
    
    # Calculate metrics from actual NAV data
    latest_nav = white_basket_df['Basket_NAV'].iloc[-1]
    year_ago_nav = white_basket_df['Basket_NAV'].iloc[-252] if len(white_basket_df) > 252 else white_basket_df['Basket_NAV'].iloc[0]
    cagr_1y = ((latest_nav / year_ago_nav) - 1) * 100
    
    basket_data = {
        'id': 'b11',
        'name': 'White Basket',
        'color': '#F3F4F6',
        'description': 'Conservative equity savings portfolio for capital preservation with modest equity exposure',
        'ageRange': 'All ages',
        'riskLevel': 'Low',
        'minInvestment': 5000,
        'timeHorizon': '1-3 years',
        'goals': ['Emergency Fund', 'Short-term Goals', 'Capital Protection'],
        'experienceLevel': 'Beginner to Intermediate',
        
        'metrics': {
            'cagr1Y': round(cagr_1y, 2),
            'cagr3Y': round(period_returns.get('3Y', 0), 2),
            'cagr5Y': round(period_returns.get('5Y', 0), 2),
            'risk': 5.5,
            'sharpeRatio': 0.8,
            'expenseRatio': 1.2
        },
        'periodReturns': period_returns,
        'graphData': graph_data,
        'funds': WHITE_BASKET_FUNDS,
        
        'rationale': 'White Basket is designed for ultra-conservative investors seeking better-than-FD returns with minimal risk. Comprising three top equity savings funds from Kotak, HDFC, and ICICI, this basket maintains 20-30% equity exposure while the rest is in debt and arbitrage. Perfect for parking funds, emergency corpus, or near-term goals where capital safety is paramount.',
        
        'philosophy': 'Safety first, growth second. We believe equity savings funds offer the perfect balance for conservative investors—protecting capital through debt and arbitrage while allowing modest equity participation for inflation-beating returns. The white color symbolizes purity and safety, reflecting our commitment to capital preservation.',
        
        'suitableFor': 'Ultra-conservative investors, emergency fund parking, near-term goal planning',
        'rebalancingFrequency': 'Annually'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/every-common-india', methods=['GET'])
def get_every_common_india():
    """Get Every Common India Basket data with absolute and rolling returns"""
    years = request.args.get('years', default=5, type=int)
    
    # Generate graph data with both absolute and rolling returns
    graph_data = generate_every_common_india_graph_data(years)
    
    # Calculate period returns from absolute returns data
    period_returns = calculate_returns_from_nav(graph_data['absoluteReturns']['basketData'])
    
    # Calculate metrics from actual NAV data
    latest_nav = every_common_df['Basket NAV Every Common India'].iloc[-1]
    year_ago_nav = every_common_df['Basket NAV Every Common India'].iloc[-252] if len(every_common_df) > 252 else every_common_df['Basket NAV Every Common India'].iloc[0]
    cagr_1y = ((latest_nav / year_ago_nav) - 1) * 100
    
    basket_data = {
        'id': 'b12',
        'name': 'Every Common India Basket',
        'color': '#FF9933',
        'description': 'Diversified all-cap portfolio representing the breadth of Indian equity market',
        'ageRange': '25-60 years',
        'riskLevel': 'Medium to High',
        'minInvestment': 10000,
        'timeHorizon': '5+ years',
        'goals': ['Wealth Creation', 'Retirement', 'Long-term Goals', 'Child Education'],
        'experienceLevel': 'Intermediate to Expert',
        
        'metrics': {
            'cagr1Y': round(cagr_1y, 2),
            'cagr3Y': round(period_returns.get('3Y', 0), 2),
            'cagr5Y': round(period_returns.get('5Y', 0), 2),
            'risk': 15.5,
            'sharpeRatio': 0.65,
            'expenseRatio': 0.85
        },
        'periodReturns': period_returns,
        'graphData': graph_data,
        'funds': EVERY_COMMON_INDIA_FUNDS,
        
        'rationale': 'Every Common India represents the true spirit of Indian growth story—from the stability of Nifty 50 to the dynamism of small caps. This basket captures opportunities across market capitalizations: large caps for stability (Nippon Nifty 50 ETF, ICICI Large Cap), flexi cap for tactical allocation (Aditya Birla), mid caps for emerging champions (Nippon Mid Cap), and small caps for explosive growth (Nippon Small Cap). It\'s India\'s complete equity exposure in one basket.',
        
        'philosophy': 'We believe India\'s growth story spans across all market segments—from established blue chips to emerging disruptors. Our philosophy is democratic equity allocation: equal weightage to large, mid, and small caps ensures you participate in every phase of corporate growth. The saffron color reflects our commitment to India\'s vibrant and diverse economy.',
        
        'suitableFor': 'Growth-focused investors with 5+ year horizon seeking comprehensive India exposure',
        'rebalancingFrequency': 'Annually'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/raising-india', methods=['GET'])
def get_raising_india():
    """Get Raising India Basket data with absolute and rolling returns"""
    years = request.args.get('years', default=5, type=int)
    
    # Generate graph data with both absolute and rolling returns
    graph_data = generate_raising_india_graph_data(years=years)
    
    # Calculate metrics from actual raw data (not filtered monthly data)
    df = raising_india_df.copy()
    latest_nav = df['Weightage NAV'].iloc[-1]
    
    # Calculate CAGR from available data
    if len(df) >= 252:  # ~1 year of trading days
        year_ago_nav = df['Weightage NAV'].iloc[-252]
        cagr1Y = round(((latest_nav / year_ago_nav) - 1) * 100, 2)
    else:
        cagr1Y = 0
    
    if len(df) >= 756:  # ~3 years of trading days
        three_years_ago_nav = df['Weightage NAV'].iloc[-756]
        cagr3Y = round(((latest_nav / three_years_ago_nav) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(df) >= 1260:  # ~5 years of trading days
        five_years_ago_nav = df['Weightage NAV'].iloc[-1260]
        cagr5Y = round(((latest_nav / five_years_ago_nav) ** (1/5) - 1) * 100, 2)
    else:
        # Calculate CAGR for available period
        first_nav = df['Weightage NAV'].iloc[0]
        days_diff = (df['DATE'].iloc[-1] - df['DATE'].iloc[0]).days
        years_diff = days_diff / 365.25
        if years_diff > 0 and first_nav > 0:
            cagr5Y = round(((latest_nav / first_nav) ** (1/years_diff) - 1) * 100, 2)
        else:
            cagr5Y = 0
    
    basket_data = {
        'id': 'b13',
        'name': 'Raising India Basket',
        'color': '#8B5CF6',
        'description': 'Infrastructure-focused thematic portfolio riding India\'s capex cycle and nation-building initiatives',
        'ageRange': '25-50 years',
        'riskLevel': 'High',
        'minInvestment': 15000,
        'timeHorizon': '7+ years',
        'goals': ['Aggressive Growth', 'Thematic Investment', 'Nation Building'],
        'experienceLevel': 'Intermediate to Expert',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 18.5,
            'sharpeRatio': 0.45,
            'expenseRatio': 2.1
        },
        
        'graphData': graph_data,
        'funds': RAISING_INDIA_FUNDS,
        
        'rationale': 'Raising India captures the government\'s trillion-dollar infrastructure push. With defense modernization (HDFC Defence), power & infrastructure capex (Nippon Power & Infra), and housing boom (ICICI Housing Opportunities), this basket is positioned at the heart of India\'s nation-building initiatives. These thematic funds benefit from multi-year structural tailwinds—defense indigenization, renewable energy transition, and affordable housing mission.',
        
        'philosophy': 'Infrastructure isn\'t just about roads and buildings—it\'s about building the foundation for India\'s superpower dreams. We believe the 2020s decade belongs to infrastructure, defense, and housing sectors. Our philosophy: invest in nation-building themes with long runways, backed by government policy support and massive capital allocation. The rising purple symbolizes ambition, transformation, and India\'s ascent.',
        
        'suitableFor': 'Aggressive investors with conviction in India\'s infrastructure story and 7+ year patience',
        'rebalancingFrequency': 'Half-yearly'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/conservative', methods=['GET'])
def get_conservative_basket():
    """Get Conservative Basket data with absolute and rolling returns"""
    years = request.args.get('years', default=5, type=int)
    
    graph_data = generate_conservative_basket_graph_data(years)
    
    # Calculate metrics
    df = conservative_basket_df.copy()
    latest_nav = df['Basket_NAV'].iloc[-1]
    
    # Calculate CAGRs
    if len(df) >= 252:
        year_ago_nav = df['Basket_NAV'].iloc[-252]
        cagr1Y = round(((latest_nav / year_ago_nav) - 1) * 100, 2)
    else:
        cagr1Y = 0
    
    if len(df) >= 756:
        three_years_ago_nav = df['Basket_NAV'].iloc[-756]
        cagr3Y = round(((latest_nav / three_years_ago_nav) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(df) >= 1260:
        five_years_ago_nav = df['Basket_NAV'].iloc[-1260]
        cagr5Y = round(((latest_nav / five_years_ago_nav) ** (1/5) - 1) * 100, 2)
    else:
        cagr5Y = 0
    
    basket_data = {
        'id': 'b10',
        'name': 'Conservative Balanced Basket',
        'color': '#FCD34D',
        'description': 'Balanced approach for conservative investors seeking steady growth with moderate risk',
        'ageRange': '30-60 years',
        'riskLevel': 'Medium',
        'minInvestment': 5000,
        'timeHorizon': '3-5 years',
        'goals': ['Balanced Growth', 'Capital Preservation', 'Retirement Planning'],
        'experienceLevel': 'Beginner to Intermediate',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 10.5,
            'sharpeRatio': 0.85,
            'expenseRatio': 1.5
        },
        
        'graphData': graph_data,
        'funds': CONSERVATIVE_BALANCED_FUNDS,
        
        'rationale': 'Conservative Balanced Basket offers stability without completely sacrificing growth potential. Through balanced advantage funds, it dynamically allocates between equity and debt based on market conditions, providing downside protection while participating in market upswings.',
        
        'philosophy': 'Balance is the key to long-term investing success. We believe in adapting to market conditions rather than timing them. Our philosophy: let expert fund managers handle tactical asset allocation while you stay invested for your goals.',
        
        'suitableFor': 'Conservative investors, first-time investors, pre-retirees seeking balanced growth',
        'rebalancingFrequency': 'Annually'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/dusshera', methods=['GET'])
def get_dusshera_basket():
    """Get Dusshera Basket data with absolute and rolling returns"""
    years = request.args.get('years', default=5, type=int)
    
    graph_data = generate_dusshera_basket_graph_data(years)
    
    # Calculate metrics
    df = dusshera_basket_df.copy()
    latest_nav = df['Basket_NAV'].iloc[-1]
    
    # Calculate CAGRs
    if len(df) >= 252:
        year_ago_nav = df['Basket_NAV'].iloc[-252]
        cagr1Y = round(((latest_nav / year_ago_nav) - 1) * 100, 2)
    else:
        cagr1Y = 0
    
    if len(df) >= 756:
        three_years_ago_nav = df['Basket_NAV'].iloc[-756]
        cagr3Y = round(((latest_nav / three_years_ago_nav) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(df) >= 1260:
        five_years_ago_nav = df['Basket_NAV'].iloc[-1260]
        cagr5Y = round(((latest_nav / five_years_ago_nav) ** (1/5) - 1) * 100, 2)
    else:
        cagr5Y = 0
    
    basket_data = {
        'id': 'b15',
        'name': 'Dusshera Basket',
        'color': '#F59E0B',
        'description': 'Festival special portfolio celebrating the victory of good over evil with aggressive growth potential',
        'ageRange': '25-45 years',
        'riskLevel': 'High',
        'minInvestment': 10000,
        'timeHorizon': '5-7 years',
        'goals': ['Wealth Creation', 'Aggressive Growth', 'Long-term Goals'],
        'experienceLevel': 'Intermediate to Expert',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 16.5,
            'sharpeRatio': 0.65,
            'expenseRatio': 1.8
        },
        
        'graphData': graph_data,
        'funds': [],  # Add fund allocation details as needed
        
        'rationale': 'Dusshera Basket embodies the spirit of victory and prosperity. Launched during the auspicious festive season, this basket combines growth-oriented funds to help investors achieve their financial goals with conviction and discipline.',
        
        'philosophy': 'Just as Dusshera marks the triumph of good over evil, smart investing triumphs over market volatility through discipline and patience. We believe in harnessing festive enthusiasm with prudent portfolio construction.',
        
        'suitableFor': 'Growth-oriented investors seeking high returns with appetite for volatility',
        'rebalancingFrequency': 'Half-yearly'
    }
    
    return jsonify(basket_data)

@app.route('/api/baskets/yellow', methods=['GET'])
def get_yellow_basket():
    """Get Yellow Basket data with absolute and rolling returns"""
    years = request.args.get('years', default=5, type=int)
    
    graph_data = generate_yellow_basket_graph_data(years)
    
    # Calculate metrics
    df = yellow_basket_df.copy()
    latest_nav = df['Basket_NAV'].iloc[-1]
    
    # Calculate CAGRs
    if len(df) >= 252:
        year_ago_nav = df['Basket_NAV'].iloc[-252]
        cagr1Y = round(((latest_nav / year_ago_nav) - 1) * 100, 2)
    else:
        cagr1Y = 0
    
    if len(df) >= 756:
        three_years_ago_nav = df['Basket_NAV'].iloc[-756]
        cagr3Y = round(((latest_nav / three_years_ago_nav) ** (1/3) - 1) * 100, 2)
    else:
        cagr3Y = 0
    
    if len(df) >= 1260:
        five_years_ago_nav = df['Basket_NAV'].iloc[-1260]
        cagr5Y = round(((latest_nav / five_years_ago_nav) ** (1/5) - 1) * 100, 2)
    else:
        cagr5Y = 0
    
    basket_data = {
        'id': 'b4',
        'name': 'Yellow Basket',
        'color': '#FDE047',
        'description': 'Balanced fund portfolio for short to medium-term goals with optimism and stability',
        'ageRange': '25-55 years',
        'riskLevel': 'Medium',
        'minInvestment': 5000,
        'timeHorizon': '1-3 years',
        'goals': ['Short-term Goals', 'Balanced Growth', 'Emergency Fund'],
        'experienceLevel': 'Beginner to Intermediate',
        
        'metrics': {
            'cagr1Y': cagr1Y,
            'cagr3Y': cagr3Y,
            'cagr5Y': cagr5Y,
            'risk': 9.5,
            'sharpeRatio': 0.92,
            'expenseRatio': 1.4
        },
        
        'graphData': graph_data,
        'funds': [],  # Add fund allocation details as needed
        
        'rationale': 'Yellow Basket shines with optimism and balance. Perfect for investors seeking steady returns without extreme volatility, this basket provides a sunshine path to short and medium-term financial goals.',
        
        'philosophy': 'Yellow represents energy, optimism, and clarity. We believe balanced funds offer the perfect middle path—enough equity for growth, enough debt for stability. Smart investing doesn\'t always need extremes.',
        
        'suitableFor': 'Risk-averse investors, goal-based planning, near-term financial objectives',
        'rebalancingFrequency': 'Annually'
    }
    
    return jsonify(basket_data)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Alphanifty Backend API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
