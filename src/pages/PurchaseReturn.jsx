import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { getBills } from "../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import db from "../config/dbConfig";
import { decodeToken } from "../DecodeToken";

const PurchaseReturn = () => {
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-01-31"));
  const [dateFilter, setDateFilter] = useState("this-month");
  const [firmFilter, setFirmFilter] = useState("all-firms");
  const [typeFilter, setTypeFilter] = useState("debit-note");
  const [paymentFilter, setPaymentFilter] = useState("all-payment");
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
            (bill) => bill.billType === "purchasereturn"
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

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    const today = new Date();

    if (value === "this-month") {
      setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setEndDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    } else if (value === "last-month") {
      setStartDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      setEndDate(new Date(today.getFullYear(), today.getMonth(), 0));
    }
  };

  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.invoiceDate);
    const matchesDateRange = billDate >= startDate && billDate <= endDate;

    const matchesSearch =
      bill?.form.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill?.form.invoiceNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      bill.label?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPaymentType =
      paymentFilter === "all-payment" || bill.paymentType === paymentFilter;

    return matchesDateRange && matchesSearch && matchesPaymentType;
  });

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + (bill.tax?.total || 0),
    0
  );
  const totalBalance = filteredBills.reduce(
    (sum, bill) => sum + (bill.balance || 0),
    0
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatus = (bill) => {
    if (!bill.balance || bill.balance === 0) return "Paid";
    const dueDate = new Date(bill.dueDate);
    return dueDate < new Date() ? "Overdue" : "Pending";
  };

  return (
    <div className="w-full bg-gray-100 p-2 h-[90vh]">
      <div className="w-full bg-white shadow-sm rounded-lg">
        <div className="p-4 h-[86vh]">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <select
                className="w-40 text-sm border-gray-300 rounded-sm p-1"
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
              </select>

              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-40 text-sm border-gray-300 rounded-sm p-1"
                  dateFormat="yyyy-MM-dd"
                />
                <span className="text-gray-600 text-sm">To</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-40 text-sm border-gray-300 rounded-sm p-1"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <select
                className="w-40 text-sm border-gray-300 rounded-sm p-1"
                value={firmFilter}
                onChange={(e) => setFirmFilter(e.target.value)}
              >
                <option value="all-firms">ALL FIRMS</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm border border-gray-300 rounded-sm py-1 px-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Excel Report
              </button>
              <button className="flex items-center gap-1 text-sm border border-gray-300 rounded-sm py-1 px-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <select
              className="w-40 text-sm border-gray-300 rounded-sm p-1"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="debit-note">Debit Note</option>
            </select>

            <select
              className="w-40 text-sm border-gray-300 rounded-sm p-1"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all-payment">All Payment</option>
              <option value="cash">Cash</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="w-64 text-sm border-gray-300 rounded-sm p-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded text-sm"
              onClick={() =>
                navigate("/add-sales", { state: { page: "purchasereturn" } })
              }
            >
              + Add Purchase Return
            </button>
          </div>

          {filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                No data is available for Debit Note.
              </p>
              <p className="text-gray-400 text-sm">
                Please try again after making relevant changes.
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-11 gap-4 bg-gray-50 p-2 rounded mb-2 text-sm">
                <div className="font-medium">#</div>
                <div className="font-medium">DATE</div>
                <div className="font-medium">REF NO.</div>
                <div className="font-medium">PARTY NAME</div>
                <div className="font-medium">CATEGORY</div>
                <div className="font-medium">TYPE</div>
                <div className="font-medium">TOTAL</div>
                <div className="font-medium">RECEIVED</div>
                <div className="font-medium">BALANCE</div>
                <div className="font-medium">DUE DATE</div>
                <div className="font-medium">STATUS</div>
              </div>

              {/* Table Body */}
              {bills.map((bill, index) => (
                <div
                  key={bill._id || index}
                  className="grid grid-cols-11 gap-4 p-2 text-sm border-b hover:bg-gray-50"
                >
                  <div>{index + 1}</div>
                  <div>{formatDate(bill.invoiceDate)}</div>
                  <div>{bill.form.invoiceNumber}</div>
                  <div>{bill.form.customer}</div>
                  <div>{bill.billType}</div>
                  <div>{bill.paymentType}</div>
                  <div>₹{bill.tax?.total || 0}</div>
                  <div>₹{(bill.tax?.total || 0) - (bill.balance || 0)}</div>
                  <div>₹{bill.balance || 0}</div>
                  <div>{formatDate(bill.dueDate)}</div>
                  <div
                    className={`${
                      getStatus(bill) === "Paid"
                        ? "text-green-500"
                        : getStatus(bill) === "Overdue"
                        ? "text-red-500"
                        : "text-orange-500"
                    }`}
                  >
                    {getStatus(bill)}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm">
            <div>Total Amount: ₹{totalAmount.toFixed(2)}</div>
            <div>Balance: ₹{totalBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturn;
