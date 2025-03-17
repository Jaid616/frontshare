import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';


const SaleOrderItem = () => {
    const navigate = useNavigate();
  
    return (
      <div className="p-4 max-w-7xl mx-auto bg-white rounded-lg shadow h-[88vh]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Sale Order Item</h1>
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
          <input
            type="text"
            placeholder="Party filter"
            className="border rounded px-3 py-1.5"
          />
          <select className="border rounded px-3 py-1.5">
            <option>SALE ORDER</option>
          </select>
          <select className="border rounded px-3 py-1.5">
            <option>All Status</option>
          </select>
        </div>
  
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Item Name</th>
                <th className="text-right p-2">Quantity</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">Total</td>
                <td className="p-2 text-right">0</td>
                <td className="p-2 text-right">₹0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default SaleOrderItem;