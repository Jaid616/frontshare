import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBills } from "../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const HighlightedText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="bg-yellow-100">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

const Expenses = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [categorySearch, setCategorySearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bills, setBills] = useState([]);
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
        setBills(existingDoc?.expenses);
      }
    };
    fetchExpenses();
  }, [phone]);

  // Process bills data to create categories
  const processCategories = () => {
    const categoryMap = new Map();

    bills.forEach((bill) => {
      const category = bill.form?.customer || "Uncategorized";
      const amount = bill.total || 0;

      if (categoryMap.has(category)) {
        categoryMap.get(category).amount += amount;
      } else {
        categoryMap.set(category, {
          name: category,
          amount: amount,
          type: amount > 500 ? "Direct" : "Indirect", // Example classification logic
        });
      }
    });

    return Array.from(categoryMap.values());
  };

  const categories = processCategories();

  // Process bills data to create expenses
  const processExpenses = () => {
    return bills.map((bill) => ({
      date: bill.invoiceDate || "",
      party: bill.form?.customer || "",
      paymentType: bill.paymentType || "Cash",
      amount: bill.total || 0,
      balance: bill.total - (bill.received || 0),
      dueDate: bill.dueDate || "",
      status: bill.status || "Pending",
      category: bill.form?.customer || "Uncategorized",
    }));
  };

  const expenses = processExpenses();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isFilterOpen) setIsFilterOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(categorySearch.toLowerCase());

    if (filterType === "All") {
      return matchesSearch;
    } else if (filterType === "Direct") {
      return category.type === "Direct" && matchesSearch;
    } else if (filterType === "Indirect") {
      return category.type === "Indirect" && matchesSearch;
    }
    return false;
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      (!selectedCategory || expense.category === selectedCategory?.name) &&
      expense.party.toLowerCase().includes(expenseSearch.toLowerCase())
  );

  const renderHeaderContent = () => {
    if (isSearchOpen) {
      return (
        <div className="flex items-center w-full gap-1">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Categories"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />
          <button
            onClick={toggleSearch}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      );
    }

    if (isFilterOpen) {
      return (
        <div className="flex items-center w-full gap-1">
          <div className="relative w-full">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-3 py-2 text-sm text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterType}
            </button>
            {dropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilterType("All");
                    setDropdownOpen(false);
                  }}
                >
                  All
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilterType("Direct");
                    setDropdownOpen(false);
                  }}
                >
                  Direct
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFilterType("Indirect");
                    setDropdownOpen(false);
                  }}
                >
                  Indirect
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleFilter}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={toggleSearch}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/add-expenses")}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-[80vh] p-1 bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 mr-1 bg-white rounded-lg shadow-md h-[85vh]">
        <div className="flex items-center mb-4">
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold">Expense Categories</span>
        </div>

        <p className="mb-4 text-xs text-gray-500">
          Manage and track your expenses by categories
        </p>

        {renderHeaderContent()}

        <div className="overflow-x-auto mb-2 mt-2 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-xs text-left">Category</th>
                <th className="px-4 py-2 text-xs text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedCategory?.name === category.name ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-2 text-xs">
                    <HighlightedText
                      text={category.name}
                      highlight={categorySearch}
                    />
                  </td>
                  <td className="px-4 py-2 text-xs text-red-500">
                    ₹{category.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Category Details */}
        <div className="p-4 mb-2 bg-white rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold">
              {selectedCategory?.name || "Select a category"}
            </span>
            <span className="text-xs text-gray-500">
              {selectedCategory?.type} Expense
            </span>
          </div>

          <div className="flex justify-between p-4 bg-gray-50 rounded">
            <span className="text-xs">
              Total: ₹{selectedCategory?.amount || 0}
            </span>
            <span className="text-xs">
              Balance: ₹{selectedCategory?.amount || 0}
            </span>
          </div>
        </div>

        {/* Expenses List */}
        <div className="p-6 bg-white rounded-lg shadow-md h-[65.5vh]">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold">Expenses</span>

            <input
              type="text"
              placeholder="Search Expenses"
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-xs text-left">Date</th>
                  <th className="px-4 py-2 text-xs text-left">Party</th>
                  <th className="px-4 py-2 text-xs text-left">Payment Type</th>
                  <th className="px-4 py-2 text-xs text-left">Amount</th>
                  <th className="px-4 py-2 text-xs text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-xs">{expense.date}</td>
                    <td className="px-4 py-2 text-xs">{expense.party}</td>
                    <td className="px-4 py-2 text-xs">{expense.paymentType}</td>
                    <td className="px-4 py-2 text-xs text-red-500">
                      ₹{expense.amount}
                    </td>
                    <td
                      className={`px-4 py-2 text-xs ${
                        expense.status === "Paid"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {expense.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
