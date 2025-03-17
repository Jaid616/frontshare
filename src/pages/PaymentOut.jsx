import React, { useEffect, useState } from "react";
import { Search, Printer, Filter, X, Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import AddPartyModal from "./AddPartyModal.jsx";
import { decodeToken } from "../DecodeToken.js";
import db from "../config/dbConfig.js";

const PaymentOut = () => {
  const [dateRange, setDateRange] = React.useState("this-month");
  const { allTransactionSettings, setAllTransactionSettings } = useState();
  const [startDate, setStartDate] = React.useState("2025-01-01");
  const [endDate, setEndDate] = React.useState("2025-01-31");
  const [selectedFirm, setSelectedFirm] = React.useState("ALL FIRMS");
  const [paymentType, setPaymentType] = React.useState("All Payment");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  // const { parties } = useSelector((state) => state.party);
  // const { paymentOut, isLoading, paymentIn } = useSelector((state) => state.payment);
  const [parties, setParties] = useState([]);
  const [paymentIn, setPaymentIn] = useState([]);
  const [paymentOut, setPaymentOut] = useState([]);
  const [addPartyNew, setAddPartyNew] = React.useState(false);
  const [selectedParty, setSelectedParty] = React.useState("");
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPhone = async () => {
      setLoading(true);
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhone();
  }, []);
  const fetchParties = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setParties(existingDoc.parties);
    }
  };
  useEffect(() => {
    fetchParties();
  }, [phone]);

  useEffect(() => {
    const fetchPaymentIn = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setPaymentIn(
          existingDoc.payments.filter(
            (payment) => payment.type === "payment-in"
          )
        );
      }
    };
    fetchPaymentIn();
  }, [phone]);
  const fetchPaymentOut = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      setPaymentOut(
        existingDoc.payments.filter((payment) => payment.type === "payment-out")
      );
    }
  };
  useEffect(() => {
    fetchPaymentOut();
  }, [phone]);

  useEffect(() => {
    const fetchTransactionSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionSettings = existingDoc?.settings?.filter(
          (setting) => setting.name === "transactionSettings"
        )[0]?.data;
        setAllTransactionSettings(newTransactionSettings);
      }
    };
    fetchTransactionSettings();
  }, [phone]);

  const handleParty = async (partyData) => {
    let existingDoc = await db.get(phone).catch(() => null);

    if (existingDoc) {
      existingDoc.parties.push(partyData);
      await db.put(existingDoc);
    } else {
      await db.put({
        _id: phone,
        parties: [partyData],
      });
    }
    fetchParties();
    setAddPartyNew(false);
  };

  const columns = [
    { id: "#", label: "#", sortable: false },
    { id: "date", label: "DATE", sortable: true },
    { id: "refNo", label: "REF NO.", sortable: true },
    { id: "partyName", label: "PARTY NAME", sortable: true },
    { id: "type", label: "TYPE", sortable: true },
    { id: "total", label: "TOTAL", sortable: true },
    { id: "paid", label: "PAID", sortable: true },
    { id: "balance", label: "BALANCE", sortable: true },
    { id: "print", label: "PRINT/...", sortable: true },
  ];
  const handlePartyChange = (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);
    if (selectedValue === "new") {
      setAddPartyNew(true);
    } else {
      setSelectedParty(selectedValue);
    }
  };
  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [modalDate, setModalDate] = React.useState("2025-01-17");
    const [modalTime, setModalTime] = React.useState("13:58");
    const [receiptNo, setReceiptNo] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [paid, setPaid] = React.useState("");
    const [paymentMode, setPaymentMode] = React.useState("cash");
    const [addPartyNew, setAddPartyNew] = React.useState(false);
    const handleSave = async () => {
      try {
        const selectedPartyData = parties.find(
          (p) => p.partyId === selectedParty
        );

        if (!selectedPartyData) {
          toast.error("Selected party not found");
          return;
        }
        const newBalance = selectedPartyData.openingBalance - parseFloat(paid);

        const paymentData = {
          type: "payment-out",
          date: modalDate,
          time: modalTime,
          receiptNo: paymentOut?.length + 1,
          partyId: selectedParty,
          partyName: selectedPartyData.partyName,
          paymentType: paymentMode,
          description,
          paid: parseFloat(paid) || 0,
          total: newBalance,
          status: "Paid",
        };
        const existingDoc = await db.get(phone);
        const updatedParties = existingDoc.parties.map((party) => {
          if (party.partyId === selectedParty) {
            return {
              ...party,
              openingBalance: newBalance,
            };
          }
          return party;
        });
        existingDoc.payments = existingDoc.payments || [];
        existingDoc.payments.push(paymentData);

        existingDoc.parties = updatedParties;
        await db.put(existingDoc);

        toast.success("Payment out recorded successfully!");
        fetchPaymentOut();
        fetchParties();
        onClose();

        // Reset form
        setSelectedParty("");
        setModalDate("2025-01-17");
        setModalTime("13:58");
        setReceiptNo("");
        setDescription("");
        setPaid("");
        setPaymentMode("cash");
      } catch (error) {
        console.error("Error saving payment:", error);
        toast.error(error.message || "Failed to record payment");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-3xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Payment-Out</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Party
                  </label>
                  <select
                    className="w-full h-10 border border-gray-300 rounded-md text-sm"
                    value={selectedParty}
                    onChange={(e) => handlePartyChange(e)}
                  >
                    <option value="" disabled>
                      Select Party
                    </option>
                    {parties?.map((party) => (
                      <option key={party.partyId} value={party.partyId}>
                        {party.partyName} - {party.openingBalance} (
                        {party.balanceType === "to-receive" ? "↑" : "↓"})
                      </option>
                    ))}
                    <option value="new" className="text-blue-600">
                      + Add New Party
                    </option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Payment Type
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                <div className="mb-4">
                  <button className="text-blue-600 text-sm hover:underline">
                    + Add Payment type
                  </button>
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="Add Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    rows="3"
                  />
                </div>

                <div className="mb-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Receipt No
                    </label>
                    <input
                      type="text"
                      value={paymentOut?.length + 1}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={modalDate}
                      onChange={(e) => setModalDate(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Paid
                  </label>
                  <input
                    type="number"
                    value={paid}
                    onChange={(e) => setPaid(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>

                <div className="text-right mt-8">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-lg font-semibold">₹ {paid || "0.00"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
              Share
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  const totalAmount = paymentOut?.reduce(
    (sum, payment) => sum + payment.total,
    0
  );
  const totalBalance = paymentOut?.reduce(
    (sum, payment) => sum + (payment.total - payment.paid),
    0
  );

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  return (
    <div className="p-2 bg-gray-100">
      <div className="bg-white p-4 shadow-md rounded-md h-[575px]">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md min-w-[150px]"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="custom">Custom</option>
          </select>

          <span className="text-xs">Between</span>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md"
          />

          <span className="text-xs">To</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md"
          />

          <select
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md min-w-[150px]"
          >
            <option value="ALL FIRMS">ALL FIRMS</option>
          </select>

          <div className="flex gap-2 ml-auto">
            <button className="text-xs flex items-center gap-2 text-blue-600 hover:underline">
              <Filter className="w-4 h-4" />
              Excel Report
            </button>
            <button className="text-xs flex items-center gap-2 text-blue-600 hover:underline">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <select
            value="Payment-Out"
            className="text-sm p-2 border border-gray-300 rounded-md min-w-[150px]"
          >
            <option value="Payment-Out">Payment-Out</option>
          </select>

          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="text-sm p-2 border border-gray-300 rounded-md min-w-[150px]"
          >
            <option value="All Payment">All Payment</option>
          </select>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm p-2 pl-10 border border-gray-300 rounded-md w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-xs hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Payment-Out
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {columns?.map((column) => (
                  <th
                    key={column.id}
                    className="p-2 text-left border text-xs font-medium text-gray-600"
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && (
                        <Filter className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentOut?.map((payment, index) => (
                <tr
                  key={payment._id}
                  className="odd:bg-white even:bg-gray-50 text-xs"
                >
                  <td className="p-2 border-b">{index + 1}</td>
                  <td className="p-2 border-b">
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="p-2 border-b">{payment.receiptNo}</td>
                  <td className="p-2 border-b">{payment.partyName}</td>
                  <td className="p-2 border-b">{payment.paymentType}</td>
                  <td className="p-2 border-b">
                    ₹ {payment.total?.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">₹ {payment.paid?.toFixed(2)}</td>
                  <td className="p-2 border-b">
                    ₹ {(payment.total - payment.paid)?.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:underline">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paymentOut?.length === 0 && (
                <tr className="text-center">
                  <td colSpan={10} className="p-4 text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs bottom-3 absolute w-full px-4">
          <div>Total Amount: ₹ 30.00</div>
          <div className="absolute right-72">Balance: ₹ 0.00</div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddPartyModal
        isOpen={addPartyNew}
        onClose={() => setAddPartyNew(false)}
        handleParty={handleParty}
      />
    </div>
  );
};

export default PaymentOut;
