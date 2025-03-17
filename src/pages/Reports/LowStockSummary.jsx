import React, { useEffect, useState } from "react";
import { RefreshCw, Printer, Download, ChevronDown } from "lucide-react";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";
import * as XLSX from 'xlsx';

const LowStockSummary = () => {
  const [showInStock, setShowInStock] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredItems, setFilteredItems] = useState([]);
  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      }
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    };
    fetchItems();
  }, [phone]);

  useEffect(() => {
    setFilteredItems(() => {
      return items.filter((item) => {
        return item.openingPrimaryQuantity < item.minStockToMaintain;
      });
    });
  }, [items]);

  useEffect(() => {
    setFilteredItems(() => {
      return items.filter((item) => {
        return (
          item.categories.includes(selectedCategory) ||
          selectedCategory === "All Categories"
        );
      });
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (showInStock) {
      setFilteredItems(items.filter((item) => item.openingPrimaryQuantity > 0));
    } else {
      setFilteredItems(items);
    }
  }, [showInStock]);

  // New function to export data to Excel
  const exportToExcel = () => {
    // Prepare data for Excel export
    const exportData = filteredItems.map((item) => ({
      'Item Code': item.itemCode,
      'Item Name': item.itemName,
      'Categories': item.categories.join(', '),
      'Minimum Stock Quantity': item.minStockToMaintain,
      'Current Stock Quantity': item.openingPrimaryQuantity,
      'Stock Value': (item.openingPrimaryQuantity * item.minStockToMaintain).toFixed(2)
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Low Stock Summary");
    
    // Export to Excel file
    XLSX.writeFile(workbook, "LowStockSummary.xlsx");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">FILTERS</span>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-[180px] px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="py-1">
                    {[
                      ...new Set(
                        filteredItems.flatMap((item) => item.categories || [])
                      ),
                    ].map((category) => (
                      <button
                        key={category}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-stock"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="show-stock"
              className="text-sm font-medium text-gray-700"
            >
              Show items in stock
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Printer className="w-4 h-4" />
          </button>
          <button 
            onClick={exportToExcel}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-[50px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minimum Stock Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems?.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.itemCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.itemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.minStockToMaintain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.openingPrimaryQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ₹{" "}
                    {(
                      item.openingPrimaryQuantity * item.minStockToMaintain
                    ).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No Items Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockSummary;