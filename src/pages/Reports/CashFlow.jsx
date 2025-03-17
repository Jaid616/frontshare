import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, FileSpreadsheet, ChevronDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";

const CashFlow = () => {
  const navigate = useNavigate();
  const [allPayments, setAllPayments] = useState([]);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

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
    const fetchAllPayments = async () => {
      if (phone) {
        try {
          const existingDoc = await db.get(phone);
          if (existingDoc && existingDoc.payments) {
            // Set all payments from the document
            setAllPayments(existingDoc.payments.map(payment => ({
              ...payment,
              // Ensure we have the necessary fields for calculations
              received: payment.type === "payment-in" ? parseFloat(payment.received || 0) : 0,
              paid: payment.type === "payment-out" ? parseFloat(payment.received || 0) : 0
            })));
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      }
    };

    fetchAllPayments();
  }, [phone, isChanged]);

  // State for filters and controls
  const [dateRange, setDateRange] = useState({
    type: "this-month",
    start: "2025-01-01",
    end: "2025-01-31",
  });
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [showZeroTransactions, setShowZeroTransactions] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  // Get unique firms from the payments
  const getFirms = () => {
    const firms = allPayments
      .filter(payment => payment.firm)
      .map(payment => payment.firm);
    return ["ALL FIRMS", ...new Set(firms)];
  };

  // Filter and sort logic
  const getFilteredAndSortedTransactions = () => {
    let filtered = [...(allPayments || [])];

    // Date range filter
    filtered = filtered.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate >= new Date(dateRange.start) &&
        paymentDate <= new Date(dateRange.end)
      );
    });

    // Firm filter
    if (selectedFirm !== "ALL FIRMS") {
      filtered = filtered.filter((payment) => payment.firm === selectedFirm);
    }

    // Zero amount filter
    if (!showZeroTransactions) {
      filtered = filtered.filter(
        (payment) =>
          (payment.type === "payment-in" ? payment.received : payment.paid) > 0
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Special handling for running total sorting
        if (sortConfig.key === "running") {
          const aIndex = filtered.indexOf(a);
          const bIndex = filtered.indexOf(b);
          aValue = getRunningTotal(aIndex);
          bValue = getRunningTotal(bIndex);
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const filteredTransactions = getFilteredAndSortedTransactions();
    return filteredTransactions.reduce(
      (acc, payment) => {
        if (payment.type === "payment-in") {
          acc.cashIn += parseFloat(payment.received) || 0;
        } else {
          acc.cashOut += parseFloat(payment.paid) || 0;
        }
        return acc;
      },
      { cashIn: 0, cashOut: 0 }
    );
  };

  // Calculate running total for each transaction
  const getRunningTotal = (index) => {
    const transactions = getFilteredAndSortedTransactions();
    return transactions.slice(0, index + 1).reduce((total, payment) => {
      if (payment.type === "payment-in") {
        return total + (parseFloat(payment.received) || 0);
      } else {
        return total - (parseFloat(payment.paid) || 0);
      }
    }, 0);
  };

  // Pre-calculate running totals and assign to transactions
  const calculateRunningTotals = () => {
    const transactions = getFilteredAndSortedTransactions();
    let runningTotal = 0;
    
    return transactions.map((transaction, index) => {
      if (transaction.type === "payment-in") {
        runningTotal += parseFloat(transaction.received) || 0;
      } else {
        runningTotal -= parseFloat(transaction.paid) || 0;
      }
      
      return {
        ...transaction,
        total: runningTotal
      };
    });
  };

  const transactionsWithRunningTotals = calculateRunningTotals();
  const totals = calculateTotals();
  const filteredTransactions = transactionsWithRunningTotals;

  const columns = [
    { key: "date", label: "DATE" },
    { key: "receiptNo", label: "REF NO." },
    { key: "partyName", label: "NAME" },
    { key: "type", label: "TYPE" },
    { key: "cashIn", label: "CASH IN" },
    { key: "cashOut", label: "CASH OUT" },
    { key: "running", label: "RUNNING" },
    { key: "print", label: "PRINT" },
  ];

  const handleDateRangeChange = (type) => {
    const today = new Date();
    let start, end;

    switch (type) {
      case "this-month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "last-month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "custom":
        // For custom, keep the existing dates
        return setDateRange({ ...dateRange, type });
      default:
        return;
    }

    setDateRange({
      type,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
  };

  // Get closing balance - the running total of all transactions
  const getClosingBalance = () => {
    if (filteredTransactions.length > 0) {
      return filteredTransactions[filteredTransactions.length - 1].total;
    }
    return 0;
  };

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredTransactions.map((transaction) => ({
      Date: transaction.date ? format(new Date(transaction.date), "dd/MM/yyyy") : "-",
      "Ref No.": transaction.receiptNo || "-",
      Name: transaction.partyName || "-",
      Type: transaction.type ? transaction.type.replace("-", " ") : "-",
      "Cash In": transaction.type === "payment-in" ? `₹ ${parseFloat(transaction.received || 0).toFixed(2)}` : "-",
      "Cash Out": transaction.type === "payment-out" ? `₹ ${parseFloat(transaction.paid || 0).toFixed(2)}` : "-",
      "Running Total": `₹ ${transaction.total.toFixed(2)}`
    }));

    // Add summary rows
    const summaryRows = [
      { 
        Date: "Total Cash-in", 
        "Ref No.": `₹ ${totals.cashIn.toFixed(2)}`,
        Name: "",
        Type: "",
        "Cash In": "",
        "Cash Out": "",
        "Running Total": ""
      },
      { 
        Date: "Total Cash-out", 
        "Ref No.": `₹ ${totals.cashOut.toFixed(2)}`,
        Name: "",
        Type: "",
        "Cash In": "",
        "Cash Out": "",
        "Running Total": ""
      },
      { 
        Date: "Closing Cash-in Hand", 
        "Ref No.": `₹ ${getClosingBalance().toFixed(2)}`,
        Name: "",
        Type: "",
        "Cash In": "",
        "Cash Out": "",
        "Running Total": ""
      }
    ];

    // Combine data and summary
    const finalExportData = [...exportData, ...summaryRows];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(finalExportData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cash Flow");

    // Export to Excel file
    XLSX.writeFile(workbook, `Cash_Flow_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="px-4 py-2 border rounded-md flex items-center gap-2 bg-gray-100"
              onClick={() => {
                const nextType = dateRange.type === "this-month" 
                  ? "last-month" 
                  : dateRange.type === "last-month"
                  ? "custom"
                  : "this-month";
                handleDateRangeChange(nextType);
              }}
            >
              {dateRange.type === "this-month"
                ? "This Month"
                : dateRange.type === "last-month"
                ? "Last Month"
                : "Custom"}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <span className="text-gray-500">Between</span>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ 
                ...prev, 
                start: e.target.value,
                type: "custom" 
              }))
            }
            className="border rounded-md px-3 py-2 w-40"
          />

          <span className="text-gray-500">To</span>

          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ 
                ...prev, 
                end: e.target.value,
                type: "custom" 
              }))
            }
            className="border rounded-md px-3 py-2 w-40"
          />
        </div>

        <select
          className="border rounded-md px-3 py-2"
          value={selectedFirm}
          onChange={(e) => setSelectedFirm(e.target.value)}
        >
          {getFirms().map((firm) => (
            <option key={firm} value={firm}>
              {firm}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button className="p-2 border rounded-md hover:bg-gray-50" onClick={exportToExcel}>
            <FileSpreadsheet className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Opening Balance */}
      <div className="mb-4 flex items-center gap-4">
        <div className="text-emerald-500">Opening Cash-in Hand: ₹ 0.00</div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={showZeroTransactions}
            onChange={(e) => setShowZeroTransactions(e.target.checked)}
          />
          Show zero amount transaction
        </label>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b cursor-pointer"
                  onClick={() => col.key !== "print" && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== "print" && <ChevronDown className="w-4 h-4" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr key={transaction._id || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {transaction.date ? format(new Date(transaction.date), "dd/MM/yyyy") : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.receiptNo || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">{transaction.partyName || "-"}</td>
                  <td className="px-4 py-3 text-sm capitalize">
                    {transaction.type ? transaction.type.replace("-", " ") : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.type === "payment-in" &&
                      `₹ ${parseFloat(transaction.received || 0).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.type === "payment-out" &&
                      `₹ ${parseFloat(transaction.paid || 0).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    ₹ {transaction.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No transactions to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-4 flex justify-between text-sm">
        <div className="text-emerald-500">
          Total Cash-in: ₹ {totals.cashIn.toFixed(2)}
        </div>
        <div className="text-red-500">
          Total Cash-out: ₹ {totals.cashOut.toFixed(2)}
        </div>
        <div className="text-emerald-500">
          Closing Cash-in Hand: ₹ {getClosingBalance().toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CashFlow;