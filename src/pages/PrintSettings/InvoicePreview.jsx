import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBusinessProfile } from "../../Redux/userSlice";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const InvoicePreview = ({ invoiceData }) => {
  const [profile, setProfile] = useState({});
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

  const fetchProfile = async () => {
    if (!phone) return;

    try {
      const existingDoc = await db.get(phone);
      if (existingDoc && existingDoc.users) {
        setProfile(existingDoc.users);
      }
    } catch (err) {
      if (err.name === "not_found") {
        // Document doesn't exist yet, that's okay
        console.log("User document not found, will create on save");
      } else {
        console.error("Error fetching profile:", err);
        setError(err);
      }
    }
  };
  console.log(invoiceData, "This is the Invoice")
  useEffect(() => {
    if (phone) {
      fetchProfile();
    }
  }, [phone]);

  const calculateTotals = (items, currency, countryName) => {
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let vatAmount = 0;
    let vatRate = 0;
    const vatCountries = ["UK", "Germany", "France", "UAE"];
  
    items.forEach((item) => {
      // 🛑 Convert quantity properly
      let primaryQuantity = parseFloat(item.quantity.primary) || 0;
  
      // 🛑 Fix total item calculation
      const itemTotal = primaryQuantity * item.pricePerUnit;
      
      // 🛑 Fix discount calculation (use provided discountAmount)
      const discountAmount = item.discountAmount || 0;
  
      // 🛑 Extract numeric tax value from string (e.g., "GST (CGST) 9%")
      let taxRate = parseFloat(item?.tax?.match(/\d+/)?.[0]) || 0;
      
      // 🛑 Apply tax to taxAmount field correctly
      const taxAmount = (taxRate / 100) * item.taxAmount;
  
      // 🛑 Update totals
      subTotal += itemTotal; // Assuming this is already the correct amount
      totalDiscount += discountAmount;
      totalTax += taxAmount;
  
      // 🛑 Apply VAT if needed
      if (vatCountries.includes(countryName)) {
        vatRate = 5; // Example VAT rate
        vatAmount += (vatRate / 100) * item.taxAmount;
      }
    });
  
    const grandTotal = subTotal + totalTax + vatAmount;
  
    return {
      subTotal,
      totalDiscount,
      totalTax,
      vatAmount,
      grandTotal,
      currency,
      vatRate,
    };
  };
  
  // Usage
  const totals = calculateTotals(
    invoiceData.items,
    invoiceData.currency,
    invoiceData.invoiceDetails.countryName
  );
  

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white">
      <div className="w-full border border-gray-300 font-['Poppins',sans-serif]">
        {/* Title */}
        <div className="text-center py-2 text-lg font-semibold">
          Tax Invoice
        </div>

        {/* Company Header */}
        <div className="bg-gray-200 flex p-4 border-t border-b border-gray-300">
          <div className="bg-gray-500 w-20 h-20 flex items-center justify-center text-white">
            LOGO
          </div>
          <div className="ml-4">
            <div className="text-xl font-semibold text-gray-700">
              {invoiceData.billTo.companyName}
            </div>
            <div className="text-sm mt-1">
              Phone: {invoiceData.billTo.companyPhone}
            </div>
          </div>
        </div>

        {/* Bill To and Invoice Details */}
        <div className="grid grid-cols-2">
          <div className="border-r border-b border-gray-300 p-2">
            <div className="font-semibold">Bill To:</div>
            <div>{invoiceData.billTo.name}</div>
            <div>{invoiceData.billTo.partyAddress}</div>
            <div className="flex space-x-4">
              <span>Contact No: {invoiceData.billTo.partyPhone}</span>
              <span>State: {invoiceData.billTo.partyState}</span>
            </div>
          </div>
          <div className="border-b border-gray-300 p-2">
            <div className="font-semibold">Invoice Details:</div>
            <div>No: {invoiceData.invoiceDetails.invoiceNo}</div>
            <div>Date: {invoiceData.invoiceDetails.date}</div>
            <div>
              Place Of Supply: {invoiceData.invoiceDetails.stateOfSupply}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-left">#</th>
              <th className="border border-gray-300 p-1 text-left">
                Item name
              </th>
              <th className="border border-gray-300 p-1 text-left">HSN/SAC</th>
              <th className="border border-gray-300 p-1 text-center">
                Quantity
              </th>
              <th className="border border-gray-300 p-1 text-right">
                Price/Unit ({totals.currency})
              </th>
              <th className="border border-gray-300 p-1 text-right">
                Discount ({totals.currency})
              </th>
              {totals.totalTax > 0 && (
                <th className="border border-gray-300 p-1 text-right">
                  Tax ({totals.currency})
                </th>
              )}
              <th className="border border-gray-300 p-1 text-right">
                Amount ({totals.currency})
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => {
              const itemTotal = item.quantity * item.pricePerUnit;
              const discountAmount = (item.discount / 100) * itemTotal;
              const taxableAmount = itemTotal - discountAmount;
              const taxAmount = (item.tax / 100) * taxableAmount;
              return (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">{index + 1}</td>
                  <td className="border border-gray-300 p-1">{item.name}</td>
                  <td className="border border-gray-300 p-1"></td>
                  <td className="border border-gray-300 p-1 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {totals.currency} {item.pricePerUnit.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {totals.currency} {item.discountAmount.toFixed(2)}
                  </td>
                  {totals.totalTax > 0 && (
                    <td className="border border-gray-300 p-1 text-right">
                      {totals.currency} {item.taxAmount.toFixed(2)}
                    </td>
                  )}
                  <td className="border border-gray-300 p-1 text-right">
                    {totals.currency} {item.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={4} className="border border-gray-300 p-1">
                Total
              </td>
              <td className="border border-gray-300 p-1 text-right">
                {/* {totals.currency} {invoiceData.items.map((item) => item.pricePerUnit.toFixed(2)).join(", ")} */}
                {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.pricePerUnit, 0)).toFixed(2)}
              </td>
              <td className="border border-gray-300 p-1 text-right">
                {/* {totals.currency} {invoiceData.items.map((item) => item.discountAmount.toFixed(2)).join(", ")} */}
                {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.discountAmount, 0)).toFixed(2)}

              </td>
              {totals.totalTax > 0 && (
                <td className="border border-gray-300 p-1 text-right">
                  {/* {totals.currency} {invoiceData.items.map((item) => item.taxAmount.toFixed(2)).join(", ")} */}
                  {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.taxAmount, 0)).toFixed(2)}
                </td>
              )}
              <td className="border border-gray-300 p-1 text-right">
                {/* {totals.currency} {invoiceData.items.map((item) => item.amount.toFixed(2)).join(", ")} */}
                {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.amount, 0)).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {totals.totalTax > 0 && (
          <div className="p-1 border-b border-gray-300 text-sm">
            Tax Summary:
            <div className="flex">
              <div className="flex-1">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-1">
                        Taxable Amount
                      </th>
                      <th className="border border-gray-300 p-1 text-right">
                        Total Tax
                      </th>
                      {totals.vatAmount > 0 && (
                        <th className="border border-gray-300 p-1 text-right">
                          VAT ({totals.vatRate}%)
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-1 text-right">
                        {/* {totals.currency} {invoiceData.items.map((item) => item.amount.toFixed(2)).join(", ") - invoiceData.items.map((item) => item.taxAmount.toFixed(2)).join(", ") - invoiceData.items.map((item) => item.discountAmount.toFixed(2)).join(", ")} */}
                        {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.pricePerUnit, 0)).toFixed(2)-(invoiceData.items.reduce((sum, item) => sum + item.discountAmount, 0)).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-right">
                        {/* {totals.currency} {totals.totalTax.toFixed(2)} */}
                        {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.taxAmount, 0)).toFixed(2)}
                      </td>
                      {totals.vatAmount > 0 && (
                        <td className="border border-gray-300 p-1 text-right">
                          {/* {totals.currency} {invoiceData.items.map((item) => item.taxAmount.toFixed(2)).join(", ")} */}
                          {totals.currency} {(invoiceData.items.reduce((sum, item) => sum + item.taxAmount, 0)).toFixed(2)}
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Terms and Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-300">
          <div className="p-2 border-b md:border-b-0 md:border-r border-gray-300">
            <div className="text-sm font-semibold">Terms & Conditions:</div>
            <div className="text-sm">Thanks for doing business with us!</div>
          </div>
          <div className="p-2">
            <div className="text-sm font-semibold">
              For {invoiceData.billTo.companyName}:
            </div>
            <div className="h-16"></div>
            <div className="text-sm text-right">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
