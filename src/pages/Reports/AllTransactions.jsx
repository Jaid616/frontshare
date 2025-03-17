import React, { useState, useEffect } from "react";
import { Printer, MoreHorizontal, Search, ArrowLeft } from "lucide-react";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const AllTransaction = () => {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] =
    useState("All Transaction");

  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [allAdditionalFields, setAllAdditionalFields] = useState({});
  const [billsAccordingTotransaction, setBillsAccordingTotransaction] =
    useState([]);

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
          setBills(existingDoc.bills);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  useEffect(() => {
    const fetchTransactionSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "transactionSettings"
        );
        if (newTransactionSettings?.data) {
          setAllAdditionalFields(newTransactionSettings.data?.additionalFields);
        }
      }
    };

    fetchTransactionSettings();
  }, [phone]);

  const filteredBills = bills.filter((bill) => {
    const matchesDate =
      dateRange.start && dateRange.end
        ? new Date(bill.form?.invoiceDate) >= new Date(dateRange.start) &&
          new Date(bill.form?.invoiceDate) <= new Date(dateRange.end)
        : true;

    const matchesSearch =
      bill.form?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id?.toString().includes(searchTerm) ||
      bill.billType?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });

  useEffect(() => {
    if (allAdditionalFields?.transaction?.length > 0 && bills?.length > 0) {
      const usedBillsWithTransactions = bills
        .map((bill) => {
          const matchingTransactions = allAdditionalFields.transaction
            .filter((txn) => Object.keys(bill.form).includes(txn.name))
            .map((txn) => ({
              name: txn.name,
              value: bill.form[txn.name], // Bill ke form se value extract karna
            }));

          return matchingTransactions.length > 0
            ? { ...bill, transactions: matchingTransactions }
            : null;
        })
        .filter(Boolean); // Null values hata dega

      console.log(
        usedBillsWithTransactions,
        allAdditionalFields,
        "🚀 Bills with Transactions (name & value)"
      );

      setBillsAccordingTotransaction(usedBillsWithTransactions);
    }
  }, [allAdditionalFields, bills]);

  const [selectedAdditionalField, setSelectedAdditionalField] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter transactions based on selected additional field
  const filteredValues = billsAccordingTotransaction
    .flatMap((bill) => bill.transactions || [])
    .filter((txn) => txn.name === selectedAdditionalField)
    .map((txn) => txn.value); // Extract values

  const handleValueToggle = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    if (selectedValues.length === filteredValues.length) {
      setSelectedValues([]);
    } else {
      setSelectedValues(filteredValues);
    }
  };

  const handleExportExcel = () => {
    // Prepare data for export (same as table structure)
    const exportData = filteredBills.map((bill, index) => ({
      "#": index + 1,
      DATE: bill.form.invoiceDate,
      "REF NO.": bill.id,
      "PARTY NAME": bill.form?.customer,
      STATE: bill.form.stateOfSupply,
      TYPE:
        bill.billType === "addsales"
          ? "Sales"
          : bill.billType === "addpurchase"
          ? "Purchase"
          : bill.billType === "estimate"
          ? "Estimate"
          : bill.billType === "orders"
          ? "Sales Order"
          : bill.billType === "deliverychallan"
          ? "Delivery Challan"
          : bill.billType === "salesreturn"
          ? "Sales Return"
          : bill.billType === "purchaseexpenses"
          ? "Expenses"
          : bill.billType === "purchaseorders"
          ? "Purchase Orders"
          : bill.billType === "purchasereturn"
          ? "Purchase Return"
          : "",
      TOTAL: `₹ ${bill.form.total || 0}`, // Ensure consistency with table
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Day Book");

    // Export to Excel file
    XLSX.writeFile(
      workbook,
      `Day_Book_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="p-6 bg-white text-sm">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-100 transition duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <select
            className="border rounded-md px-3 py-2"
            defaultValue="This Month"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>Custom</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Between</span>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border rounded-md px-3 py-2"
            />
            <span className="text-gray-600">To</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 border rounded-md px-3 py-2"
            onClick={handleExportExcel}
          >
            Excel Report
          </button>
          <button className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {/* First Dropdown: Select Transaction Type */}
        <div className="mb-4">
          <select
            className="border rounded-md px-3 py-2"
            value={selectedTransactionType}
            onChange={(e) => setSelectedTransactionType(e.target.value)}
          >
            <option value="">All Transaction</option>
            <option value="orders">Orders</option>
            <option value="purchase">Purchase</option>
            <option value="journal">Journal</option>
          </select>
        </div>

        {/* Second Dropdown: Select Additional Fields */}
        <div className="mb-4">
          <select
            className="border rounded-md px-3 py-2"
            value={selectedAdditionalField}
            onChange={(e) => setSelectedAdditionalField(e.target.value)}
          >
            <option value="">All Additional Fields</option>
            {billsAccordingTotransaction
              .flatMap((bill) => bill.transactions || [])
              .map((txn, index) => (
                <option key={index} value={txn.name}>
                  {txn.name}
                </option>
              ))}
          </select>
        </div>

        {/* Third Multi-Select Dropdown: Show Values */}
        <div className="mb-4 relative">
          <div
            className="border rounded-md px-3 py-2 cursor-pointer flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {selectedValues.length === 0
                ? "Select Values"
                : `${selectedValues.length} selected`}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              <div className="px-3 py-2 border-b flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.length === filteredValues.length}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span>Select All</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredValues.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500">No values found</div>
                ) : (
                  filteredValues.map((val, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 flex items-center"
                      onClick={() => handleValueToggle(val)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(val)}
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <span>{val}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border rounded-md px-3 py-2 w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-600">#</th>
              <th className="text-left p-3 font-medium text-gray-600">DATE</th>
              <th className="text-left p-3 font-medium text-gray-600">
                REF NO.
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                PARTY NAME
              </th>
              <th className="text-left p-3 font-medium text-gray-600">STATE</th>
              <th className="text-left p-3 font-medium text-gray-600">TYPE</th>
              <th className="text-right p-3 font-medium text-gray-600">
                TOTAL
              </th>
              <th className="text-center p-3 font-medium text-gray-600">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => (
              <tr key={bill.id || index} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{bill.form.invoiceDate}</td>
                <td className="p-3">{bill.id}</td>
                <td className="p-3">{bill.form?.customer}</td>
                <td className="p-3">{bill.form.stateOfSupply}</td>
                <td className="p-3">
                  {bill.billType === "addsales"
                    ? "Sales"
                    : bill.billType === "addpurchase"
                    ? "Purchase"
                    : bill.billType === "estimate"
                    ? "Estimate"
                    : bill.billType === "orders"
                    ? "Sales Order"
                    : bill.billType === "deliverychallan"
                    ? "Delivery Challan"
                    : bill.billType === "salesreturn"
                    ? "Sales Return"
                    : bill.billType === "purchaseexpenses"
                    ? "Expenses"
                    : bill.billType === "purchaseorders"
                    ? "Purchase Orders"
                    : bill.billType === "purchasereturn"
                    ? "Purchase Return"
                    : ""}
                </td>
                <td className="p-3 text-right">₹ {bill.form.total || 0}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTransaction;
