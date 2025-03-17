import React, { useState } from 'react';
import { Calendar, Table } from 'lucide-react';

// GSTR2 Report Component
const GST2 = () => {
  const [fromDate, setFromDate] = useState('01/2025');
  const [toDate, setToDate] = useState('01/2025');

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-3 py-2 pr-8"
              placeholder="From Month/Year"
            />
            <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-3 py-2 pr-8"
              placeholder="To Month/Year"
            />
            <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-green-600">
            <Table className="h-5 w-5" />
          </button>
          <button className="p-2 text-blue-600">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">GSTR2 REPORT</h1>
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-600">CONSIDER NON-TAX AS EXEMPTED</span>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">GSTIN/UIN</th>
            <th className="px-4 py-2 text-left">Party Name</th>
            <th className="px-4 py-2 text-left">No.</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Value</th>
            <th className="px-4 py-2 text-left">Rate</th>
          </tr>
        </thead>
        <tbody>
          {/* Table body will be populated with data */}
        </tbody>
      </table>
    </div>
  );
};
export default GST2