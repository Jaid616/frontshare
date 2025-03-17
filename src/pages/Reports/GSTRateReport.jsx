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

const GSTRateReport = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-[88vh]">
      <div className="flex justify-between items-center mb-4">
        <DateRangePicker fromDate="2025-01-01" toDate="2025-01-22" />
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold mb-4">GST TAX RATE REPORT</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Tax Name</th>
              <th className="p-2 text-left">Tax Percent</th>
              <th className="p-2 text-left">Taxable Sale Amount</th>
              <th className="p-2 text-left">Tax In</th>
              <th className="p-2 text-left">Taxable Purchase/Expense Amount</th>
              <th className="p-2 text-left">Tax Out</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body is empty as per the image */}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between mt-4 text-sm">
        <div className="text-green-600">Total Tax In: ₹ 0.00</div>
        <div className="text-red-600">Total Tax Out: ₹ 0.00</div>
      </div>
    </div>
  );
};

export default GSTRateReport;