import React, { useEffect, useState } from "react";
import { ArrowLeft, FileSpreadsheet, Printer, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const PartyItemWise = () => {
  const [categories, setCategories] = useState([])
  const [parties, setParties] = useState([])
  const [items, setItems] = useState([])
  const [bills, setBills] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

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
    const fetchItems = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    }
    fetchItems()
  }, [phone])

  useEffect(() => {
    const fetchParties = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setParties(existingDoc.parties);
      }
    }
    fetchParties();
  }, [phone])

  useEffect(() => {
    const fetchCategories = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setCategories(existingDoc.categories);
      }
    }
    fetchCategories();
  }, [phone])

  useEffect(() => {
    const filteredItem = items.filter((item) =>
      item.categories.includes(selectedCategory)
    );
    console.log(filteredItem, bills, "This is selected item");
    setFilteredItems(filteredItem);
  }, [selectedCategory, items]);

  useEffect(() => {
    processPartyData();
  }, [bills, parties, searchQuery]);

  const processPartyData = () => {
    if (!bills || !parties) return;

    // Create a map to store aggregated data for each party
    const partyDataMap = new Map();

    bills.forEach((bill) => {
      const party = parties.find((p) => p.partyName === bill.form.customer);
      console.log(party, "This is data");
      if (!party) return;

      const isSale = bill.billType === "addsales";
      const isPurchase = bill.billType === "addpurchase";
      const partyData = partyDataMap.get(party.id) || {
        id: party.partyId,
        partyName: party.partyName,
        saleQuantity: 0,
        saleAmount: 0,
        purchaseQuantity: 0,
        purchaseAmount: 0,
      };

      if (isSale) {
        partyData.saleQuantity += 1;
        partyData.saleAmount += Number(bill.form?.total || 0);
      } else if (isPurchase) {
        partyData.purchaseQuantity += 1;
        partyData.purchaseAmount += Number(bill.form?.total || 0);
      }

      partyDataMap.set(party.id, partyData);
    });

    // Convert map to array and apply search filter
    let processedData = Array.from(partyDataMap.values());

    if (searchQuery) {
      processedData = processedData.filter((data) =>
        data.partyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(processedData);
  };


  // Calculate totals
  const totals = filteredData.reduce(
    (acc, curr) => ({
      saleQuantity: acc.saleQuantity + curr.saleQuantity,
      saleAmount: acc.saleAmount + curr.saleAmount,
      purchaseQuantity: acc.purchaseQuantity + curr.purchaseQuantity,
      purchaseAmount: acc.purchaseAmount + curr.purchaseAmount,
    }),
    {
      saleQuantity: 0,
      saleAmount: 0,
      purchaseQuantity: 0,
      purchaseAmount: 0,
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => window.history.back()}
        className="flex items-center mb-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <select className="border rounded-md px-3 py-2 text-sm">
                <option>This Month</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 gap-2 text-sm">
                <span className="text-gray-600">Between</span>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="border rounded-md px-2 py-1"
                />
                <span className="text-gray-600">To</span>
                <input
                  type="date"
                  defaultValue="2025-01-31"
                  className="border rounded-md px-2 py-1"
                />
              </div>

              <select className="border rounded-md px-3 py-2 text-sm">
                <option>All Firms</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center text-blue-600 hover:text-blue-700">
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

        <div className="p-4 border-b flex flex-wrap gap-4">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">All Items</option>
            {filteredItems?.map((item) => (
              <option key={item.itemCode} value={item.itemCode}>
                {item.itemName}
              </option>
            ))}
          </select>
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
                  #
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  PARTY NAME
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  SALE QUANTITY
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  SALE AMOUNT
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  PURCHASE QUANTITY
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  PURCHASE AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((data, index) => (
                  <tr
                    key={data.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-4 text-sm">{index + 1}</td>
                    <td className="p-4 text-sm">{data.partyName}</td>
                    <td className="p-4 text-sm text-right">
                      {data.saleQuantity}
                    </td>
                    <td className="p-4 text-sm text-right">
                      ₹ {data.saleAmount.toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-right">
                      {data.purchaseQuantity}
                    </td>
                    <td className="p-4 text-sm text-right">
                      ₹ {data.purchaseAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="w-16 h-16 text-gray-300" />
                      <div className="text-gray-500">
                        <p>No data is available for Party Report by Item.</p>
                        <p>Please try again after making relevant changes.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td className="p-4 text-sm font-semibold">Total:</td>
                <td className="p-4 text-sm"></td>
                <td className="p-4 text-sm text-right font-semibold">
                  {totals.saleQuantity}
                </td>
                <td className="p-4 text-sm text-right font-semibold">
                  ₹ {totals.saleAmount.toFixed(2)}
                </td>
                <td className="p-4 text-sm text-right font-semibold">
                  {totals.purchaseQuantity}
                </td>
                <td className="p-4 text-sm text-right font-semibold">
                  ₹ {totals.purchaseAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartyItemWise;
