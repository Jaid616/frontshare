import React, { useState, useEffect } from "react";
import { ArrowLeft, Printer, FileSpreadsheet, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const DayBook = () => {
  // Get current date in DD/MM/YYYY format
  const currentDate = new Date().toLocaleDateString('en-GB');

  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("All Transaction");
  const [moneyIn, setMoneyIn] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [bills, setBills] = useState([]);

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
          // Filter bills for today's date
          const today = new Date().toISOString().split('T')[0];
          const todayBills = existingDoc.bills?.filter(bill => 
            bill.invoiceDate.split('T')[0] === today
          );
          setBills(todayBills || []);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  const filteredBills = bills.filter((bill) => {
    // Date range filter
    const matchesDate =
      dateRange.start && dateRange.end
        ? new Date(bill.invoiceDate) >= new Date(dateRange.start) &&
          new Date(bill.invoiceDate) <= new Date(dateRange.end)
        : true;

    // Search filter
    const matchesSearch =
      bill.form?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id?.toString().includes(searchTerm) ||
      bill.billType?.toLowerCase().includes(searchTerm.toLowerCase());

    // Transaction type filter
    const matchesTransactionType =
      selectedTransactionType === "All Transaction" ||
      bill.billType?.toLowerCase() === selectedTransactionType.toLowerCase();

    return matchesDate && matchesSearch && matchesTransactionType;
  });

  useEffect(() => {
    // Calculate money in and out
    const totalMoneyIn = filteredBills.reduce((total, bill) => {
      return total + (bill.receivedAmount > 0 ? parseFloat(bill.receivedAmount) : 0);
    }, 0);

    const totalMoneyOut = filteredBills.reduce((total, bill) => {
      return total + (bill.receivedAmount < 0 ? Math.abs(parseFloat(bill.receivedAmount)) : 0);
    }, 0);

    setMoneyIn(totalMoneyIn);
    setMoneyOut(totalMoneyOut);
    setNetAmount(totalMoneyIn - totalMoneyOut);
  }, [filteredBills]);

  const handleExportExcel = () => {
    // Prepare data for export
    const exportData = filteredBills.map(bill => ({
      Date: bill.invoiceDate,
      'Name': bill.form?.customer,
      'Ref No.': bill.id,
      'Type': bill.billType,
      'Total': bill.total || 0,
      'Money In': bill.receivedAmount > 0 ? bill.receivedAmount : 0,
      'Money Out': bill.receivedAmount < 0 ? Math.abs(bill.receivedAmount) : 0
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Day Book');

    // Export to Excel file
    XLSX.writeFile(workbook, `Day_Book_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-4 min-h-screen bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Date</span>
            <div className="border rounded px-2 py-1">
              {currentDate}
            </div>
          </div>
          
          <select 
            className="border rounded px-3 py-1 bg-white"
            value={selectedTransactionType}
            onChange={(e) => setSelectedTransactionType(e.target.value)}
          >
            <option>All Transaction</option>
            <option>orders</option>
            <option>purchase</option>
            <option>journal</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Between</span>
            <input 
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border rounded-md px-3 py-2"
            />
            <span className="text-gray-600">To</span>
            <input 
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border rounded-md px-3 py-2"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel Report
          </button>
          <button className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border rounded-lg px-3 py-2 w-64"
        />
      </div>
      
      {/* Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  NAME
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  REF NO.
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  TYPE
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  TOTAL
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  MONEY IN
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  MONEY OUT
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
              <th className="text-left p-3 font-medium">
                <div className="flex items-center gap-1">
                  PRINT / SHA...
                  <span className="text-gray-400">▼</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length > 0 ? (
              filteredBills.map((bill, index) => (
                <tr key={bill.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{bill.form?.customer}</td>
                  <td className="p-3">{bill.id}</td>
                  <td className="p-3">{bill.billType}</td>
                  <td className="p-3">₹ {bill.total || 0}</td>
                  <td className="p-3 text-emerald-500">
                    {bill.receivedAmount > 0 ? `₹ ${bill.receivedAmount}` : '-'}
                  </td>
                  <td className="p-3 text-red-500">
                    {bill.receivedAmount < 0 ? `₹ ${Math.abs(bill.receivedAmount)}` : '-'}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No transactions to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Totals */}
      <div className="flex justify-between bottom-4 w-full absolute mt-4 text-sm">
        <div className="text-emerald-500">
          Total Money-In: ₹ {moneyIn.toFixed(2)}
        </div>
        <div className="text-red-500">
          Total Money-Out: ₹ {moneyOut.toFixed(2)}
        </div>
        <div className="text-emerald-500 relative right-[292px]">
          Total Money In - Total Money Out: ₹ {netAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default DayBook;