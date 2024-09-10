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
  const [highlightedRows, setHighlightedRows] = useState(new Set());
  const [showTimeDifferences, setShowTimeDifferences] = useState(false);

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

      if (a === '' && b === '') return 0;
      if (a === '') return 1;
      if (b === '') return -1;

      let a_time = dayjs('2024-09-01 ' + a).unix();
      let b_time = dayjs('2024-09-01 ' + b).unix();
      if (a_time < b_time) return desc ? 1 : -1;
      if (a_time > b_time) return desc ? -1 : 1;
      return 0;
    },
  };

  const toggleHighlight = (rowIndex) => {
    setHighlightedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const calculateTimeDifference = (time1, time2) => {
    if (!time1 || !time2) return null;
    const date1 = dayjs('2024-09-01 ' + time1);
    const date2 = dayjs('2024-09-01 ' + time2);
    const diffInSeconds = date2.diff(date1, 'second');
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    return (
      <span className="text-primary">
        +{hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    );
  };

  const toggleAllTimeDifferences = () => {
    setShowTimeDifferences(prev => !prev);
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key, index) => ({
      Header: key,
      accessor: key,
      sortType: 'alphanumeric',
      Cell: ({ value, row, column }) => {
        if (index < 3) {
          return (
            <span
              className="cursor-pointer"
              onClick={() => toggleHighlight(row.index)}
            >
              {value}
            </span>
          );
        }
        if (index >= 6 && index <= 22) {
          return (
            <span
              className="cursor-pointer"
              onClick={toggleAllTimeDifferences}
            >
              {showTimeDifferences
                ? calculateTimeDifference(row.values[Object.keys(row.values)[index - 1]], value)
                : value}
            </span>
          );
        }
        if (value === '女') {
          return <span className="text-secondary">{value}</span>;
        }
        return value;
      },
    }));
  }, [data, selectedType, showTimeDifferences]);

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
          <span className="material-symbols-outlined">info</span>
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
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <span className="material-symbols-outlined text-sm text-primary">keyboard_arrow_down</span>
                        : <span className="material-symbols-outlined text-sm text-primary">keyboard_arrow_up</span>
                      : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`hover ${rowIndex % 2 === 0 ? 'bg-base-200' : ''} ${
                    highlightedRows.has(rowIndex) ? 'border-y-blue-300 border-y-2' : ''
                  }`}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="whitespace-nowrap">
                      {cell.render('Cell')}
                    </td>
                  ))}
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