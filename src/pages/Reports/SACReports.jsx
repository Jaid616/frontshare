import React, { useState } from 'react';
import { Calendar, Table } from 'lucide-react';

const SACReport = () => {
    return (
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <select className="border rounded px-3 py-2">
              <option>This Month</option>
            </select>
            <span className="bg-gray-200 px-3 py-2 rounded">Between</span>
            <input type="text" value="01/01/2025" className="border rounded px-3 py-2" />
            <span>To</span>
            <input type="text" value="31/01/2025" className="border rounded px-3 py-2" />
            <select className="border rounded px-3 py-2">
              <option>ALL FIRMS</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="p-2">
              <Table className="h-5 w-5 text-blue-600" />
            </button>
            <button className="p-2">
              <Calendar className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
  
        <h1 className="text-xl font-semibold mb-6">SAC REPORT</h1>
  
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4">
            <img src="/api/placeholder/100/100" alt="No data" className="opacity-50" />
          </div>
          <p className="text-gray-500 mb-2">No data is available for SAC Wise Summary Report.</p>
          <p className="text-gray-500">Please try again after making relevant changes.</p>
        </div>
  
        <div className="flex justify-between mt-6">
          <div>Total Value: ₹ 0.00</div>
          <div>Total Items: 0</div>
        </div>
      </div>
    );
  };

  export default SACReport;