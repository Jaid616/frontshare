import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Download } from "lucide-react";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";
import * as XLSX from 'xlsx';

const StockDetails = () => {
  const [dateRange, setDateRange] = useState({
    from: "2025-01-01",
    to: "2025-01-21",
  });
  const [processedItems, setProcessedItems] = useState([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);
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
    const fetchBills = async () => {
      if (phone) {
        try {
          const existingDoc = await db.get(phone);
          setBills(existingDoc?.bills);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  useEffect(() => {
    const filteredItems = () => {
      const itemStates = items.map((item) => {
        let quantityIn = 0;
        let purchaseAmount = 0;
        let quantityOut = 0;
        let saleAmount = 0;
        let sold = 0;
        let closingQuantity = 0;
        let openingStocks = 0;

        bills?.forEach((bill) => {
          bill?.form?.items?.forEach((billItem) => {
            if (billItem.itemId === item.itemCode) {
              if (bill.billType === "addsales") {
                if (saleAmount !== bill.form?.total) {
                  saleAmount += Number(bill.form?.total) || 0;
                }
                openingStocks += item.openingQuantity * item.atPrice;
                sold += 1;
              } else if (bill.billType === "addpurchase") {
                if (purchaseAmount !== bill.form?.total) {
                  purchaseAmount += Number(bill.form?.total) || 0;
                }
              }
            }
          });
        });

        quantityIn = Number(item.openingPrimaryQuantity);
        closingQuantity = Number(item.openingPrimaryQuantity - sold);
        quantityOut = sold;
        
        return {
          itemName: item.itemName,
          beginningQuantity: 0,
          quantityIn: quantityIn,
          purchaseAmount: purchaseAmount,
          quantityOut: quantityOut,
          saleAmount: saleAmount,
          closingQuantity: closingQuantity,
        };
      });

      // Calculate total profit/loss
      const total = itemStates.reduce(
        (acc, item) => acc + (item.saleAmount - item.purchaseAmount),
        0
      );

      setTotalProfitLoss(total);
      setProcessedItems(itemStates);
    };

    if (items.length > 0) {
      filteredItems();
    }
  }, [items, bills]);

  // Calculate totals from processed items
  const totals = processedItems.reduce(
    (acc, item) => ({
      beginningQuantity: acc.beginningQuantity + item.beginningQuantity,
      quantityIn: acc.quantityIn + item.quantityIn,
      purchaseAmount: acc.purchaseAmount + item.purchaseAmount,
      quantityOut: acc.quantityOut + item.quantityOut,
      saleAmount: acc.saleAmount + item.saleAmount,
      closingQuantity: acc.closingQuantity + item.closingQuantity,
    }),
    {
      beginningQuantity: 0,
      quantityIn: 0,
      purchaseAmount: 0,
      quantityOut: 0,
      saleAmount: 0,
      closingQuantity: 0,
    }
  );

  // New function to export data to Excel
  const exportToExcel = () => {
    // Prepare data for Excel export
    const exportData = [
      ...processedItems.map((item) => ({
        'Item Name': item.itemName,
        'Beginning Quantity': item.beginningQuantity,
        'Quantity In': item.quantityIn,
        'Purchase Amount': item.purchaseAmount.toFixed(2),
        'Quantity Out': item.quantityOut,
        'Sale Amount': item.saleAmount.toFixed(2),
        'Closing Quantity': item.closingQuantity,
      })),
      // Add a total row
      {
        'Item Name': 'Total',
        'Beginning Quantity': totals.beginningQuantity,
        'Quantity In': totals.quantityIn,
        'Purchase Amount': totals.purchaseAmount.toFixed(2),
        'Quantity Out': totals.quantityOut,
        'Sale Amount': totals.saleAmount.toFixed(2),
        'Closing Quantity': totals.closingQuantity,
      }
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Details");
    
    // Export to Excel file
    XLSX.writeFile(workbook, "StockDetails.xlsx");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">From</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-600">To</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="border rounded px-2 py-1 text-sm">
              <option>All Categories</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={exportToExcel}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-700">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-4">DETAILS</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-sm font-medium text-gray-600">
                Item Name
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Beginning Quantity
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Quantity In
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Purchase Amount
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Quantity Out
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Sale Amount
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Closing Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {processedItems.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-2 text-sm text-blue-600">{item.itemName}</td>
                <td className="p-2 text-sm text-right">
                  {item.beginningQuantity}
                </td>
                <td className="p-2 text-sm text-right">{item.quantityIn}</td>
                <td className="p-2 text-sm text-right">
                  ₹ {item.purchaseAmount.toFixed(2)}
                </td>
                <td className="p-2 text-sm text-right">{item.quantityOut}</td>
                <td className="p-2 text-sm text-right">
                  ₹ {item.saleAmount.toFixed(2)}
                </td>
                <td className="p-2 text-sm text-right">
                  {item.closingQuantity}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-medium">
              <td className="p-2 text-sm">Total</td>
              <td className="p-2 text-sm text-right">
                {totals.beginningQuantity}
              </td>
              <td className="p-2 text-sm text-right">{totals.quantityIn}</td>
              <td className="p-2 text-sm text-right">
                ₹ {totals.purchaseAmount.toFixed(2)}
              </td>
              <td className="p-2 text-sm text-right">{totals.quantityOut}</td>
              <td className="p-2 text-sm text-right">
                ₹ {totals.saleAmount.toFixed(2)}
              </td>
              <td className="p-2 text-sm text-right">
                {totals.closingQuantity}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockDetails;