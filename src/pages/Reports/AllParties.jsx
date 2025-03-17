import React, { useEffect, useState } from "react";
import { ArrowLeft, FileSpreadsheet, Printer } from "lucide-react";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";
import * as XLSX from "xlsx";

const AllParties = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [filteredParties, setFilteredParties] = useState(parties || []); // Ensure default value as an empty array

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
    const fetchAllParties = async () => {
      console.log("This is our Parties", phone);
      if (phone) {
        try {
          const existingDoc = await db.get(phone);

          if (existingDoc?.parties) {
            setParties(existingDoc.parties);
          } else {
            setParties([]); // Avoid undefined errors
          }
        } catch (error) {
          console.error("Error fetching parties:", error);
          setParties([]);
        }
      } else {
        setParties([]);
      }
    };

    fetchAllParties();
  }, [phone]);

  const handlePartyChange = (e) => {
    setSelectedParty(e.target.value);
  };

  useEffect(() => {
    // When `selectedParty` changes, filter parties
    if (selectedParty) {
      const selectedParties = parties.filter(
        (item) => item.balanceType === selectedParty
      );
      setFilteredParties(selectedParties);
    } else {
      // If no filter is selected, show all parties
      setFilteredParties(parties);
    }
  }, [selectedParty, parties]);

  // Calculate total receivable and payable
  const totalReceivable = filteredParties
    .filter((party) => party.balanceType === "to-receive")
    .reduce((total, party) => total + parseFloat(party.openingBalance || 0), 0);

  const totalPayable = filteredParties
    .filter((party) => party.balanceType === "to-pay")
    .reduce((total, party) => total + parseFloat(party.openingBalance || 0), 0);

  const handleExportExcel = () => {
    const exportData = filteredParties.map((party, index) => ({
      "#": index + 1,
      "PARTY NAME": party.partyName,
      EMAIL: party.partyEmail,
      "PHONE NO.": party.partyPhone,
      "RECEIVABLE BALANCE":
        party.balanceType === "to-receive" ? `₹${party.openingBalance}` : "",
      "PAYABLE BALANCE":
        party.balanceType === "to-pay" ? `₹${party.openingBalance}` : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Party Balances");
    XLSX.writeFile(
      workbook,
      `Party_Balances_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 text-sm">
      <button
        onClick={() => window.history.back()}
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                onChange={() => setShowDateFilter(!showDateFilter)}
              />
              <span>Date Filter</span>
            </div>

            <select
              className="w-48 block appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 text-sm"
              value={selectedParty}
              onChange={handlePartyChange}
            >
              <option value="">All Parties</option>
              <option value="to-receive">Receivable</option>
              <option value="to-pay">Payable</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet className="w-5 h-5 mr-1" />
              Excel Report
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Printer className="w-5 h-5 mr-1" />
              Print
            </button>
          </div>
        </div>

        {/* Date Filter Fields */}
        {showDateFilter && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <label>From:</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label>To:</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="search"
            placeholder="Search..."
            className="border rounded-md px-3 py-2 w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-8 p-3">
                  <input type="checkbox" className="form-checkbox h-4 w-4" />
                </th>
                <th className="w-8 p-3 text-left">#</th>
                <th className="p-3 text-left">PARTY NAME</th>
                <th className="p-3 text-left">EMAIL</th>
                <th className="p-3 text-left">PHONE NO.</th>
                <th className="p-3 text-left">RECEIVABLE BALANCE</th>
                <th className="p-3 text-left">PAYABLE BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.map((party) => (
                <tr key={party.id} className="hover:bg-blue-50">
                  <td className="p-3">
                    <input type="checkbox" className="form-checkbox h-4 w-4" />
                  </td>
                  <td className="p-3">{party.partyId}</td>
                  <td className="p-3">{party.partyName}</td>
                  <td className="p-3">{party.partyEmail}</td>
                  <td className="p-3">{party.partyPhone}</td>
                  <td className="p-3">
                    {party.balanceType === "to-receive" && party.openingBalance}
                  </td>
                  <td className="p-3">
                    {party.balanceType === "to-pay" && party.openingBalance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between text-sm">
          <div>Total Receivable: ₹ {totalReceivable.toFixed(2)}</div>
          <div>Total Payable: ₹ {totalPayable.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default AllParties;
