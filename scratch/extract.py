import pandas as pd
import glob

files = sorted(glob.glob("data/2026-*.xls"))
all_data = None

for file in files:
    print(f"Processing {file}...")
    df = pd.read_excel(file, header=None)
    
    col_code = None
    col_name = None
    header_row_idx = 4
    
    for r in range(0, 10):
        row_vals = df.iloc[r].astype(str)
        if row_vals.str.contains('ｺｰﾄﾞ|コード').any():
            for c in range(len(row_vals)):
                val = str(row_vals.iloc[c])
                if 'ｺｰﾄﾞ' in val or 'コード' in val:
                    col_code = c
                    header_row_idx = r
                    break
        if row_vals.str.contains('市区町村|都道府県').any():
            for c in range(len(row_vals)):
                val = str(row_vals.iloc[c])
                if '市区町村' in val or '都道府県' in val:
                    col_name = c
                    break
    
    if col_code is None or col_name is None:
        print(f"Warning: Could not find code or name column in {file}. Skipping.")
        continue

    headers = df.iloc[header_row_idx].values
    
    codes = df[col_code].astype(str).str.replace(r'\.0$', '', regex=True).str.zfill(5)
    mask = codes.str.startswith('02') | (codes.str.endswith('000') == False)  # we will just filter by name "青森県" later
    # Actually just match anything for Aomori
    # codes start with 02 or is 2
    mask = codes.str.startswith('02') | (codes == '00002') | (codes == '2')
    
    aomori_df = df[mask].copy()
    if len(aomori_df) == 0:
        continue
        
    aomori_df['Code'] = codes[mask]
    aomori_df['Name'] = aomori_df[col_name].astype(str).str.replace('\u3000', '').str.strip()
    
    # Drop 青森県 completely to avoid user confusion
    aomori_df = aomori_df[aomori_df['Name'] != '青森県']
    
    indicator_cols = []
    indicator_names = []
    
    for i in range(len(headers)):
        if i != col_code and i != col_name and i > col_name:
            if pd.notna(headers[i]) and str(headers[i]).strip() != "":
                val = str(headers[i]).strip()
                # Remove newlines to fix JS parsing
                val = val.replace('\n', '').replace('\r', '')
                if val != 'NaN' and not val.isascii() and val != 'nan':
                    indicator_cols.append(i)
                    indicator_names.append(val)
            
    cols_to_keep = ['Code', 'Name'] + indicator_cols
    aomori_df = aomori_df[cols_to_keep]
    
    rename_dict = {i: name for i, name in zip(indicator_cols, indicator_names)}
    aomori_df = aomori_df.rename(columns=rename_dict)
    
    if all_data is None:
        all_data = aomori_df
    else:
        all_data = pd.merge(all_data, aomori_df, on=['Code', 'Name'], how='outer', suffixes=('', '_dup'))
        dup_cols = [c for c in all_data.columns if c.endswith('_dup')]
        all_data = all_data.drop(columns=dup_cols)

print(f"Extracted {len(all_data)} municipalities.")
all_data.to_csv("data/sugata2026.csv", index=False, encoding="utf-8-sig")
print("Saved to data/sugata2026.csv")
