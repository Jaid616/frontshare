import React, { useState, useEffect } from "react";
import { Calendar, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBank } from "../../Redux/bankSlice";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";
import * as XLSX from 'xlsx';

const BankStatement = () => {
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [fromDate, setFromDate] = useState("01/01/2025");
  const [toDate, setToDate] = useState("21/01/2025");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [banks, setBanks] = useState([]);
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
    const fetchBanks = async (req, res) => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setBanks(existingDoc.banks);
      }
    };
    fetchBanks();
  }, [phone]);

  useEffect(() => {
    if (banks) {
      const processed = banks.map((bank) => ({
        date: new Date(bank.asOfDate).toLocaleDateString(),
        description: bank.description || "",
        withdrawal: bank.withdrawAmount
          ? `₹${bank.withdrawAmount.toFixed(2)}`
          : "",
        deposit: bank.openingBalance
          ? `₹${Number(bank.openingBalance).toFixed(2)}`
          : "",
        balance: `₹${(Number(bank.openingBalance) - Number(bank.withdrawAmount || 0)).toFixed(
          2
        )}`,
        bankName: bank.bankName,
      }));

      if (selectedBank === "All Banks") {
        setFilteredTransactions(processed);
      } else {
        setFilteredTransactions(
          processed.filter((trans) => trans.bankName === selectedBank)
        );
      }
    }
  }, [banks, selectedBank]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setIsDropdownOpen(false);
  };

  // Calculate total balance
  const totalBalance = filteredTransactions.reduce((acc, curr) => {
    const balance = parseFloat(curr.balance.replace("₹", ""));
    return acc + balance;
  }, 0);

  // Get unique bank names from the data
  const uniqueBanks = banks
    ? ["All Banks", ...new Set(banks.map((bank) => bank.bankName))]
    : ["All Banks"];

  // Excel Export Function
  const handleExportToExcel = () => {
    // Prepare data for Excel export (without currency symbols)
    const excelData = filteredTransactions.map(transaction => ({
      Date: transaction.date,
      Description: transaction.description,
      'Withdrawal Amount': transaction.withdrawal.replace('₹', ''),
      'Deposit Amount': transaction.deposit.replace('₹', ''),
      'Balance Amount': transaction.balance.replace('₹', ''),
      'Bank Name': transaction.bankName
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Statement");

    // Export to Excel file
    XLSX.writeFile(workbook, `Bank_Statement_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg h-[88vh]">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-48">
            <label className="block text-sm text-gray-600 mb-1">
              Bank name
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between border rounded px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{selectedBank}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
                  <ul className="py-1">
                    {uniqueBanks.map((bank) => (
                      <li key={bank}>
                        <button
                          onClick={() => handleBankSelect(bank)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          {bank}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">TRANSACTIONS</div>
          <button 
            onClick={handleExportToExcel}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export to Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-600">
                  Date
                </th>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-600">
                  Description
                </th>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-600">
                  Withdrawal Amount
                </th>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-600">
                  Deposit Amount
                </th>
                <th className="border border-gray-200 p-3 text-left font-medium text-gray-600">
                  Balance Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-200 p-3">
                    {transaction.date}
                  </td>
                  <td className="border border-gray-200 p-3">
                    {transaction.description}
                  </td>
                  <td className="border border-gray-200 p-3 text-red-600">
                    {transaction.withdrawal}
                  </td>
                  <td className="border border-gray-200 p-3 text-green-600">
                    {transaction.deposit}
                  </td>
                  <td className="border border-gray-200 p-3">
                    {transaction.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="text-right">
            <div className="font-medium">Balance</div>
            <div className="text-lg font-semibold">
              ₹{totalBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankStatement;