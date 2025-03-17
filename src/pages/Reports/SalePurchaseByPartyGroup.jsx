import React, { useEffect, useState } from "react";
import { ArrowLeft, FileSpreadsheet, Printer, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const SalePurchaseByPartyGroup = () => {
  const [bills, setBills] = useState([]);
  const [parties, setParties] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-01-31",
  });
  const [selectedFirm, setSelectedFirm] = useState("All Firms");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

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
          setBills(existingDoc?.bills);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  useEffect(() => {
    const fetchParties = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setParties(existingDoc.parties);
      }
    };
    fetchParties();
  }, [phone]);

  useEffect(() => {
    processGroupData();
  }, [bills, parties, searchQuery, dateRange, selectedFirm]);

  const processGroupData = () => {
    if (!bills || !parties) return;

    // Create data for the General group
    let generalGroup = {
      groupName: "General",
      saleAmount: 0,
      purchaseAmount: 0,
      parties: [], // Store parties for reference if needed
    };

    bills.forEach((bill) => {
      const party = parties.find((p) => p.partyName === bill.form.customer);
      if (!party) return;

      const isSale = bill.billType === "addsales";
      const isPurchase = bill.billType === "addpurchase";

      if (isSale) {
        generalGroup.saleAmount += Number(bill.form?.total || 0);
      } else if (isPurchase) {
        generalGroup.purchaseAmount += Number(bill.form?.total || 0);
      }

      // Add party to the group if not already included
      if (!generalGroup.parties.find((p) => p.partyId === party.partyId)) {
        generalGroup.parties.push(party);
      }
    });

    // Apply search filter if any
    let processedData = [generalGroup];
    if (searchQuery) {
      processedData = processedData.filter((group) =>
        group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply firm filter if needed
    if (selectedFirm !== "All Firms") {
      processedData = processedData.filter((group) => {
        return group.parties.some((party) => party.firm === selectedFirm);
      });
    }

    setFilteredData(processedData);
  };

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, curr) => ({
      saleAmount: acc.saleAmount + curr.saleAmount,
      purchaseAmount: acc.purchaseAmount + curr.purchaseAmount,
    }),
    {
      saleAmount: 0,
      purchaseAmount: 0,
    }
  );

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Implement period logic here (This Month, Last Month, etc.)
    // Update dateRange accordingly
  };

  const handleExcelReport = () => {
    const excelReport = filteredData.map((group) => ({
      "GROUP NAME": group.groupName,
      "SALE AMOUNT": group.saleAmount.toFixed(2),
      "PURCHASE AMOUNT": group.purchaseAmount.toFixed(2),
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelReport);
        
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sale Purchase by Party Group");
            XLSX.writeFile(
              workbook,
              `Sales_Purchase_by_party_group_${new Date().toISOString().split("T")[0]}.xlsx`
            );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="bg-white rounded-lg shadow h-[80vh]">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Custom</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 gap-2 text-sm">
                <span className="text-gray-600">Between</span>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="border rounded-md px-2 py-1"
                />
                <span className="text-gray-600">To</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="border rounded-md px-2 py-1"
                />
              </div>

              <select
                className="border rounded-md px-3 py-2 text-sm uppercase"
                value={selectedFirm}
                onChange={(e) => setSelectedFirm(e.target.value)}
              >
                <option>ALL FIRMS</option>
                {/* Add firm options here */}
              </select>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center text-blue-600 hover:text-blue-700" onClick={handleExcelReport}>
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel Report
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-700">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 text-lg font-medium">
          SALE PURCHASE BY PARTY GROUP
        </div>

        <div className="p-4">
          <input
            type="search"
            placeholder="Search..."
            className="border rounded-md px-3 py-2 w-64 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y">
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  GROUP NAME
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-600">
                  SALE AMOUNT
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-600">
                  PURCHASE AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((group) => (
                  <tr key={group.groupName} className="border-b">
                    <td className="p-4">{group.groupName}</td>
                    <td className="p-4 text-right">
                      ₹ {group.saleAmount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      ₹ {group.purchaseAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="w-16 h-16 text-gray-300" />
                      <div className="text-gray-500">
                        <p>
                          No data is available for Sale Purchase Group Report.
                        </p>
                        <p>Please try again after making relevant changes.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between text-sm">
            <div className="text-gray-600">
              Total Sale Amount: ₹ {totals.saleAmount.toFixed(2)}
            </div>
            <div className="text-red-600">
              Total Purchase Amount: ₹ {totals.purchaseAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePurchaseByPartyGroup;
