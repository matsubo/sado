import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import Papa from 'papaparse';
import dayjs from 'dayjs';

const CSVViewer = () => {
  const [selectedType, setSelectedType] = useState('1');
  const [data, setData] = useState([]);
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
  };

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  useEffect(() => {
    localStorage.setItem('csvViewerSearchTerm', searchTerm);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (searchTerm.trim() === '') return true;
      const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term !== '');
      return searchTerms.some(term =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(term)
        )
      );
    });
  }, [data, searchTerm]);

  const customSortTypes = {
    alphanumeric: (rowA, rowB, columnId, desc) => {
      const a = rowA.values[columnId];
      const b = rowB.values[columnId];

      // 空の値をソートの最後に
      if (a === '' && b === '') return 0;
      if (a === '') return 1;
      if (b === '') return -1;

      // 通常のソート
      let a_time = dayjs('2024-09-01 ' + a).unix();
      let b_time = dayjs('2024-09-01 ' + b).unix();
      if (a_time < b_time) return desc ? 1 : -1;
      if (a_time > b_time) return desc ? -1 : 1;
      return 0;
    },
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map(key => ({
      Header: key,
      accessor: key,
      sortType: 'alphanumeric',
      Cell: ({ value, cell }) => {
        const rowIndex = cell.row.index;
        const cellIndex = cell.column.index;

        if (value === '女') {
          return <span className="text-secondary">{value}</span>;
        }

        if ((selectedType === '1' || selectedType === '2') && cellIndex > 22) {
          return value;
        }
        if ((selectedType === '3' || selectedType === '4') && cellIndex > 15) {
          return value;
        }

        if ((selectedType === '1' || selectedType === '3') && cellIndex < 6) {
          return value;
        }
        if ((selectedType === '2' || selectedType === '4') && cellIndex < 4) {
          return value;
        }

        if (cellIndex > 0) {
          const row = Object.values(filteredData[rowIndex]);
          const previousTime = dayjs('2024-09-01 ' + row[cellIndex - 1]);
          const currentTime = dayjs('2024-09-01 ' + value);
          const difference = currentTime - previousTime;
          const formattedDifference = formatTimeDifference(difference);
          
          return (
            <span>
              {value}
              <br />
              <span className="text-secondary">
                {formattedDifference} (lap)
              </span>
            </span>
          );
        }

        return value;
      },
    }));
  }, [data, selectedType]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredData,
      sortTypes: customSortTypes,
    },
    useSortBy
  );

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

  const formatTimeDifference = (difference) => {
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
        <table {...getTableProps()} className="table min-w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-left">
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`hover ${rowIndex % 2 === 0 ? 'bg-base-200' : ''}`}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()} className="whitespace-nowrap">
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVViewer;