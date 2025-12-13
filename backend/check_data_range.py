import pandas as pd

# Check Aggressive Hybrid
print("=== AGGRESSIVE HYBRID BASKET ===")
df = pd.read_excel('hybrid-aggressive.xlsx')
df.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
df['DATE'] = pd.to_datetime(df['DATE'])
print(f"Date Range: {df['DATE'].min()} to {df['DATE'].max()}")
print(f"Total Records: {len(df)}")
print(f"\nLast 5 records:")
print(df.tail())

print("\n\n=== GREAT INDIA BASKET ===")
df2 = pd.read_excel('Greate India Basket.xlsx')
df2.columns = ['DATE', 'Basket_NAV', 'NIFTY_50']
df2['DATE'] = pd.to_datetime(df2['DATE'])
print(f"Date Range: {df2['DATE'].min()} to {df2['DATE'].max()}")
print(f"Total Records: {len(df2)}")
print(f"\nLast 5 records:")
print(df2.tail())

print("\n\n=== EVERY COMMON INDIA ===")
df3 = pd.read_excel('every_common_india.xlsx')
df3['DATE'] = pd.to_datetime(df3['DATE'])
print(f"Date Range: {df3['DATE'].min()} to {df3['DATE'].max()}")
print(f"Total Records: {len(df3)}")
print(f"\nLast 5 records:")
print(df3.tail())
