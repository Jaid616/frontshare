import React, { useEffect, useState } from "react";
import { Search, Plus, ChevronDown, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import onlineStores from '../assets/onlineStores.png';
import { getBills } from "../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const SalesOrder = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
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
            (bill) => bill.billType === "orders"
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
    { id: "label", label: "NO" },
    { id: "date", label: "DATE" },
    { id: "duedate", label: "DUE DATE" },
    { id: "totalamount", label: "TOTAL AMOUNT" },
    { id: "balance", label: "BALANCE" },
    { id: "status", label: "STATUS" },
    { id: "action", label: "ACTION" },
  ];

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  // Filter bills based on search query
  const filteredBills = bills.filter((bill) => {
    const searchString = searchQuery.toLowerCase();
    return (
      bill?.form?.customer?.toLowerCase().includes(searchString) ||
      bill?.label?.toLowerCase().includes(searchString) ||
      bill?.invoiceDate?.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg shadow p-2 bg-gray-100 text-sm">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 0
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange(0)}
        >
          Sales Orders
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 1
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange(1)}
        >
          Online Orders
        </button>
      </div>

      {activeTab === 0 && (
        <div className="h-[79vh]">
          <div className="bg-white p-2 rounded h-[79vh]">
            <h2 className="text-lg font-semibold mb-4">TRANSACTIONS</h2>

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by party, number, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() =>
                  navigate("/add-sales", { state: { page: "orders" } })
                }
              >
                <Plus className="w-4 h-4" />
                Add Sale Order
              </button>
            </div>

            {/* Table with Loading State */}
            <div className="max-h-[400px] h-[350px] overflow-y-auto border rounded">
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
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.form?.customer || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.label || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.invoiceDate || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.dueDate || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{bill.total || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{bill.balance || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            {bill.status || 'Pending'}
                          </span>
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
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No transactions to show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="flex flex-col items-center justify-center h-[549px] bg-white rounded">
          <img
            src={onlineStores}
            alt="No Online Orders"
            className="w-40 h-40 mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">No Online Orders</h2>
          <p className="text-gray-600 mb-4">
            Create your online store to get orders online
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
            Create Store
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesOrder;