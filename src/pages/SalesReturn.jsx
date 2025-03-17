import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBills } from "../Redux/billSlice";
import {
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  Calendar,
} from "lucide-react";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const SalesReturn = () => {
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-01-31",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    period: "thisMonth",
    firm: "all",
    documentType: "salesReturn",
    payment: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Dropdown states
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isFirmOpen, setIsFirmOpen] = useState(false);
  const [isDocTypeOpen, setIsDocTypeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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
            (bill) => bill.billType === "salesreturn"
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

  const filterBills = (bills) => {
    return bills.filter((bill) => {
      const matchesSearch =
        bill.form?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange =
        new Date(bill.invoiceDate) >= new Date(dateRange.start) &&
        new Date(bill.invoiceDate) <= new Date(dateRange.end);

      return matchesSearch && matchesDateRange;
    });
  };

  const sortBills = (bills) => {
    if (!sortConfig.key) return bills;

    return [...bills].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredAndSortedBills = sortBills(filterBills(bills));

  const Loader = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const columns = [
    { id: "number", label: "#", sortable: false },
    { id: "invoiceDate", label: "DATE", sortable: true },
    { id: "label", label: "REF NO.", sortable: true },
    { id: "customer", label: "PARTY NAME", sortable: true },
    { id: "billType", label: "CATEGORY", sortable: true },
    { id: "paymentType", label: "TYPE", sortable: true },
    { id: "total", label: "TOTAL", sortable: true },
    { id: "received", label: "RECEIVED", sortable: true },
    { id: "balance", label: "BALANCE", sortable: true },
    { id: "dueDate", label: "DUE DATE", sortable: true },
    { id: "status", label: "STATUS", sortable: true },
    { id: "print", label: "PRINT", sortable: false },
  ];

  const Dropdown = ({
    value,
    options,
    onChange,
    placeholder,
    isOpen,
    setIsOpen,
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || placeholder}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[98%] ml-0 max-w-7xl mx-auto">
      <div className="bg-white h-[88vh] rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-32">
                <Dropdown
                  value={filters.period}
                  options={[
                    { value: "thisMonth", label: "This Month" },
                    { value: "lastMonth", label: "Last Month" },
                    { value: "custom", label: "Custom Range" },
                  ]}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, period: value }))
                  }
                  placeholder="Period"
                  isOpen={isPeriodOpen}
                  setIsOpen={setIsPeriodOpen}
                />
              </div>

              <span className="text-sm text-gray-500">Between</span>

              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <span className="text-sm text-gray-500">To</span>

              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="w-32">
                <Dropdown
                  value={filters.firm}
                  options={[{ value: "all", label: "ALL FIRMS" }]}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, firm: value }))
                  }
                  placeholder="Firm"
                  isOpen={isFirmOpen}
                  setIsOpen={setIsFirmOpen}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel Report
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Dropdown
                value={filters.documentType}
                options={[{ value: "salesReturn", label: "Sales Return" }]}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, documentType: value }))
                }
                placeholder="Document Type"
                isOpen={isDocTypeOpen}
                setIsOpen={setIsDocTypeOpen}
              />
            </div>

            <div className="w-48">
              <Dropdown
                value={filters.payment}
                options={[{ value: "all", label: "All Payment" }]}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, payment: value }))
                }
                placeholder="Payment"
                isOpen={isPaymentOpen}
                setIsOpen={setIsPaymentOpen}
              />
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() =>
                navigate("/add-sales", { state: { page: "salesreturn" } })
              }
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Sales Return
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && (
                          <Filter className="h-4 w-4 cursor-pointer" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.length > 0 ? (
                  bills.map((bill, index) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.form?.invoiceDate}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.label}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.form?.customer}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        Sales Return
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.form?.paymentType}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ₹{bill.form?.total || 0}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ₹{bill.form?.received || 0}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ₹{(bill.form?.total || 0) - (bill.received || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.dueDate || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {bill.status || "Pending"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <button className="text-gray-400 hover:text-gray-500">
                          <Printer className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="h-12 w-12 text-gray-300" />
                        <p className="text-sm text-gray-500">
                          No data is available for Sales Return.
                        </p>
                        <p className="text-sm text-gray-500">
                          Please try again after making relevant changes.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>
              Total Amount: ₹
              {filteredAndSortedBills
                .reduce((sum, bill) => sum + (bill.total || 0), 0)
                .toFixed(2)}
            </span>
            <span>
              Balance: ₹
              {filteredAndSortedBills
                .reduce(
                  (sum, bill) =>
                    sum + ((bill.total || 0) - (bill.received || 0)),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReturn;
