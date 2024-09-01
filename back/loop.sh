#!/bin/bash

while true
do
    echo "$(date): スクレイピングを実行します..."
    python3 scrape.py
    
    if [ $? -eq 0 ]; then
        docker compose up --build -d
        
        if [ $? -eq 0 ]; then
            echo "Dockerコンテナの更新が完了しました。"
        else
            echo "Dockerコンテナの更新中にエラーが発生しました。"
        fi
    else
        echo "スクレイピング中にエラーが発生しました。"
    fi
    
    echo "60秒間待機します..."
    sleep 60
done
