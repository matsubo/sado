import requests
from bs4 import BeautifulSoup
import pandas as pd

def get_table_data(url):
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='all')
    
    if table:
        df = pd.read_html(str(table))[0]
        return df
    return None

def get_all_pages_data(base_url):
    all_data = []
    page = 1

    
    while page <= 5:
        print(page)
        url = f"{base_url}?di=1&p={page}"
        df = get_table_data(url)
        
        if df is None or df.empty:
            break
        
        all_data.append(df)
        page += 1
    
    return pd.concat(all_data, ignore_index=True)

# メインの処理
base_url = "https://systemway.jp/24sado"
combined_data = get_all_pages_data(base_url)


# CSVファイルとして保存（オプション）
combined_data.to_csv("combined_table_data.csv", index=False, encoding='utf-8-sig')

