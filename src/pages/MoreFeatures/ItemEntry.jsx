import React, { useState, useEffect } from "react";
import { X, Scan, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemEntry = () => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);

  // Generate 100 initial rows
  const generateInitialRows = () => {
    return Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      code: "",
      name: "",
      category: "",
      hsn: "",
      mrp: "",
      price: "",
      tax: "",
      unit: "",
      stock: "",
    }));
  };

  const [items, setItems] = useState(generateInitialRows());

  const deleteRow = (id) => {
    setItems(items.filter((item) => item.id !== id));
    // Add a new row at the end to maintain 100 rows
    const lastId = Math.max(...items.map(item => item.id));
    setItems(prev => [...prev.filter(item => item.id !== id), {
      id: lastId + 1,
      code: "",
      name: "",
      category: "",
      hsn: "",
      mrp: "",
      price: "",
      tax: "",
      unit: "",
      stock: "",
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Add Items</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center text-sm text-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            ONLINE: FETCHING FROM LIBRARY
          </span>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search in sheet"
            className="w-full px-4 py-2 border rounded-lg pl-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            [Ctrl+F]
          </span>
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Settings size={16} />
          <span>Customize Table</span>
        </button>
      </div>

      {/* Table with fixed header and scrollable body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-600 w-12">#</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 w-40">ITEM CODE</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[200px]">
                  ITEM NAME<span className="text-red-500">*</span>
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[150px]">CATEGORY</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[120px]">HSN CODE</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[120px]">DEFAULT MRP(₹)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[120px]">SALE PRICE(₹)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[100px]">TAX(%)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[120px]">BASE UNIT</th>
                <th className="p-3 text-left text-sm font-medium text-gray-600 min-w-[120px]">OPENING STOCK</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 relative"
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Scan size={16} className="text-blue-500" />
                      <input
                        type="text"
                        placeholder={index === 0 ? "Enter Barcode" : ""}
                        className="w-full bg-transparent border-none text-sm"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder={index === 0 ? "E.g. India Gate Basmati Rice, 10kg" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <select className="w-full bg-transparent border-none text-sm">
                      <option value="">{index === 0 ? "Select Category" : ""}</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder={index === 0 ? "Enter HSN" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      placeholder={index === 0 ? "Enter MRP" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      placeholder={index === 0 ? "Enter Price" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      placeholder={index === 0 ? "Enter Tax" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <select className="w-full bg-transparent border-none text-sm">
                      <option value="">{index === 0 ? "Select Unit" : ""}</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      placeholder={index === 0 ? "Enter Stock" : ""}
                      className="w-full bg-transparent border-none text-sm"
                    />
                  </td>
                  {hoveredRow === item.id && (
                    <td className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
                      <button
                        onClick={() => deleteRow(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save [Ctrl+S]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemEntry;