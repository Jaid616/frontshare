import React, { useEffect, useState } from "react";
import { Button, IconButton, TextField, Box } from "@mui/material";
import { EllipsisVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import db from "../config/dbConfig";
import { decodeToken } from "../DecodeToken";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
            (bill) => bill.billType === "estimate"
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
  const filteredBills = bills.filter(
    (bill) =>
      bill?.form?.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill?.form?.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      bill?.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "overdue":
        return "text-red-500";
      case "pending":
        return "text-orange-500";
      case "paid":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Box className="p-1 text-[0.7rem]">
      <Box className="flex justify-between items-center mb-4">
        <div className="font-medium">TRANSACTIONS</div>
        <Button
          variant="contained"
          className="bg-blue-500 hover:bg-blue-600"
          style={{ fontSize: "0.7rem" }}
          onClick={() =>
            navigate("/add-sales", { state: { page: "purchaseorders" } })
          }
        >
          + Add Purchase Order
        </Button>
      </Box>

      <Box className="mb-4">
        <TextField
          size="small"
          placeholder="Search..."
          className="w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ style: { fontSize: "0.7rem" } }}
        />
      </Box>

      <div className="overflow-x-auto">
        <table className="min-w-full text-[0.7rem] border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "PARTY",
                "NO.",
                "DATE",
                "DUE DATE",
                "TOTAL AMOUNT",
                "BALANCE",
                "TYPE",
                "STATUS",
                "ACTION",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 font-medium text-left border-b border-gray-200"
                >
                  {header}
                  <Filter className="inline ml-1 w-4 h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No bills found
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill._id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border-b border-gray-200">
                    {bill?.form?.customer || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {bill?.form?.invoiceNumber || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {formatDate(bill.invoiceDate)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {formatDate(bill.dueDate)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    ₹ {bill.total?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    ₹ {bill.balance?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {bill.type || "Purchase Order"}
                  </td>
                  <td
                    className={`px-4 py-2 border-b border-gray-200 ${getStatusColor(
                      bill.status
                    )}`}
                  >
                    {bill.status || "Pending"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 text-purple-600 border border-purple-600 rounded hover:bg-purple-50"
                        style={{ fontSize: "0.7rem" }}
                        onClick={() =>
                          navigate(`/convert-purchase/${bill._id}`)
                        }
                      >
                        CONVERT TO PURCHASE
                      </button>
                      <IconButton
                        size="small"
                        className="ml-2"
                        onClick={() => navigate(`/bill-details/${bill._id}`)}
                      >
                        <EllipsisVertical className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Box>
  );
};

export default PurchaseOrders;
