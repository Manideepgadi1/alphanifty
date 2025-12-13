import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Load the Great India Basket Excel file
GREAT_INDIA_FILE = 'The Great India basket.xlsx'
great_india_df = pd.read_excel(GREAT_INDIA_FILE, skiprows=1)

# Rename columns for consistency
great_india_df.columns = [
    'DATE', 'Basket_NAV', 'NIFTY_50', 'col3',  # Absolute returns columns
    '1Y_Date', '1Y_Basket_Rolling', '1Y_Nifty_Rolling', 'col7',  # 1 Year rolling
    '3Y_Date', '3Y_Basket_Rolling', '3Y_Nifty_Rolling', 'col11',  # 3 Year rolling
    '5Y_Date', '5Y_Basket_Rolling', '5Y_Nifty_Rolling'  # 5 Year rolling
]
great_india_df['DATE'] = pd.to_datetime(great_india_df['DATE'], errors='coerce')
great_india_df = great_india_df.sort_values('DATE')

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
    labels = df_monthly['DATE'].dt.strftime('%b %Y').tolist()
    
    # Get basket NAV and Nifty 50 values and normalize to 100 at start of filtered period
    basket_navs_raw = df_monthly.iloc[:, 1].ffill()  # Column 1: Basket NAV
    nifty_navs_raw = df_monthly.iloc[:, 2].ffill()   # Column 2: NIFTY 50
    
    # Normalize to 100 at the start of the filtered period
    basket_base = basket_navs_raw.iloc[0]
    nifty_base = nifty_navs_raw.iloc[0]
    basket_navs = ((basket_navs_raw / basket_base) * 100).tolist()
    nifty_navs = ((nifty_navs_raw / nifty_base) * 100).tolist()
    
    # Prepare rolling returns data based on years
    rolling_labels = []
    rolling_basket = []
    rolling_nifty = []
    
    if years == 3:
        # Use columns 8-10 for 3 year rolling returns
        rolling_df = df[df.iloc[:, 8].notna()].copy()
        rolling_df['ROLLING_DATE'] = pd.to_datetime(rolling_df.iloc[:, 8], errors='coerce')
        rolling_df = rolling_df.sort_values('ROLLING_DATE')
        rolling_labels = rolling_df['ROLLING_DATE'].dt.strftime('%b %Y').tolist()
        rolling_basket = rolling_df.iloc[:, 9].tolist()  # Rolling Returns Basket
        rolling_nifty = rolling_df.iloc[:, 10].tolist()  # Rolling Returns NIFTY
    
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

# Test the function
graph_data = generate_great_india_graph_data(years=3)
print("Absolute Returns Labels (first 5):", graph_data['absoluteReturns']['labels'][:5])
print("Absolute Returns Basket Data (first 5):", graph_data['absoluteReturns']['basketData'][:5])
print("Absolute Returns Nifty Data (first 5):", graph_data['absoluteReturns']['niftyData'][:5])
print("\nAbsolute Returns Labels count:", len(graph_data['absoluteReturns']['labels']))
print("Absolute Returns Basket Data count:", len(graph_data['absoluteReturns']['basketData']))
print("Absolute Returns Nifty Data count:", len(graph_data['absoluteReturns']['niftyData']))

print("\n=== Rolling Returns ===")
print("Rolling Returns Labels count:", len(graph_data['rollingReturns']['labels']))
print("Rolling Returns Basket Data (first 5):", graph_data['rollingReturns']['basketData'][:5] if len(graph_data['rollingReturns']['basketData']) > 0 else "Empty")
print("Rolling Returns Nifty Data (first 5):", graph_data['rollingReturns']['niftyData'][:5] if len(graph_data['rollingReturns']['niftyData']) > 0 else "Empty")
