import React, { useEffect, useState } from "react";
import { FileSpreadsheet, Printer } from "lucide-react";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";
import * as XLSX from 'xlsx'; // Added XLSX import

const ItemWiseProfitAndLoss = () => {
  const [dateRange, setDateRange] = useState({
    from: "2025-01-01",
    to: "2025-01-20",
  });
  const [showItemsHavingSale, setShowItemsHavingSale] = useState(false);
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])
  const [bills, setBills] = useState([])
  const [processedItems, setProcessedItems] = useState([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

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
          setBills(existingDoc?.bills || []);
        } catch (err) {
          console.error("Error fetching bills:", err);
          setError(err);
        }
      }
    };

    fetchBills();
  }, [phone]);

  useEffect(() => {
    const fetchItems = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items || []);
      }
    }
    fetchItems()
  }, [phone])

  useEffect(() => {
    const fetchParties = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setParties(existingDoc.parties || []);
      }
    }
    fetchParties();
  }, [phone])

  useEffect(() => {
    const filteredItems = () => {
      const itemStates = (items || []).map((item) => {
        let sales = 0;
        let purchase = 0;
        let salesReturn = 0;
        let purchaseReturns = 0;
        let openingStocks = 0;
        let sold = 0;
        let closingStocks = 0;
        let taxReceivable = 0;
        let taxPayable = 0;
        let netProfitLoss = 0;

        (bills || []).forEach((bill) => {
          (bill?.form?.items || []).forEach((billItem) => {
            if (billItem.itemId === item.itemCode) {
              if (bill.billType === "addsales") {
                if (sales != bill.form?.total) {
                  sales += Number(bill.form?.total) || 0;
                }
                openingStocks += item.openingQuantity * item.atPrice;
                sold += 1;
              } else if (bill.billType === "salesreturn") {
                if (salesReturn != bill.form?.total) {
                  salesReturn += Number(bill.form?.total) || 0;
                }
              } else if (bill.billType === "addpurchase") {
                if (purchase != bill.form?.total) {
                  purchase += Number(bill.form?.total) || 0;
                }
              } else if (bill.billType === "purchasereturn") {
                if (purchaseReturns != bill.form?.total) {
                  purchaseReturns += Number(bill.form?.total) || 0;
                }
              }
            }
          });
        });
        const totalRemained = item.openingQuantity - sold;
        closingStocks = totalRemained * item.atPrice;
        netProfitLoss = sales - (sold * item.atPrice);
        return {
          id: item.itemCode,
          name: item.itemName,
          sale: sales,
          crNote: salesReturn,
          purchase: purchase,
          drNote: purchaseReturns,
          openingStock: openingStocks,
          closingStock: closingStocks,
          taxReceivable: taxReceivable,
          taxPayable: taxPayable,
          profitLoss: netProfitLoss,
        };
      });
      
      // Calculate total profit/loss
      const total = itemStates.reduce((acc, item) => acc + item.profitLoss, 0);
      setTotalProfitLoss(total);
      setProcessedItems(itemStates);
    };

    filteredItems();
  }, [items, bills]);

  // Excel Export Function
  const handleExportExcel = () => {
    // Prepare data for Excel export
    const excelData = processedItems
      .filter((item) => !showItemsHavingSale || item.sale > 0)
      .map((item, index) => ({
        "Sr No": index + 1,
        "Item Name": item.name,
        "Sale": item.sale.toFixed(2),
        "Cr. Note / Sale Return": item.crNote.toFixed(2),
        "Purchase": item.purchase.toFixed(2),
        "Dr. Note / Purchase Return": item.drNote.toFixed(2),
        "Opening Stock": item.openingStock.toFixed(2),
        "Closing Stock": item.closingStock.toFixed(2),
        "Tax Receivable": item.taxReceivable.toFixed(2),
        "Tax Payable": item.taxPayable.toFixed(2),
        "Net Profit/Loss": item.profitLoss.toFixed(2)
      }));

    // Add total row
    excelData.push({
      "Sr No": "Total",
      "Item Name": "",
      "Sale": "",
      "Cr. Note / Sale Return": "",
      "Purchase": "",
      "Dr. Note / Purchase Return": "",
      "Opening Stock": "",
      "Closing Stock": "",
      "Tax Receivable": "",
      "Tax Payable": "",
      "Net Profit/Loss": totalProfitLoss.toFixed(2)
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Item Profit and Loss");

    // Export to Excel file
    XLSX.writeFile(
      workbook,
      `Item_Profit_Loss_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">From</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-600">To</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showItemsHavingSale}
              onChange={(e) => setShowItemsHavingSale(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Items Having Sale</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            <span className="text-sm">Excel</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-700">
            <Printer className="w-4 h-4 mr-1" />
          </button>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-4">DETAILS</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 text-sm font-medium text-gray-600">
                Item Name
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Sale
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Cr. Note / Sale Return
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Purchase
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Dr. Note / Purchase Return
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Opening Stock
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Closing Stock
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Tax Receivable
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Tax Payable
              </th>
              <th className="text-right p-2 text-sm font-medium text-gray-600">
                Net Profit/Loss
              </th>
            </tr>
          </thead>
          <tbody>
            {processedItems
              .filter((item) => !showItemsHavingSale || item.sale > 0)
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 text-sm text-blue-600">{item.name}</td>
                  <td className="p-2 text-sm text-right">{item.sale}</td>
                  <td className="p-2 text-sm text-right">{item.crNote}</td>
                  <td className="p-2 text-sm text-right">{item.purchase}</td>
                  <td className="p-2 text-sm text-right">{item.drNote}</td>
                  <td className="p-2 text-sm text-right">
                    {item.openingStock}
                  </td>
                  <td className="p-2 text-sm text-right">
                    {item.closingStock}
                  </td>
                  <td className="p-2 text-sm text-right">
                    {item.taxReceivable}
                  </td>
                  <td className="p-2 text-sm text-right">{item.taxPayable}</td>
                  <td className={`p-2 text-sm text-right ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹ {item.profitLoss.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <div className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          Total Profit/Loss: ₹ {totalProfitLoss.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ItemWiseProfitAndLoss;