import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../../Redux/expenses";
import { useNavigate } from "react-router-dom";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";
import * as XLSX from 'xlsx';

const ExpenseReports = () => {
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Date state
  const [dateFilter, setDateFilter] = useState({
    startDate: "2025-01-01",
    endDate: "2025-01-31"
  });

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
    const fetchExpenses = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setAllExpenses(existingDoc?.expenses || []);
      }
    };
    fetchExpenses();
  }, [phone]);

  // Filter expenses based on search term
  useEffect(() => {
    if (!allExpenses) return;

    const filtered = allExpenses.filter((expense) => 
      Object.values(expense).some((value) => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, allExpenses]);

  // Excel Export Function
  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const excelData = (filteredExpenses.length > 0 ? filteredExpenses : allExpenses).map(expense => ({
      'Date': expense.date,
      'Expense No.': expense.expenseNo,
      'Party': expense.party,
      'Category': expense.expenseCategory,
      'Payment Type': expense.paymentType,
      'Amount': parseFloat(expense.amount),
      'Balance Due': parseFloat(expense.balanceDue)
    }));

    // Calculate totals
    const totalAmount = excelData.reduce((sum, item) => sum + item.Amount, 0);
    const totalBalanceDue = excelData.reduce((sum, item) => sum + item['Balance Due'], 0);

    // Add total row
    excelData.push({
      'Date': 'TOTAL',
      'Amount': totalAmount,
      'Balance Due': totalBalanceDue
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Report");

    // Export to Excel file
    XLSX.writeFile(workbook, `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <select className="border rounded p-2">
            <option>This Month</option>
          </select>
          <span className="bg-gray-200 px-2 py-1 rounded">Between</span>
          <input
            type="date"
            className="border rounded p-2"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter(prev => ({
              ...prev, 
              startDate: e.target.value
            }))}
          />
          <span>To</span>
          <input
            type="date"
            className="border rounded p-2"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter(prev => ({
              ...prev, 
              endDate: e.target.value
            }))}
          />
          <select className="border rounded p-2">
            <option>ALL FIRMS</option>
          </select>
          <select className="border rounded p-2">
            <option>ALL USERS</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border rounded flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Graph
          </button>
          <button 
            onClick={handleExportToExcel}
            className="p-2 border rounded flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <Download className="h-4 w-4" /> Excel Report
          </button>
          <button className="p-2 border rounded flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border rounded p-2 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={() => navigate("/add-expense")}
        >
          + Add Expense
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">DATE ▼</th>
            <th className="text-left p-2">EXP NO. ▼</th>
            <th className="text-left p-2">PARTY ▼</th>
            <th className="text-left p-2">CATEGORY N... ▼</th>
            <th className="text-left p-2">PAYMENT TYPE ▼</th>
            <th className="text-right p-2">AMOUNT ▼</th>
            <th className="text-right p-2">BALANCE DUE ▼</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {(filteredExpenses.length > 0 ? filteredExpenses : allExpenses).map((expense) => (
            <tr key={expense.id} className="border-b">
              <td className="p-2">{expense.date}</td>
              <td className="p-2">{expense.expenseNo}</td>
              <td className="p-2">{expense.party}</td>
              <td className="p-2">{expense.expenseCategory}</td>
              <td className="p-2">{expense.paymentType}</td>
              <td className="text-right p-2">{expense.amount}</td>
              <td className="text-right p-2">{expense.balanceDue}</td>
              <td className="text-center p-2">⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseReports;