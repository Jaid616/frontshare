import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const EstimateQuotation = () => {
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-01-31",
  });
  const navigate = useNavigate();
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [searchQuery, setSearchQuery] = useState("");
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
    const fetchBills = async () => {
      if (phone) {
        try {
          const existingDoc = await db.get(phone);
          const updatedBills = existingDoc.bills.filter(
            (bill) => bill.billType === "estimate"
          );
          console.log(updatedBills, "This is a new order");
          setBills(updatedBills);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);
  const firms = ["ALL FIRMS", "Firm A", "Firm B", "Firm C"];
  const periods = [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-quarter", label: "This Quarter" },
    { value: "this-year", label: "This Year" },
    { value: "custom", label: "Custom" },
  ];

  const columns = [
    { id: "date", label: "DATE" },
    { id: "label", label: "LABEL" },
    { id: "customer", label: "CUSTOMER" },
    { id: "billingAddress", label: "BILLING ADDRESS" },
    { id: "total", label: "TOTAL AMOUNT" },
    { id: "stateOfSupply", label: "STATE" },
    { id: "action", label: "ACTION" },
  ];

  useEffect(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (selectedPeriod) {
      case "today":
        start = now;
        end = now;
        break;
      case "this-week":
        start = new Date(now.setDate(now.getDate() - now.getDay()));
        end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        break;
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "this-quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
      case "this-year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
    }

    if (selectedPeriod !== "custom") {
      setDateRange({
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      });
    }
  }, [selectedPeriod]);

  // Filter transactions based on all criteria
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill?.form?.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill?.label?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFirm =
      selectedFirm === "ALL FIRMS" || bill?.firm === selectedFirm;

    const billDate = new Date(bill?.invoiceDate);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchesDate = billDate >= startDate && billDate <= endDate;

    return matchesSearch && matchesFirm && matchesDate;
  });

  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg shadow p-2 bg-gray-100 text-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-2 bg-white justify-between p-2 rounded">
        {/* Date Period Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 min-w-[120px]"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-200 rounded text-sm">Between</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="border rounded px-2 py-1 w-32 focus:outline-none focus:border-blue-500"
          />
          <span>To</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="border rounded px-2 py-1 w-32 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Firms Dropdown */}
        <div className="relative">
          <select
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
            className="appearance-none bg-white border rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 min-w-[150px]"
          >
            {firms.map((firm) => (
              <option key={firm} value={firm}>
                {firm}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white p-2 rounded h-[78vh]">
        <h2 className="text-lg font-semibold mb-4">TRANSACTIONS</h2>

        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={() =>
              navigate("/add-sales", { state: { page: "estimate" } })
            }
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Estimate
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.id !== "action" && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bills.length > 0 ? (
                bills.map((bill, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {bill.form?.invoiceDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.form?.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.form?.billingAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{bill.form?.total || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.form?.stateOfSupply}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No transactions to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstimateQuotation;
