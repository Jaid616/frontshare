import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBills } from "../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const DeliveryChallan = () => {
  const navigate = useNavigate();
  const [billType] = useState("deliverychallan");
  const [searchTerm, setSearchTerm] = useState("");
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
            (bill) => bill.billType === "deliverychallan"
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

  const columns = [
    { id: "party", label: "PARTY" },
    { id: "no", label: "NO" },
    { id: "date", label: "DATE" },
    { id: "duedate", label: "DUE DATE" },
    { id: "totalamount", label: "TOTAL AMOUNT" },
    { id: "balance", label: "BALANCE" },
    { id: "status", label: "STATUS" },
    { id: "action", label: "ACTION" },
  ];

  // Filter bills based on search term
  const filteredBills = bills.filter((bill) =>
    Object.values(bill).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="h-[calc(100vh-32px)] w-full max-w-7xl mx-auto rounded-lg shadow p-2 bg-gray-100 text-sm flex flex-col">
      {/* Headline */}
      <h1 className="text-center text-lg font-bold mb-2">Delivery Challan</h1>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-white p-6 rounded-lg flex flex-col">
          <h2 className="text-lg font-semibold mb-6">TRANSACTIONS</h2>

          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() =>
                navigate("/add-sales", { state: { page: "deliverychallan" } })
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              Add Delivery Challan
            </button>
          </div>

          {/* Table with Loading State */}
          <div className="flex-1 overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b sticky top-0 bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.id !== "action" && (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-gray-500 border-b"
                    >
                      No transactions to show
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr
                      key={bill._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 border-b">
                        {bill.form.customer}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {bill.form.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {formatDate(bill.invoiceDate)}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {formatDate(bill.dueDate)}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {formatCurrency(bill.total)}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {formatCurrency(bill.balance)}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bill.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bill.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <button
                          onClick={() => navigate(`/bill/${bill._id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {error && (
            <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryChallan;
