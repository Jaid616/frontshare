import React from 'react';

const DateRangePicker = ({ fromDate, toDate }) => (
  <div className="flex items-center space-x-2 p-2">
    <span className="text-sm">From</span>
    <input 
      type="date" 
      value={fromDate} 
      className="border p-1 text-sm rounded"
    />
    <span className="text-sm">To</span>
    <input 
      type="date" 
      value={toDate} 
      className="border p-1 text-sm rounded"
    />
  </div>
);

const TCSReceivable = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-[88vh]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-sm border rounded px-3 py-1.5">
              This Month
            </button>
          </div>
          <DateRangePicker fromDate="2025-01-01" toDate="2025-01-31" />
          <select className="border rounded px-3 py-1.5 text-sm">
            <option>ALL FIRMS</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 text-blue-600 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4v12h12V4H4zm10 10H6V6h8v8z"/>
            </svg>
            <span>Excel Report</span>
          </button>
          <button className="flex items-center space-x-1 text-blue-600 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500 text-sm">
        <div className="mb-4">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p>No data is available for TCS Receivable.</p>
        <p>Please try again after making relevant changes.</p>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <div>Total Purchase With TCS: ₹ 0.00</div>
        <div>Total TCS: ₹ 0.00</div>
      </div>
    </div>
  );
};

export default TCSReceivable;