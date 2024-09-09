import requests
from bs4 import BeautifulSoup
import pandas as pd

number_of_pages = {
    1: 5,
    2: 1,
    3: 4,
    4: 1,
}

def get_table_data(url):
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_='all')

    if table:
        df = pd.read_html(str(table))[0]
        return df
    return None

def get_all_pages_data(base_url, di=1):
    all_data = []
    page = 1

    while page <= number_of_pages[di]:
        url = f"{base_url}?di={di}&p={page}"
        print(url)
        df = get_table_data(url)

        if df is None or df.empty:
            break

        all_data.append(df)
        page += 1

    return pd.concat(all_data, ignore_index=True)

# メインの処理
base_url = "https://systemway.jp/24sado"

for di in range(1, 5):
    combined_data = get_all_pages_data(base_url, di)
    combined_data.to_csv(f"combined_table_data_{di}.csv", index=False, encoding='utf-8-sig')

