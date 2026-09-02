import pandas as pd
df = pd.read_excel("data/2026-a.xls", header=None, nrows=15)
for i in range(len(df.columns)):
    print(f"Col {i}: R4={df.iloc[4, i]} R6={df.iloc[6, i]} R9={df.iloc[9, i]}")
