import pandas as pd

# Read the Excel file
df = pd.read_excel('The Great India basket.xlsx')

print("Shape:", df.shape)
print("\nAll columns:")
for i, col in enumerate(df.columns):
    print(f"{i}: {col}")

print("\n\nFirst 3 rows:")
print(df.head(3))

print("\n\nColumn values from row 0:")
for i, col in enumerate(df.columns):
    print(f"{col}: {df.iloc[0, i]}")
