import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CSVViewer = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    // LocalStorage から初期値を読み込む
    return localStorage.getItem('csvViewerSearchTerm') || '';
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://gist.githubusercontent.com/matsubo/b81e4b71f3ea280278ef532ec6a1c781/raw/8da54dd71981e99be022f47bd33bd2b6cdb37ec5/sado.csv');
      const text = await response.text();
      const results = Papa.parse(text, { header: true, encoding: "UTF-8" });
      setData(results.data);
      setHeaders(results.meta.fields);
    };
    fetchData();
  }, []);

  // searchTerm が変更されたときに LocalStorage に保存
  useEffect(() => {
    localStorage.setItem('csvViewerSearchTerm', searchTerm);
  }, [searchTerm]);

  const filteredData = data.filter(row => {
    if (searchTerm.trim() === '') return true;
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term !== '');
    return searchTerms.some(term =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="検索... (スペース区切りでOR検索)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="border px-4 py-2">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVViewer;