import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';

// SalesOrders Component
const SalesOrderReports = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Sales Orders</h1>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">From:</span>
          <input
            type="date"
            defaultValue="2025-01-01"
            className="border rounded px-2 py-1"
          />
          <span className="text-sm text-gray-600">To:</span>
          <input
            type="date"
            defaultValue="2025-01-14"
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Party filter"
            className="border rounded px-3 py-1.5"
          />
        </div>
        <select className="border rounded px-3 py-1.5">
          <option>SALE ORDER</option>
        </select>
        <select className="border rounded px-3 py-1.5">
          <option>All Orders</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">DATE</th>
              <th className="text-left p-2">Order No.</th>
              <th className="text-left p-2">NAME</th>
              <th className="text-left p-2">Due Date</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">TYPE</th>
              <th className="text-right p-2">TOTAL</th>
              <th className="text-right p-2">ADVANCE</th>
              <th className="text-right p-2">BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample row - empty state */}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="flex justify-end mt-4">
        <span className="text-sm">
          Total Amount: <span className="font-medium">₹0.00</span>
        </span>
      </div>
    </div>
  );
};

// SaleOrderItem Component

export default SalesOrderReports;