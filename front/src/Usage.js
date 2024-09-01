import React from 'react';

function Usage() {
    return (
        <div className="p-4 mt-2">
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 text-sm" role="alert">
                <p className="font-bold">使い方など</p>
                <ul className="list-disc p-4">
                    <li>元データ: <a href="https://systemway.jp/24sado" className="text-blue-500">https://systemway.jp/24sado</a></li>
                    <li>タイプAのみ</li>
                    <li>データの更新は1分おき。<a href="https://gist.github.com/matsubo/b81e4b71f3ea280278ef532ec6a1c781" className="text-blue-500">CSVデータ</a></li>
                    <li>入力した値はローカルストレージに保存されるのでブラウザをリロードしても消えません。</li>
                    <li><a href="https://github.com/matsubo/sado" className="text-blue-500">ソースコード</a></li>
                    <li><a href="https://buymeacoffee.com/matsubokkuri" className="text-blue-500">Buy me a coffee!</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Usage;