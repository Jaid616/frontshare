import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getBills } from "../../Redux/billSlice";
import { useDispatch, useSelector } from "react-redux";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const GSTReports = () => {
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
            partyName: bill.form?.customer || 'Unknown Party',
            bills: [],
            totalSaleTax: 0,
            totalPurchaseTax: 0
          };
        }

        // Calculate total tax for the bill
        let billTaxAmount = 0;
        if (bill.tax && typeof bill.tax === 'object') {
          // If tax percentage exists, calculate tax amount
          const taxPercentage = parseFloat(bill.form?.tax.percentage || '0');
          const taxAmount = parseFloat(bill.form?.tax.amount || '0');
          
          // Use tax amount if directly provided, otherwise calculate from percentage
          billTaxAmount = taxAmount || (bill.form?.total * (taxPercentage / 100));
        }

        // Add to appropriate tax based on billType
        if (bill.billType === 'addsales') {
          acc[partyId].totalSaleTax += billTaxAmount;
        } else if (bill.billType === 'addpurchase') {
          acc[partyId].totalPurchaseTax += billTaxAmount;
        }

        acc[partyId].bills.push({
          ...bill,
          totalTax: billTaxAmount
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

  // Calculate total tax in and out
  const totalTaxIn = partyBills.reduce((sum, party) => sum + party.totalPurchaseTax, 0);
  const totalTaxOut = partyBills.reduce((sum, party) => sum + party.totalSaleTax, 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow h-[88vh]">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 border rounded p-2">
          <span>From</span>
          <input
            type="date"
            defaultValue="2025-01-01"
            className="border-none outline-none"
          />
          <Calendar className="w-4 h-4" />
          <span>To</span>
          <input
            type="date"
            defaultValue="2025-01-22"
            className="border-none outline-none"
          />
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Party Name</th>
              <th className="text-right p-2">Sale Tax</th>
              <th className="text-right p-2">Purchase/Expense Tax</th>
            </tr>
          </thead>
          <tbody>
            {partyBills.map((party, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{party.partyName}</td>
                <td className="text-right p-2">
                  ₹ {party.totalSaleTax.toFixed(2)}
                </td>
                <td className="text-right p-2">
                  ₹ {party.totalPurchaseTax.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6 text-sm fixed bottom-4 w-[63%]">
        <div className="text-green-500">
          Total Tax In: ₹ {totalTaxIn.toFixed(2)}
        </div>
        <div className="text-red-500">
          Total Tax Out: ₹ {totalTaxOut.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default GSTReports;