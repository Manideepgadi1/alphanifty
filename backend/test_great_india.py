import pandas as pd

# Load the Great India Basket Excel file
df = pd.read_excel('The Great India basket.xlsx', skiprows=1)
print("Columns:", df.columns.tolist())
print("\nFirst 5 rows:")
print(df.head())
print("\nLast 5 rows:")
print(df.tail())
print("\nShape:", df.shape)
print("\nColumn data types:")
print(df.dtypes)

# Check if there's data in the key columns
print("\n=== Checking Date Column ===")
print(df.iloc[:, 0].head())

print("\n=== Checking Basket NAV Column (col 1) ===")
print(df.iloc[:, 1].head())

print("\n=== Checking NIFTY 50 Column (col 2) ===")
print(df.iloc[:, 2].head())

# Check for nulls
print("\n=== Null values in first 3 columns ===")
print(df.iloc[:, :3].isnull().sum())
