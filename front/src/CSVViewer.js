import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import dayjs from 'dayjs';

const CSVViewer = () => {
  const [selectedType, setSelectedType] = useState('1');
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('csvViewerSearchTerm') || '';
  });
  const [flashMessage, setFlashMessage] = useState('');

  const fetchData = async (type) => {
    const timestamp = Math.floor((new Date().getTime()/(1000*60)));
    const response = await fetch(`https://gist.githubusercontent.com/matsubo/b81e4b71f3ea280278ef532ec6a1c781/raw/sado_${type}.csv?timestamp=${timestamp}`);
    const text = await response.text();
    const results = Papa.parse(text, { header: true, encoding: "UTF-8" });
    setData(results.data);
    setHeaders(results.meta.fields); // ヘッダーを更新
  };

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

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

  const handleCellClick = (rowIndex, cellIndex) => {

    if (cellIndex < 5) {
      document.querySelector('tbody tr:nth-child(' + (rowIndex + 1) + ')').classList.toggle('border-primary');
    }

    if (selectedType == '1' || selectedType == '2') {
      if (22 < cellIndex) { return }
    } else if (selectedType == '3' || selectedType == '4') {
      if (15 < cellIndex) { return }
    }

    if (toggleColumn === cellIndex) {
      setToggleColumn(null);
    } else {
      setToggleColumn(cellIndex);
    }


  };

  const handleButtonClick = async () => {
    fetchData(selectedType).then(() => {
      setFlashMessage('再読込しました');
      setTimeout(() => setFlashMessage(''), 2000);
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    fetchData(newType);
  };

  const renderButton = (type, label) => {
    return (
      <button
        className={`btn btn-sm mx-2 ${selectedType === type ? 'btn-accent' : ''}`}
        name="type"
        value={type}
        onClick={handleTypeChange}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {renderButton('1', 'Type A')}
        {renderButton('2', 'Type RA')}
        {renderButton('3', 'Type B')}
        {renderButton('4', 'Type RB')}
      </div>
      <div className="flex justify-between my-4">
        <input
          type="text"
          placeholder="検索... (スペース区切りでOR検索)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={handleButtonClick}
          className="ml-2 btn btn-secondary"
        >
          再読み込み
        </button>
      </div>
      {flashMessage && (
        <div role="alert" className="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{flashMessage}</span>
      </div>
      )}
      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr className="">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left"
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
                className={`hover ${rowIndex % 2 === 0 ? 'bg-base-200' : ''}`}
              >
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`whitespace-nowrap ${
                      row[header] === '女' ? 'text-secondary' : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                  >
                    {toggleColumn === cellIndex && cellIndex > 0 ? (
                      <span className='text-secondary'>
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