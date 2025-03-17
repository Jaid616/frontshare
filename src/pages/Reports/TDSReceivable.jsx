import React from "react";

const SearchBar = () => (
    <div className="relative">
      <input
        type="text"
        className="w-60 p-2 border text-sm"
        placeholder="Search..."
      />
      <span className="absolute left-2 top-2.5 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </div>
  );
  
  const TableHeader = ({ headers }) => (
    <div className="flex border-t border-l">
      <div className="w-10 p-2 border-r border-b text-sm">#</div>
      {headers.map((header, index) => (
        <div key={index} className="flex-1 p-2 border-r border-b text-sm flex items-center justify-between">
          <span>{header}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ))}
    </div>
  );
  
  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4">
        <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="text-sm text-gray-600">No Data Available!</div>
      <div className="text-sm text-gray-500">Please try again after making relevant changes.</div>
    </div>
  );

  const TDSReceivable = () => {
    const headers = [
      'PARTY NA...',
      'TRANSAC...',
      'INVO...',
      'TOTAL AMO...',
      'TAXABLE...',
      'TDS RECEI...',
      'DATE O...',
      'TAX N...',
      'TAX SE...',
      'TD...'
    ];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow h-[88vh]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-sm border rounded px-3 py-1.5">
                This Month
              </button>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded">
              <span className="text-sm">From</span>
              <input type="text" value="01/01/2025" className="text-sm p-1 border rounded w-24" />
              <span className="text-sm">To</span>
              <input type="text" value="31/01/2025" className="text-sm p-1 border rounded w-24" />
            </div>
            <select className="border rounded px-3 py-1.5 text-sm">
              <option>ALL FIRMS</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center text-blue-600 text-sm">
              <img src="/excel-icon.png" className="w-5 h-5 mr-1" alt="Excel" />
              Excel Report
            </button>
            <button className="flex items-center text-blue-600 text-sm">
              <img src="/print-icon.png" className="w-5 h-5 mr-1" alt="Print" />
              Print
            </button>
          </div>
        </div>
  
        <SearchBar />
        
        <div className="mt-4">
          <TableHeader headers={headers} />
          <NoDataDisplay />
        </div>
  
        <div className="flex justify-between mt-4 text-sm fixed bottom-4 w-[63%]">
          <div>Total Sale With TDS: ₹ 0.00</div>
          <div>Total TDS: ₹ 0.00</div>
        </div>
      </div>
    );
  };

  export default TDSReceivable;