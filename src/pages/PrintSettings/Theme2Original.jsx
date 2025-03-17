import React from "react";
import { QrCode } from "lucide-react";
const Theme2Original = ({ invoiceData, isEditable }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-end">
        <h1 className="text-sm">
          {invoiceData.printOriginalForRecipientLabel}
        </h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold">
            {invoiceData.companyName || "NewCompany"}
          </h2>
          <p className="text-sm text-gray-500">Ph. no.: {invoiceData.phone}</p>
          <p className="text-sm text-gray-500">Email: {invoiceData.email}</p>
          <p className="text-sm text-gray-500">
            GSTIN: {invoiceData.trnOnSale}
          </p>
        </div>
        <div>
          <QrCode className="w-16 h-16" />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-bold">Sale</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Bill To:</p>
            <p className="text-sm">{invoiceData.billTo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shipping To:</p>
            <p className="text-sm">{invoiceData.shipTo.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Invoice Details:</p>
            <p className="text-sm">
              Invoice No.: {invoiceData.invoiceDetails.invoiceNo}
            </p>
            <p className="text-sm">Date: {invoiceData.invoiceDetails.date}</p>
            <p className="text-sm">Time: {invoiceData.invoiceDetails.time}</p>
            <p className="text-sm">
              Due Date: {invoiceData.invoiceDetails.dueDate}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-sm">Item Name</th>
                <th className="px-4 py-2 text-left text-sm">HSN/SAC</th>
                <th className="px-4 py-2 text-right text-sm">Quantity</th>
                <th className="px-4 py-2 text-right text-sm">Price/Unit</th>
                <th className="px-4 py-2 text-right text-sm">Discount</th>
                <th className="px-4 py-2 text-right text-sm">GST</th>
                <th className="px-4 py-2 text-right text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-sm">{item.name}</td>
                  <td className="border px-4 py-2 text-sm">{item.hsn}</td>
                  <td className="border px-4 py-2 text-right text-sm">
                    {item.quantity.toFixed(1)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED {item.pricePerUnit.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED {item.discount.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED {item.gst.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            {invoiceData.totalItemQuantityChecked && (
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td
                    className="border px-4 py-2 text-sm text-right"
                    colSpan={2}
                  >
                    Total:
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    {invoiceData.items
                      .reduce((sum, item) => sum + item.quantity, 0)
                      .toFixed(1)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED{" "}
                    {invoiceData.items
                      .reduce((sum, item) => sum + item.pricePerUnit, 0)
                      .toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED{" "}
                    {invoiceData.items
                      .reduce((sum, item) => sum + item.discount, 0)
                      .toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED{" "}
                    {invoiceData.items
                      .reduce((sum, item) => sum + item.gst, 0)
                      .toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    AED{" "}
                    {invoiceData.items
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-bold">Sub Total:</span> AED{" "}
            {invoiceData.summary.subTotal.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-bold">Discount:</span> AED{" "}
            {invoiceData.summary.discount.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-bold">Total Tax (5%):</span> AED{" "}
            {invoiceData.summary.totalTax.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-bold">Invoice Amount in Words:</span>{" "}
            {invoiceData.summary.amountInWords}
          </p>
          {invoiceData.balanceAmountChecked && (
            <p className="text-sm">
              <span className="font-bold">Balance:</span> AED{" "}
              {invoiceData.summary.subTotal.toFixed(2)}
            </p>
          )}
          {invoiceData.currentBalanceOfPartyChecked && (
            <p className="text-sm">
              <span className="font-bold">Current Balance:</span> AED{" "}
              {invoiceData.summary.subTotal.toFixed(2)}
            </p>
          )}
          {invoiceData.youSavedChecked && (
            <p className="text-sm font-bold">
              You Saved: AED {invoiceData.summary.subTotal.toFixed(2)}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <QrCode className="w-16 h-16 mr-4" />
            {invoiceData.receivedAmountChecked && (
              <span className="text-sm">Received AED 12.00</span>
            )}
          </div>
          <div>
            {invoiceData.paymentMode && (
              <p className="text-sm">
                <span className="font-bold">Payment Mode:</span>{" "}
                {invoiceData.paymentMode}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            <span className="font-bold">Terms and Conditions:</span>{" "}
            {invoiceData.terms}
          </p>
        </div>

        {invoiceData.printAcknowledgement && (
          <div className="mt-4 border">
            <div className="border-b text-center py-2">
              <h3 className="text-base font-medium">Acknowledgement</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="border p-2">
                  <h4 className="font-medium">Invoice Details:</h4>
                  <p>Invoice No.: {invoiceData.invoiceDetails.invoiceNo}</p>
                  <p>Invoice Date: {invoiceData.invoiceDetails.date}</p>
                  <p>
                    Invoice Amount: AED{" "}
                    {invoiceData.summary.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="border p-2">
                  <h4 className="font-medium">Party Details:</h4>
                  <p>{invoiceData.billTo.name}</p>
                </div>
                <div className="border p-2 text-center">
                  <h4 className="font-medium">Receiver's Seal & Sign:</h4>
                  <div className="mt-4 w-[80px] h-[80px] border border-gray-400 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Theme2Original;
