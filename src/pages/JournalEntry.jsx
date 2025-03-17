import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  X,
  Calendar,
  ChevronDown,
  Trash2,
  Search,
} from "lucide-react";
import Logo from "../assets/JournalEntry.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const JournalEntry = () => {
  const [journalentries, setJournalEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("Custom");
  const [dateRange, setDateRange] = useState({
    from: "01/04/2024",
    to: "10/01/2025",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([
    { id: 1, account: "", credit: "0.00", debit: "0.00" },
    { id: 2, account: "", credit: "0.00", debit: "0.00" },
  ]);
  const [description, setDescription] = useState("");
  const [journalDate, setJournalDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [phone, setPhone] = useState(null);
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {}
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setJournalEntries(existingDoc?.journalEntries || []);
      }
    };
  }, [phone, isModalOpen]);

  const accountOptions = [
    {
      category: "Input Duties & Taxes",
      items: [
        "Input GST",
        "Input CGST",
        "Input SGST",
        "Input IGST",
        "TCS Receivable",
      ],
    },
  ];

  const handleSave = async () => {
    const entries = rows.map((row) => ({
      account: row.account,
      credit: parseFloat(row.credit || 0),
      debit: parseFloat(row.debit || 0),
    }));

    // Validate entries (same logic as API)
    if (entries.length < 2) {
      console.error("Minimum 2 entries required");
      return;
    }

    const totals = entries.reduce(
      (acc, entry) => ({
        credit: acc.credit + Number(entry.credit || 0),
        debit: acc.debit + Number(entry.debit || 0),
      }),
      { credit: 0, debit: 0 }
    );

    if (Math.abs(totals.credit - totals.debit) > 0.01) {
      console.error("Total debits must equal total credits");
      return;
    }

    const journalData = {
      date: journalDate,
      description,
      entries,
    };

    try {
      const existingDoc = await db.get(phone);
      if (!existingDoc.journalEntries) {
        existingDoc.journalEntries = [];
      }

      existingDoc.journalEntries.push(journalData);
      await db.put(existingDoc);
      toast.success("Journal Entry added successfully")
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    }
  };

  const addRow = () => {
    const newId = rows.length + 1;
    setRows([
      ...rows,
      { id: newId, account: "", credit: "0.00", debit: "0.00" },
    ]);
  };

  const deleteRow = (id) => {
    if (rows.length > 2) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const calculateTotals = () => {
    return rows.reduce(
      (acc, row) => ({
        totalCredit: acc.totalCredit + Number(row.credit),
        totalDebit: acc.totalDebit + Number(row.debit),
      }),
      { totalCredit: 0, totalDebit: 0 }
    );
  };

  const filterEntries = () => {
    if (!journalentries) return [];

    let filtered = [...journalentries];

    if (searchQuery) {
      filtered = filtered.filter((entry) =>
        entry.entries.some(
          (e) =>
            e.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.referenceNumber?.toString().includes(searchQuery)
        )
      );
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const FilterDropdown = () => (
    <div className="relative">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border rounded-md px-3 py-1 text-sm appearance-none pr-8"
      >
        <option value="All">All</option>
        <option value="This Month">This Month</option>
        <option value="Last Month">Last Month</option>
        <option value="This Quarter">This Quarter</option>
        <option value="This Year">This Year</option>
        <option value="Custom">Custom</option>
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700">Journal Entry</h1>
        {journalentries && journalentries.length > 0 && (
          <div className="flex items-center gap-4">
            <button className="p-2 border rounded-md">
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.aCpcPok6nvkdSH5Yk1nQMgHaHa&pid=Api&P=0&h=180"
                alt="Excel"
                className="w-5 h-5"
              />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Journal Entry
            </button>
          </div>
        )}
      </div>

      {journalentries && journalentries.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Filter By :</span>
                <FilterDropdown />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                  <span className="text-sm">To</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="border rounded-md px-3 py-1 text-sm"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border rounded-md pl-8 pr-3 py-1 text-sm"
                  />
                  <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Reference No</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Accounts</th>
                    <th className="p-3 text-right">Credit</th>
                    <th className="p-3 text-right">Debit</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterEntries().map((entry) => (
                    <tr key={entry._id} className="border-t">
                      <td className="p-3">{formatDate(entry.journalDate)}</td>
                      <td className="p-3">{entry.referenceNumber}</td>
                      <td className="p-3">{entry.description}</td>
                      <td className="p-3">
                        {entry.entries.map((e) => e.account).join(", ")}
                      </td>
                      <td className="p-3 text-right">
                        {entry.entries
                          .reduce((sum, e) => sum + (e.credit || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        {entry.entries
                          .reduce((sum, e) => sum + (e.debit || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // Empty state UI
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-8">
            Now create journal vouchers in Paper Bill to manage end to end
            <br />
            accounting on Paper Bill app
          </p>

          <div className="w-64 mx-auto mb-8">
            <img src={Logo} alt="Journal Entry" className="w-full h-auto" />
          </div>

          <div className="mb-8 text-gray-700">
            <p className="font-medium mb-2 text-sm">
              Journal vouchers are used to handle accounting transactions that
              generally do not occur on a day-to-day basis.
            </p>
            <p className="text-sm">
              They are manual entries in account books and are used for
              adjustments, equity management, or any other entry that
              <br />
              cannot be handled by standard entries like sales, purchases,
              payments,etc.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center justify-center mx-auto mb-6 text-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Journal Entry
          </button>

          <div className="bg-amber-50 border border-amber-100 p-4 text-sm text-gray-700">
            <span className="font-medium">Warning Message! </span>
            This module is meant for users proficient in accounting entries.
            Please use this only if you have detailed knowledge on Credit-Debit
            system of accounting.
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Journal Entry</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Reference number
                  </label>
                  <input
                    type="text"
                    value="JE-1"
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Journal Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={journalDate}
                      onChange={(e) => setJournalDate(e.target.value)}
                      className="w-full p-2 border rounded-md pr-10 text-sm"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mb-4">
                <div className="grid grid-cols-12 gap-4 mb-2 bg-gray-50 p-2 rounded-t-md">
                  <div className="col-span-1 text-sm text-gray-600">#</div>
                  <div className="col-span-6 text-sm text-gray-600">
                    ACCOUNT
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 text-right">
                    CREDIT
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 text-right">
                    DEBIT
                  </div>
                  <div className="col-span-1"></div>
                </div>

                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-12 gap-4 mb-2">
                    <div className="col-span-1 py-2 text-sm">{row.id}</div>
                    <div className="col-span-6">
                      <div className="relative">
                        <select
                          className="w-full p-2 border rounded-md appearance-none text-sm"
                          value={row.account}
                          onChange={(e) => {
                            const newRows = rows.map((r) =>
                              r.id === row.id
                                ? { ...r, account: e.target.value }
                                : r
                            );
                            setRows(newRows);
                          }}
                        >
                          <option value="">Select A/C</option>
                          {accountOptions.map((category) => (
                            <optgroup
                              key={category.category}
                              label={category.category}
                            >
                              {category.items.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={row.credit}
                        onChange={(e) => {
                          const newRows = rows.map((r) =>
                            r.id === row.id
                              ? { ...r, credit: e.target.value }
                              : r
                          );
                          setRows(newRows);
                        }}
                        className="w-full p-2 border rounded-md text-right text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={row.debit}
                        onChange={(e) => {
                          const newRows = rows.map((r) =>
                            r.id === row.id
                              ? { ...r, debit: e.target.value }
                              : r
                          );
                          setRows(newRows);
                        }}
                        className="w-full p-2 border rounded-md text-right text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {rows.length > 2 && (
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Row Button */}
                <button
                  onClick={addRow}
                  className="text-blue-500 hover:text-blue-600 mt-2 text-sm flex items-center"
                >
                  <PlusCircle className="w-4 h-4 inline-block mr-1" />
                  Add Row
                </button>

                {/* Totals */}
                <div className="grid grid-cols-12 gap-4 mt-4 border-t pt-2">
                  <div className="col-span-7"></div>
                  <div className="col-span-2 text-right font-medium text-sm">
                    {calculateTotals().totalCredit?.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right font-medium text-sm">
                    {calculateTotals().totalDebit?.toFixed(2)}
                  </div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description here"
                  className="w-full p-2 border rounded-md h-24 resize-none text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    handleSave();
                    setRows([
                      { id: 1, account: "", credit: "0.00", debit: "0.00" },
                      { id: 2, account: "", credit: "0.00", debit: "0.00" },
                    ]);
                    setDescription("");
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm"
                >
                  Save & New [Ctrl+N]
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Save [Ctrl+S]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
