import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const PurchaseBills = () => {
  const navigate = useNavigate();
  const [billType] = useState("addpurchase");
  const [timePeriod, setTimePeriod] = useState("All Purchase Invoices");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
            (bill) => bill.billType === "addpurchase"
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

  useEffect(() => {
    filterBills();
  }, [bills, startDate, endDate, timePeriod]);

  const filterBills = () => {
    let filtered = [...bills];

    if (startDate && endDate) {
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.invoiceDate);
        return billDate >= new Date(startDate) && billDate <= new Date(endDate);
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );
    const firstDayOfQuarter = new Date(
      today.getFullYear(),
      Math.floor(today.getMonth() / 3) * 3,
      1
    );
    const lastDayOfQuarter = new Date(firstDayOfQuarter);
    lastDayOfQuarter.setMonth(firstDayOfQuarter.getMonth() + 3, 0);
    const firstDayOfLastQuarter = new Date(firstDayOfQuarter);
    firstDayOfLastQuarter.setMonth(firstDayOfQuarter.getMonth() - 3);
    const lastDayOfLastQuarter = new Date(firstDayOfQuarter);
    lastDayOfLastQuarter.setDate(0);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    switch (timePeriod) {
      case "Today":
        filtered = filtered.filter(
          (bill) =>
            new Date(bill.invoiceDate).toDateString() === today.toDateString()
        );
        break;
      case "This Month":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.invoiceDate);
          return billDate >= firstDayOfMonth && billDate <= lastDayOfMonth;
        });
        break;
      case "Last Month":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.invoiceDate);
          return (
            billDate >= firstDayOfLastMonth && billDate <= lastDayOfLastMonth
          );
        });
        break;
      case "This Quarter":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.invoiceDate);
          return billDate >= firstDayOfQuarter && billDate <= lastDayOfQuarter;
        });
        break;
      case "Last Quarter":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.invoiceDate);
          return (
            billDate >= firstDayOfLastQuarter &&
            billDate <= lastDayOfLastQuarter
          );
        });
        break;
      case "This Year":
        filtered = filtered.filter((bill) => {
          const billDate = new Date(bill.invoiceDate);
          return billDate >= firstDayOfYear;
        });
        break;
      case "Custom":
        break;
      default:
        break;
    }

    setFilteredBills(filtered);
  };

  const calculateSummary = () => {
    return filteredBills.reduce(
      (acc, bill) => {
        const amount = parseFloat(bill.total) || 0;
        if (bill.status === "Paid") {
          acc.paid += amount;
        } else if (bill.status === "Unpaid") {
          acc.unpaid += amount;
        }
        if (new Date(bill.dueDate) < new Date()) {
          acc.overdue += amount;
        }
        acc.total += amount;
        return acc;
      },
      { paid: 0, unpaid: 0, overdue: 0, total: 0 }
    );
  };

  const summary = calculateSummary();

  return (
    <div className="p-2 bg-gray-100 min-h-screen text-sm w-full">
      {/* Header Filters */}
      <div className="bg-white rounded-lg shadow-md p-2 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timePeriod}
          </button>
          {dropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-20">
              {[
                "All Sale Invoices",
                "Today",
                "This Month",
                "Last Month",
                "This Quarter",
                "Last Quarter",
                "This Year",
                "Custom",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTimePeriod(option);
                    setDropdownOpen(false);
                    if (option !== "Custom") {
                      setStartDate("");
                      setEndDate("");
                    }
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setTimePeriod("Custom");
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={timePeriod !== "Custom"}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setTimePeriod("Custom");
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={timePeriod !== "Custom"}
        />
        <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Firm1">Firm1</option>
          <option value="Firm2">Firm2</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="my-4 grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <p className="font-semibold text-green-800">Paid</p>
          <h2 className="text-lg font-bold text-green-900">
            ₹ {summary.paid.toFixed(2)}
          </h2>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <p className="font-semibold text-blue-800">Unpaid</p>
          <h2 className="text-lg font-bold text-blue-900">
            ₹ {summary.unpaid.toFixed(2)}
          </h2>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <p className="font-semibold text-red-800">Overdue</p>
          <h2 className="text-lg font-bold text-red-900">
            ₹ {summary.overdue.toFixed(2)}
          </h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <p className="font-semibold text-yellow-800">Total</p>
          <h2 className="text-lg font-bold text-yellow-900">
            ₹ {summary.total.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* Transactions Table with Fixed Height and Scrollbars */}
      <div className="bg-white rounded-lg shadow-md p-4 h-[62vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Transactions</h3>
          <button
            onClick={() =>
              navigate("/add-sales", { state: { page: "addpurchase" } })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Purchase
          </button>
        </div>
        {/* Table Container with Both Scrollbars */}
        <div className="relative flex-1 -mx-4">
          <div className="absolute inset-0 overflow-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {[
                      "Date",
                      "Invoice No.",
                      "Party Name",
                      "Transaction Type",
                      "Payment Type",
                      "Amount",
                      "Balance",
                      "Due Date",
                      "Status",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.invoiceDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.form?.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.form?.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.billType === "addsales" && "Sales"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.paymentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`${
                            transaction.status === "Paid"
                              ? "text-green-500"
                              : "text-red-500"
                          } font-semibold`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Edit
                          </button>
                          <button className="px-3 py-1 border border-red-300 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBills;
