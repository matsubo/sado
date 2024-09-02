import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import dayjs from 'dayjs';


const CSVViewer = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('csvViewerSearchTerm') || '';
  });
  const [flashMessage, setFlashMessage] = useState('');

  const fetchData = async () => {
    const timestamp = Math.floor((new Date().getTime()/(1000*60)));
    const response = await fetch(`https://gist.githubusercontent.com/matsubo/b81e4b71f3ea280278ef532ec6a1c781/raw/sado.csv?timestamp=${timestamp}`);
    const text = await response.text();
    const results = Papa.parse(text, { header: true, encoding: "UTF-8" });
    setData(results.data);
    setHeaders(results.meta.fields);
    setFlashMessage('再読込しました');
    setTimeout(() => setFlashMessage(''), 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const [hoveredColumn, setHoveredColumn] = useState(null);

  const calculateTimeDifference = (row, cellIndex) => {
    row = Object.values(row);
    const previousTime = dayjs('2024-09-01 ' + row[cellIndex - 1]);
    const currentTime = dayjs('2024-09-01 ' + row[cellIndex]);
    const difference = currentTime - previousTime;
    return difference;
  };

  const formatTimeDifference = (difference) => {
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [clickedColumn, setClickedColumn] = useState(null);

  const [toggleColumn, setToggleColumn] = useState(null);

  const handleCellClick = (cellIndex) => {
    if (cellIndex < 6) { return }
    if (22 < cellIndex) { return }
    if (toggleColumn === cellIndex) {
      setToggleColumn(null);
    } else {
      setToggleColumn(cellIndex);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="検索... (スペース区切りでOR検索)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchData}
          className="ml-4 p-2 bg-blue-500 text-white rounded-sm"
        >
          再読み込み
        </button>
      </div>
      {flashMessage && (
        <div className="mb-4 p-2 bg-green-500 text-white rounded">
          {flashMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-2 py-2 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border px-2 py-2 whitespace-nowrap ${
                      row[header] === '女' ? 'bg-pink-200' : ''
                    }`}
                    onClick={() => handleCellClick(cellIndex)}
                  >
                    {toggleColumn === cellIndex && cellIndex > 0 ? (
                      <span className='bg-pink-100'>
                        {formatTimeDifference(calculateTimeDifference(row, cellIndex))} (lap)
                      </span>
                    ) : (
                      row[header]
                    )}
                  </td>
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
