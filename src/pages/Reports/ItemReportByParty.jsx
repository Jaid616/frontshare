import React, { useEffect, useState } from "react";
import { FileSpreadsheet, Printer } from "lucide-react";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";
import * as XLSX from 'xlsx'; // Added XLSX import

const ItemReportByParty = () => {
  const [dateRange, setDateRange] = useState({
    from: "2025-01-01",
    to: "2025-01-20",
  });
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);

  const [processedItems, setProcessedItems] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
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
    const fetchBills = async () => {
      if (phone) {
        try {
          const existingDoc = await db.get(phone);
          setBills(existingDoc?.bills || []);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  useEffect(() => {
    const fetchItems = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items || []);
      }
    }
    fetchItems()
  }, [phone])

  useEffect(() => {
    const fetchParties = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setParties(existingDoc.parties || []);
      }
    }
    fetchParties();
  }, [phone])

  useEffect(() => {
    // Process items and calculate quantities
    const calculateItemStats = () => {
      const itemStats = (items || []).map((item) => {
        // Initialize counters
        let saleQty = 0;
        let saleAmount = 0;
        let purchaseQty = 0;
        let purchaseAmount = 0;

        if (selectedParty) {
          const filteredBills = (bills || []).filter(
            (partyBill) => partyBill.form.customer == selectedParty
          );
          filteredBills.forEach((bill) => {
            (bill.form?.items || []).forEach((billItem) => {
              if (billItem.itemId === item.itemCode) {
                if (bill.billType === "addsales") {
                  saleQty += 1 || 0;
                  saleAmount += Number(bill.total) || 0;
                } else if (bill.billType === "addpurchase") {
                  purchaseQty += 1 || 0;
                  purchaseAmount += Number(bill.total) || 0;
                }
              }
            });
          });
        } else {
          (bills || []).forEach((bill) => {
            (bill.form?.items || []).forEach((billItem) => {
              if (billItem.itemId === item.itemCode) {
                if (bill.billType === "addsales") {
                  saleQty += 1 || 0;
                  saleAmount += Number(bill.form?.total) || 0;
                } else if (bill.billType === "addpurchase") {
                  purchaseQty += 1 || 0;
                  purchaseAmount += Number(bill.form?.total) || 0;
                }
              }
            });
          });
        }

        return {
          id: item.id,
          itemName: item.itemName,
          itemHSN: item.itemHSN,
          saleQty,
          saleAmount,
          purchaseQty,
          purchaseAmount,
        };
      });
      setProcessedItems(itemStats);
    };

    calculateItemStats();
  }, [items, bills, dateRange, selectedParty]);

  const handlePartyChange = (e) => {
    setSelectedParty(e.target.value);
  };

  // Calculate totals
  const totals = (processedItems || []).reduce(
    (acc, item) => ({
      saleQty: acc.saleQty + item.saleQty,
      saleAmount: acc.saleAmount + item.saleAmount,
      purchaseQty: acc.purchaseQty + item.purchaseQty,
      purchaseAmount: acc.purchaseAmount + item.purchaseAmount,
    }),
    { saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 }
  );

  // Excel Export Function
  const handleExportExcel = () => {
    // Prepare data for Excel export
    const excelData = (processedItems || []).map((item, index) => ({
      "Sr No": index + 1,
      "Item Name": item.itemName,
      "Item HSN": item.itemHSN,
      "Sale Quantity": item.saleQty,
      "Sale Amount": item.saleAmount.toFixed(2),
      "Purchase Quantity": item.purchaseQty,
      "Purchase Amount": item.purchaseAmount.toFixed(2)
    }));

    // Add total row
    excelData.push({
      "Sr No": "Total",
      "Item Name": "",
      "Item HSN": "",
      "Sale Quantity": totals.saleQty,
      "Sale Amount": totals.saleAmount.toFixed(2),
      "Purchase Quantity": totals.purchaseQty,
      "Purchase Amount": totals.purchaseAmount.toFixed(2)
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Item Report");

    // Export to Excel file
    XLSX.writeFile(
      workbook,
      `Item_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[88vh]">
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
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            <span className="text-sm">Excel</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-700">
            <Printer className="w-4 h-4 mr-1" />
            <span className="text-sm">Print</span>
          </button>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-4">DETAILS</h2>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">FILTERS</div>
        <select
          className="w-48 block appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 text-sm"
          value={selectedParty}
          onChange={handlePartyChange}
        >
          <option value="">All Parties</option>
          {(parties || []).map((party) => (
            <option key={party.partyName} value={party.partyName}>
              {party.partyName} - {party.openingBalance} (
              {party.balanceType === "to-receive" ? "↑" : "↓"})
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-sm font-medium text-gray-600">
                Item Name
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Sale Quantity
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Sale Amount
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Purchase Quantity
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Purchase Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {(processedItems || []).map((item) => (
              <tr key={item.itemHSN} className="border-b">
                <td className="p-2 text-sm text-blue-600">{item.itemName}</td>
                <td className="p-2 text-sm text-right">{item.saleQty}</td>
                <td className="p-2 text-sm text-right">
                  ₹ {item.saleAmount.toFixed(2)}
                </td>
                <td className="p-2 text-sm text-right">{item.purchaseQty}</td>
                <td className="p-2 text-sm text-right">
                  ₹ {item.purchaseAmount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-medium bg-gray-50">
              <td className="p-2 text-sm">Total</td>
              <td className="p-2 text-sm text-right">{totals.saleQty}</td>
              <td className="p-2 text-sm text-right">
                ₹ {totals.saleAmount.toFixed(2)}
              </td>
              <td className="p-2 text-sm text-right">{totals.purchaseQty}</td>
              <td className="p-2 text-sm text-right">
                ₹ {totals.purchaseAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemReportByParty;