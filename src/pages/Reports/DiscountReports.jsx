import React, { useEffect, useState } from "react";
import { Calendar, Download } from "lucide-react";
import { getBills } from "../../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../../DecodeToken";
import db from "../../config/dbConfig";
import * as XLSX from 'xlsx';

const DiscountReport = () => {
  const [fromDate, setFromDate] = useState("01/01/2025");
  const [toDate, setToDate] = useState("21/01/2025");
  const [partyBills, setPartyBills] = useState([]);
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
        const existingDoc = await db.get(phone);
        setBills(existingDoc?.bills);
      }
    };
    fetchBills();
  }, [phone]);

  useEffect(() => {
    if (bills && bills.length > 0) {
      // Group bills by partyId
      const billsByParty = bills.reduce((acc, bill) => {
        const partyId = bill.form?.customer;
        if (!partyId) return acc;

        if (!acc[partyId]) {
          acc[partyId] = {
            partyId,
            partyName: bill.form?.customer || "Unknown Party",
            bills: [],
            totalSaleDiscount: 0,
            totalPurchaseDiscount: 0,
          };
        }

        // Calculate total discount for all items in the bill
        let totalItemsDiscount = 0;
        if (bill.items && Array.isArray(bill.form?.items)) {
          totalItemsDiscount = bill.form?.items.reduce((sum, item) => {
            const itemDiscountAmount = parseFloat(item.discount?.amount || "0");
            return sum + (isNaN(itemDiscountAmount) ? 0 : itemDiscountAmount);
          }, 0);
        }

        // Add to appropriate discount based on billType
        if (bill.billType === "addsales") {
          acc[partyId].totalSaleDiscount += totalItemsDiscount;
        } else if (bill.billType === "addpurchase") {
          acc[partyId].totalPurchaseDiscount += totalItemsDiscount;
        }

        acc[partyId].bills.push({
          ...bill,
          totalDiscount: totalItemsDiscount,
        });

        return acc;
      }, {});

      // Convert to array and sort by party name
      const partyBillsArray = Object.values(billsByParty).sort((a, b) =>
        a.partyName.localeCompare(b.partyName)
      );

      setPartyBills(partyBillsArray);
    }
  }, [bills]);

  // Calculate grand totals
  const totalSaleDiscount = partyBills.reduce(
    (sum, party) => sum + party.totalSaleDiscount,
    0
  );

  const totalPurchaseDiscount = partyBills.reduce(
    (sum, party) => sum + party.totalPurchaseDiscount,
    0
  );

  // Excel Export Function
  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const excelData = partyBills.map(party => ({
      'Party Name': party.partyName,
      'Sale Discount': party.totalSaleDiscount,
      'Purchase/Expense Discount': party.totalPurchaseDiscount
    }));

    // Add total row
    excelData.push({
      'Party Name': 'TOTAL',
      'Sale Discount': totalSaleDiscount,
      'Purchase/Expense Discount': totalPurchaseDiscount
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Discount Report");

    // Export to Excel file
    XLSX.writeFile(workbook, `Discount_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="h-[88vh] p-4 bg-white">
      {/* Date Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <p className="text-sm mb-1">From</p>
            <div className="relative">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Calendar className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <p className="text-sm mb-1">To</p>
            <div className="relative">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Calendar className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Export to Excel Button */}
        <button 
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <Download className="h-5 w-5" />
          Export to Excel
        </button>
      </div>

      {/* Discount Report Section */}
      <div>
        <h2 className="text-sm font-medium mb-4">DISCOUNT REPORT</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="font-medium text-gray-600">Party Name</div>
          <div className="font-medium text-gray-600">Sale Discount</div>
          <div className="font-medium text-gray-600">
            Purchase / Expense Discount
          </div>

          {partyBills.map((party) => (
            <React.Fragment key={party.partyId}>
              <div className="text-gray-700">{party.partyName}</div>
              <div className="text-gray-700">
                ₹ {party.totalSaleDiscount.toFixed(2)}
              </div>
              <div className="text-gray-700">
                ₹ {party.totalPurchaseDiscount.toFixed(2)}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Total Section */}
        <div className="mt-8 flex justify-between text-sm">
          <div className="text-green-600">
            Total Sale Discount: ₹ {totalSaleDiscount.toFixed(2)}
          </div>
          <div className="text-red-600">
            Total Purchase Discount: ₹ {totalPurchaseDiscount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountReport;