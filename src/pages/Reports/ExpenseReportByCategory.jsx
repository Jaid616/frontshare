import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../../Redux/expenses";
import { useNavigate } from "react-router-dom";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";
import * as XLSX from 'xlsx';

const ExpenseReportByCategory = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const navigate = useNavigate();
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
    const fetchExpenses = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setAllExpenses(existingDoc?.expenses);
      }
    };
    fetchExpenses();
  }, [phone]);

  const groupedExpenses = allExpenses.reduce((acc, expense) => {
    const category = expense.expenseCategory;
    if (!acc[category]) {
      acc[category] = {
        items: [],
        totalAmount: 0,
      };
    }
    acc[category].items.push(expense);
    acc[category].totalAmount += expense.total;
    return acc;
  }, {});

  const grandTotal = Object.values(groupedExpenses).reduce(
    (sum, category) => sum + category.totalAmount,
    0
  );

  const handleExcelExport = () => {
    // Convert grouped expenses to array for export
    const excelData = Object.entries(groupedExpenses).map(([category, data]) => ({
      'Expense Category': category,
      'Category Type': 'Direct Expense',
      'Amount': data.totalAmount
    }));

    // Add grand total row
    excelData.push({
      'Expense Category': 'Total',
      'Category Type': '',
      'Amount': grandTotal
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Report by Category");
    
    // Export to excel file
    XLSX.writeFile(workbook, "Expense_Report_By_Category.xlsx");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">From</span>
          <input
            type="date"
            className="border rounded p-2 text-sm"
            defaultValue="2025-01-01"
          />
          <span className="text-sm">To</span>
          <input
            type="date"
            className="border rounded p-2 text-sm"
            defaultValue="2025-01-22"
          />
          <select className="border rounded p-2 text-sm">
            <option>ALL USERS</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 border rounded text-sm"
            onClick={handleExcelExport}
          >
            Excel Report
          </button>
          <button className="p-2 border rounded text-sm">Print</button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-sm">EXPENSE</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          onClick={() => navigate("/add-expense")}
        >
          + Add Expense
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Expense Category</th>
            <th className="text-left p-2">Category Type</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedExpenses).map(([category, data], index) => (
            <tr key={index} className="bg-gray-50">
              <td className="p-2">{category}</td>
              <td className="p-2">Direct Expense</td>
              <td className="text-right p-2">
                ₹{" "}
                {data.totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t">
            <td colSpan={3} className="text-right p-2 text-red-500">
              Total Expense: ₹{" "}
              {grandTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ExpenseReportByCategory;