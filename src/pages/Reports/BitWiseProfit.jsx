import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, X } from "lucide-react";
import { getBillWiseProfit } from "../../Redux/billSlice";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const BitWiseProfit = () => {
  const navigate = useNavigate();
  const [partyFilter, setPartyFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [billWiseProfit, setBillWiseProfit] = useState();
  const { profitData, summary } = billWiseProfit || {};

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

  const fetchBillWiseProfit = async () => {
    try {
      const existingDoc = await db.get(phone);
      if (!existingDoc || !existingDoc.bills) return;

      const bills = existingDoc.bills.filter((bill) => bill.billType === 'addsales');
      console.log(bills, "This is the bill type")
      const profitData = [];

      for (const bill of bills) {
        let saleAmount = 0;
        let totalCost = 0;
        let taxPayable = 0;
        let tdsReceivable = 0;
        const costCalculation = [];

        for (const item of bill.form.items) {
          saleAmount += Number(item.amount) || 0;
          const existingItem = await db.get(phone)
          console.log(existingItem, item.itemId, "This is the existing item")
          const itemDetails = existingItem?.items?.filter((obj) => obj.itemCode === item.itemId)[0];
          console.log(itemDetails, "This is itemDetails")
          if (itemDetails) {
            const purchasePrice = itemDetails.purchasePrice || 0;
            const quantity = itemDetails.openingQuantity || 1;
            const itemTotalCost = purchasePrice * quantity;

            totalCost += itemTotalCost;

            costCalculation.push({
              itemName: item.itemName,
              quantity: quantity,
              purchasePrice: Number(purchasePrice).toFixed(2),
              totalCost: Number(itemTotalCost).toFixed(2),
            });
          }
          
          if (item.tax && item.tax.amount) {
            taxPayable += Number(item.tax.amount);
          }
        }

        const profit = saleAmount - totalCost - taxPayable + tdsReceivable;
        const invoiceDate = new Date(bill.form?.invoiceDate)
          .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .split("/")
          .join("/");

        const profitObj = {
          summaryData: {
            date: invoiceDate,
            invoiceNo: bill.form.invoiceNumber,
            party: bill.form.customer,
            totalSaleAmount: saleAmount.toFixed(2),
            profit: profit.toFixed(2),
            profitDisplay:
              profit >= 0
                ? `₹ ${profit.toFixed(2)}`
                : `-₹ ${Math.abs(profit).toFixed(2)}`,
          },
          detailedData: {
            title: `Invoice #${bill.form.invoiceNumber} - ${bill.form.customer}`,
            costCalculation: costCalculation,
            calculations: {
              saleAmount: saleAmount.toFixed(2),
              totalCost: totalCost.toFixed(2),
              taxPayable: taxPayable.toFixed(2),
              tdsReceivable: tdsReceivable.toFixed(2),
              profit: profit.toFixed(2),
              profitExcludingAdditionalCharges: profit.toFixed(2),
            },
          },
        };

        profitData.push(profitObj);
      }

      const totals = profitData.reduce(
        (acc, curr) => {
          acc.totalSaleAmount += Number(curr.summaryData.totalSaleAmount);
          acc.totalProfit += Number(curr.summaryData.profit);
          return acc;
        },
        { totalSaleAmount: 0, totalProfit: 0 }
      );

      setBillWiseProfit({
        profitData,
        summary: {
          totalSaleAmount: totals.totalSaleAmount.toFixed(2),
          totalProfit: totals.totalProfit.toFixed(2),
        },
      });
    } catch (err) {
      console.error("Error fetching bill wise profit:", err);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchBillWiseProfit();
    }
  }, [phone]);

  // Handle Search with all filters
  const handleSearch = () => {
    const filters = {
      ...(partyFilter && { party: partyFilter }),
      ...(fromDate && { fromDate: formatDate(fromDate) }),
      ...(toDate && { toDate: formatDate(toDate) }),
    };
    fetchBillWiseProfit()
  };

  // Format date from yyyy-mm-dd to dd/mm/yyyy
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Reset all filters
  const handleReset = () => {
    setPartyFilter("");
    setFromDate("");
    setToDate("");
    fetchBillWiseProfit()
  };

  const showDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-100 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-xl font-semibold ml-4">Profit on Sale Invoices</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium text-gray-600">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium text-gray-600">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          type="text"
          placeholder="Party filter"
          value={partyFilter}
          onChange={(e) => setPartyFilter(e.target.value)}
          className="border px-3 py-1 rounded-lg text-sm w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg mb-16">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Invoice No</th>
              <th className="py-2 px-4">Party</th>
              <th className="py-2 px-4">Total Sale Amount</th>
              <th className="py-2 px-4">Profit (+) / Loss (-)</th>
              <th className="py-2 px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {profitData?.map((item) => (
              <tr
                key={item.summaryData.invoiceNo}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="py-2 px-4">{item.summaryData.date}</td>
                <td className="py-2 px-4">{item.summaryData.invoiceNo}</td>
                <td className="py-2 px-4">{item.summaryData.party}</td>
                <td className="py-2 px-4">
                  ₹ {item.summaryData.totalSaleAmount}
                </td>
                <td className="py-2 px-4 text-green-500">
                  {item.summaryData.profitDisplay}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => showDetails(item.detailedData)}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="fixed bottom-0 right-0 left-0 bg-white shadow-md p-4 border-t">
        <div className="max-w-7xl mx-auto flex justify-between">
          <div className="text-sm">
            <span className="font-medium">Total Sale Amount: </span>
            <span>₹ {summary?.totalSaleAmount || "0.00"}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Total Profit(+)/Loss(-): </span>
            <span>₹ {summary?.totalProfit || "0.00"}</span>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">{selectedInvoice.title}</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <h3 className="font-medium mb-3">Cost Calculation</h3>

              {/* Cost Calculation Table */}
              <table className="w-full mb-6 text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">ITEM NAME</th>
                    <th className="text-left py-2 font-medium">QUANTITY</th>
                    <th className="text-left py-2 font-medium">
                      PURCHASE PRICE
                    </th>
                    <th className="text-left py-2 font-medium">TOTAL COST</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.costCalculation.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.itemName}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">₹ {item.purchasePrice}</td>
                      <td className="py-2">₹ {item.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Sale Amount</span>
                  <span>₹ {selectedInvoice.calculations.saleAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost</span>
                  <span>₹ {selectedInvoice.calculations.totalCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Payable</span>
                  <span>₹ {selectedInvoice.calculations.taxPayable}</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS Receivable</span>
                  <span>₹ {selectedInvoice.calculations.tdsReceivable}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>
                    Profit (Sale Amount - Total Cost - Tax Payable + TDS
                    Receivable)
                  </span>
                  <span>₹ {selectedInvoice.calculations.profit}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Profit (Excluding Additional Charges)</span>
                  <span>
                    ₹{" "}
                    {
                      selectedInvoice.calculations
                        .profitExcludingAdditionalCharges
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BitWiseProfit;
