import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../Redux/itemSlice";
import { getBills } from "../../Redux/billSlice";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";

const ItemDetails = () => {
  const getCurrentMonthStart = () => {
    const now = new Date();
    return `01/${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}/${now.getFullYear()}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()}`;
  };

  const [startDate, setStartDate] = useState(getCurrentMonthStart());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedItem, setSelectedItem] = useState("");
  const [hideInactive, setHideInactive] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

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

  const formatDate = (dateString) => {
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  };

  const generateDates = () => {
    const dates = [];
    const start = parseDate(startDate);
    const end = parseDate(endDate);
  
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date)); // Push a new Date instance to avoid mutating
    }
  
    return dates;
  };

  const calculateDailyTransactions = (itemCode) => {
    const dates = generateDates();
    const selectedItemData = items.find((item) => item.itemCode === itemCode);

    if (!selectedItemData) return [];

    let runningQty = selectedItemData.openingQuantity || 0;

    const dailyData = dates.map((date, index) => {
      const dateStr = formatDate(date.toISOString().split("T")[0]);
      const dayBills = bills.filter((bill) => {
        const billDate = formatDate(bill.form?.invoiceDate);
        return billDate === dateStr;
      });

      let saleQty = 0;
      let purchaseQty = 0;

      dayBills.forEach((bill) => {
        bill.form?.items.forEach((billItem) => {
          if (billItem.itemId === itemCode) {
            if (bill.billType === "addsales") {
              const qty = parseInt(billItem.quantity.primary) || 0;
              saleQty += qty;
            } else if (bill.billType === "addpurchase") {
              const qty = parseInt(billItem.quantity.primary) || 0;
              purchaseQty += qty;
            }
          }
        });
      });

      const isFirstDay = index === 0;
      const openingQty = runningQty;
      const adjustmentQty = isFirstDay ? selectedItemData.openingQuantity : 0;
      const closingQty = openingQty - saleQty + purchaseQty;

      runningQty = closingQty;

      return {
        date: dateStr,
        itemCode,
        saleQty,
        purchaseQty,
        adjustmentQty,
        closingQty,
      };
    });

    return dailyData;
  };

  useEffect(() => {
    if (selectedItem) {
      const newData = calculateDailyTransactions(selectedItem);
      setTableData(newData);
    }
  }, [selectedItem, items, bills, startDate, endDate]);

  const filteredTableData = hideInactive
    ? tableData.filter((row) => row.saleQty > 0 || row.purchaseQty > 0)
    : tableData;

  // New function to export data to Excel
  const exportToExcel = () => {
    // Get selected item name
    const selectedItemName = items.find(item => item.itemCode === selectedItem)?.itemName || 'Unknown Item';

    // Prepare data for Excel export
    const exportData = filteredTableData.map((row) => ({
      'Date': row.date,
      'Sale Quantity': row.saleQty,
      'Purchase Quantity': row.purchaseQty,
      'Adjustment Quantity': row.adjustmentQty,
      'Closing Quantity': row.closingQty
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedItemName} Details`);
    
    // Export to Excel file
    XLSX.writeFile(workbook, `${selectedItemName}_ItemDetails.xlsx`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-sm rounded-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <span>From</span>
          <input
            type="text"
            value={startDate}
            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>To</span>
          <input
            type="text"
            value={endDate}
            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
            onChange={(e) => setEndDate(e.target.value)}
          />
          {selectedItem && (
            <button 
              onClick={exportToExcel}
              className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Export to Excel"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4">DETAILS</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm min-w-24">Item name</label>
              <div className="relative w-64">
                <input
                  type="text"
                  value={selectedItem}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer"
                  readOnly
                  onClick={() => setIsPopoverOpen((prev) => !prev)}
                />
                {isPopoverOpen && (
                  <div className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                    {items.map((item) => (
                      <div
                        key={item.itemCode}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm rounded"
                        onClick={() => {
                          setSelectedItem(item.itemCode);
                          setIsPopoverOpen(false);
                        }}
                      >
                        {item.itemName}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hideInactive"
                  checked={hideInactive}
                  className="w-4 h-4 border-gray-300 rounded"
                  onChange={(e) => setHideInactive(e.target.checked)}
                />
                <label htmlFor="hideInactive" className="text-sm">
                  Hide inactive dates
                </label>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div>Date</div>
              <div>Sale Quantity</div>
              <div>Purchase Quantity</div>
              <div>Adjustment Quantity</div>
              <div>Closing Quantity</div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredTableData.map((row, index) => (
                <div
                  key={row.date}
                  className={`grid grid-cols-6 gap-4 text-sm text-gray-600 py-2 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div>{row.date}</div>
                  <div>{row.saleQty}</div>
                  <div>{row.purchaseQty}</div>
                  <div>{row.adjustmentQty}</div>
                  <div>{row.closingQty}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;