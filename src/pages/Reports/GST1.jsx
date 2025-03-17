import React, { useState } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';

const GST1 = () => {
  const [activeTab, setActiveTab] = useState('sale');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span>From Month/Year</span>
              <input type="month" className="border rounded px-2 py-1" defaultValue="2025-01" />
            </div>
            <div className="flex items-center gap-2">
              <span>To Month/Year</span>
              <input type="month" className="border rounded px-2 py-1" defaultValue="2025-01" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="border rounded" />
              Consider non-tax as exempted
            </label>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-blue-600">
              <Download />
            </button>
            <button className="p-2 text-green-600">
              <FileSpreadsheet />
            </button>
            <button className="p-2 text-gray-600">
              <Printer />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('sale')}
            className={`px-4 py-2 ${
              activeTab === 'sale'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sale
          </button>
          <button
            onClick={() => setActiveTab('saleReturn')}
            className={`px-4 py-2 ${
              activeTab === 'saleReturn'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sale Return
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-4 text-gray-600">Invoice Details</h3>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="border-y bg-gray-50">
              <th className="p-3 text-left border border-gray-200">GSTIN/UIN</th>
              <th className="p-3 text-left border border-gray-200">Party Name</th>
              <th className="p-3 text-left border border-gray-200">Invoice No.</th>
              <th className="p-3 text-left border border-gray-200">Date</th>
              <th className="p-3 text-left border border-gray-200">Value</th>
              <th className="p-3 text-left border border-gray-200">Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty state */}
            <tr>
              <td className="p-3 text-center border border-gray-200" colSpan="6">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GST1;
