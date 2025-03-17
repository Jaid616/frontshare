import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, FileSpreadsheet, Printer } from "lucide-react";
import db from "./config/dbConfig";
import * as XLSX from "xlsx";
import { decodeToken } from "./DecodeToken";

const PartyStatement = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("vyapar");
  const [selectedParty, setSelectedParty] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "01/01/2025",
    endDate: "31/01/2025",
  });

  const [parties, setParties] = useState([]);
  const [partyBills, setPartyBills] = useState([]);
  const [partyPayments, setPartyPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "date", label: "DATE" },
    { key: "txn", label: "TXN" },
    { key: "ref", label: "REF" },
    { key: "pay", label: "PAY" },
    { key: "total", label: "TOTAL" },
    { key: "rece", label: "RECE" },
    { key: "txn2", label: "TXN" },
    { key: "receivableBalance", label: "RECEIVABLE BALANCE" },
    { key: "payableBalance", label: "PAYABLE BALANCE" },
    { key: "print", label: "PRINT" },
  ];

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
    if (!phone) return; // Ensure phone is available before querying

    const fetchAllParties = async () => {
      try {
        const existingDoc = await db.get(phone);

        if (existingDoc?.parties) {
          setParties(existingDoc.parties);
        } else {
          setParties([]);
        }
      } catch (error) {
        console.error("Error fetching parties:", error);
        setParties([]); // Handle case when no document is found
      }
    };

    fetchAllParties();
  }, [phone]);

  // New function to fetch party statement data from local DB
  const fetchPartyStatement = async (partyId) => {
    if (!phone || !partyId) return;

    setLoading(true);
    try {
      const existingDoc = await db.get(phone);

      // Extract bills for the selected party
      const bills = (existingDoc?.bills || []).filter(
        (bill) => bill.form && bill.form.partyId === partyId
      );

      // Extract all payments
      const payments = existingDoc?.payments || [];

      // Filter payments related to the selected party
      const partyPayments = payments.filter(
        (payment) => payment.partyId === partyId
      );

      setPartyBills(bills);
      setPartyPayments(partyPayments);
    } catch (error) {
      console.error("Error fetching party statement:", error);
      setPartyBills([]);
      setPartyPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParty) {
      fetchPartyStatement(selectedParty);
    }
  }, [selectedParty, dateRange.startDate, dateRange.endDate, phone]);

  const handlePartyChange = (e) => {
    setSelectedParty(e.target.value);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  // Combine and sort transactions
  const selectedPartyTransactions = [
    ...(partyBills || []),
    ...(partyPayments || []),
  ]
    .sort(
      (a, b) =>
        new Date(a.date || a.invoiceDate) - new Date(b.date || b.invoiceDate)
    )
    .map((transaction) => {
      const isPaymentOut = transaction.type === "payment-out";
      const isPaymentIn = transaction.type === "payment-in";
      const transactionTypeLabels = {
        addsales: "Sale",
        estimate: "Estimate",
        orders: "Sales Order",
        deliverychallan: "Delivery Challan",
        salesreturn: "Sales Return",
        addpurchase: "Purchase",
        purchaseexpenses: "Expenses",
        purchaseorders: "Purchase Orders",
        purchasereturn: "Purchase Return",
      };

      return {
        date: transaction.date || transaction.invoiceDate,
        txn: isPaymentOut
          ? "Payment Out"
          : isPaymentIn
          ? "Payment In"
          : transactionTypeLabels[transaction.billType] ||
            transaction.billType ||
            "Unknown",
        ref: transaction.receiptNo || transaction.label || "N/A",
        pay: transaction.paymentType || "",
        total: transaction.total || 0,
        rece:
          isPaymentOut || isPaymentIn
            ? transaction.received || transaction.paid
            : 0,
        txn2: "",
        receivableBalance: transaction.receivableBalance || 0,
        payableBalance: transaction.total || 0,
      };
    });

  // Calculate summary values
  const summary = {
    totalSale: selectedPartyTransactions
      .filter((t) => t.txn === "Sale")
      .reduce((sum, t) => sum + Number(t.total), 0),
    totalPurchase: selectedPartyTransactions
      .filter((t) => t.txn === "Purchase")
      .reduce((sum, t) => sum + Number(t.total), 0),
    totalMoneyIn: selectedPartyTransactions
      .filter((t) => t.txn === "Payment In")
      .reduce((sum, t) => sum + Number(t.rece), 0),
    totalMoneyOut: selectedPartyTransactions
      .filter((t) => t.txn === "Payment Out")
      .reduce((sum, t) => sum + Number(t.rece), 0),
    totalExpense: selectedPartyTransactions
      .filter((t) => t.txn === "Expense")
      .reduce((sum, t) => sum + Number(t.total), 0),
    totalPayable:
      parties.find((item) => item.partyId == selectedParty)?.openingBalance ||
      0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    //// Prepare data for export (matching the table structure)
    const exportData = selectedPartyTransactions.map((txn, index) => ({
      DATE: new Date(txn.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      TXN: txn.txn,
      REF: txn.ref,
      PAY: txn.pay.charAt(0).toUpperCase() + txn.pay.slice(1),
      TOTAL: `₹${txn.total}`,
      RECE: `₹${txn.rece}`,
      TXN2: txn.txn2,
      "RECEIVABLE BALANCE": `₹${txn.receivableBalance}`,
      "PAYABLE BALANCE": `₹${txn.payableBalance}`,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Party Statement");

    // Export to Excel file
    XLSX.writeFile(
      workbook,
      `Party_Statement_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-4">
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
          <button className="px-4 py-2 text-gray-700 border rounded-md flex items-center gap-2">
            This Month
            <ChevronDown className="w-4 h-4" />
          </button>

          <span className="px-3 py-2 bg-gray-200 rounded-md">Between</span>

          <input
            type="text"
            value={dateRange.startDate}
            onChange={(e) =>
              handleDateRangeChange(e.target.value, dateRange.endDate)
            }
            className="border rounded-md px-3 py-2 w-28"
          />

          <span>To</span>

          <input
            type="text"
            value={dateRange.endDate}
            onChange={(e) =>
              handleDateRangeChange(dateRange.startDate, e.target.value)
            }
            className="border rounded-md px-3 py-2 w-28"
          />
        </div>

        <div className="w-full flex gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Party
            </label>
            <select
              className="w-full h-10 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedParty}
              onChange={handlePartyChange}
            >
              <option value="" disabled>
                Select Party
              </option>
              {parties.map((party) => (
                <option key={party.partyId} value={party.partyId}>
                  {party.partyName} - {party.openingBalance} (
                  {party.balanceType === "to-receive" ? "↑" : "↓"})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleExcelExport}
            className="p-2 border rounded-md hover:bg-gray-50"
            title="Excel Report"
          >
            <FileSpreadsheet className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 border rounded-md hover:bg-gray-50"
            title="Print"
          >
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* View Type Toggle */}
      <div className="mb-6">
        <span className="mr-4">View:</span>
        <label className="inline-flex items-center mr-4">
          <input
            type="radio"
            className="form-radio"
            name="view"
            checked={viewType === "vyapar"}
            onChange={() => setViewType("vyapar")}
          />
          <span className="ml-2">Vyapar</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="view"
            checked={viewType === "accounting"}
            onChange={() => setViewType("accounting")}
          />
          <span className="ml-2">Accounting</span>
        </label>
      </div>

      {/* Transactions Table */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : selectedPartyTransactions.length > 0 ? (
              selectedPartyTransactions.map((txn, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {txn.txn}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {txn.ref}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {txn.pay.charAt(0).toUpperCase() + txn.pay.slice(1)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    ₹{txn.total}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    ₹{txn.rece}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {txn.txn2}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    ₹{txn.receivableBalance}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    ₹{txn.payableBalance}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handlePrint()}
                    >
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

      {/* Summary Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Party Statement Summary</h3>
          <ChevronDown className="w-5 h-5" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="flex justify-between mb-1">
              <span>Total Sale: ₹ {summary.totalSale.toFixed(2)}</span>
            </div>
            <div className="text-gray-500 text-sm">(Sale - Sale Return)</div>
            <div className="mt-2">
              Total Money-In: ₹ {summary.totalMoneyIn.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Total Purchase: ₹ {summary.totalPurchase.toFixed(2)}</span>
            </div>
            <div className="text-gray-500 text-sm">
              (Purchase - Purchase Return)
            </div>
            <div className="mt-2">
              Total Money-out: ₹ {summary.totalMoneyOut.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <div>Total Expense: ₹ {summary.totalExpense.toFixed(2)}</div>
            <div className="mt-4">
              <div className="font-medium">Total Receivable</div>
              <div className="text-emerald-500">
                ₹ {summary.totalPayable.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyStatement;
