import React from "react";
import { QrCode } from "lucide-react";
const Theme1Triplicate = ({ invoiceData, isEditable }) => {
  return (
    <div className="w-full max-w-2xl border-b border-gray-300 mx-auto bg-white shadow-md rounded-lg p-4 font-sans text-gray-700 text-sm">
      <div className="text-end">
        <h1 className="text-sm">{invoiceData.printTriplicateLabel}</h1>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold">Tax Invoice</h1>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 border-b border-gray-300 pb-4">
        <div>
          {invoiceData.companyName && (
            <h3 className="text-base font-medium">{invoiceData.companyName}</h3>
          )}
          {invoiceData.phone && (
            <p className="text-gray-600">Phone: {invoiceData.phone}</p>
          )}
          {invoiceData.address && (
            <p className="text-gray-600">Address: {invoiceData.address}</p>
          )}
          {invoiceData.email && (
            <p className="text-gray-600">Email: {invoiceData.email}</p>
          )}
          {invoiceData.trnOnSale && (
            <p className="text-gray-600">GSTIN: {invoiceData.trnOnSale}</p>
          )}
        </div>
        <div>
          <h3 className="text-base font-medium">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-1 text-gray-600">
            <p>Invoice No.: {invoiceData.invoiceDetails.invoiceNo}</p>
            <p>Date: {invoiceData.invoiceDetails.date}</p>
            <p>Time: {invoiceData.invoiceDetails.time}</p>
            <p>Due Date: {invoiceData.invoiceDetails.dueDate}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 border-b border-gray-300 pb-4">
        <h3 className="text-base font-medium">Bill To</h3>
        <p className="text-gray-600">
          {invoiceData.billTo.name}, {invoiceData.billTo.address}
        </p>
        <p className="text-gray-600">
          Contact No.: {invoiceData.billTo.contact}
        </p>
      </div>
      <div className="mt-4 border-b border-gray-300 pb-4">
        <h3 className="text-base font-medium">Ship To</h3>
        <p className="text-gray-600">
          {invoiceData.shipTo.name}, {invoiceData.shipTo.address}
        </p>
      </div>
      <div className="mt-4">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1 border-b border-gray-300 text-left">
                Item Name
              </th>
              <th className="p-1 border-b border-gray-300 text-left">
                HSN/SAC
              </th>
              <th className="p-1 border-b border-gray-300 text-right">
                Quantity
              </th>
              <th className="p-1 border-b border-gray-300 text-right">
                Price/Unit
              </th>
              <th className="p-1 border-b border-gray-300 text-right">
                Discount
              </th>
              <th className="p-1 border-b border-gray-300 text-right">GST</th>
              <th className="p-1 border-b border-gray-300 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="p-1 border-b border-gray-300">{item.name}</td>
                <td className="p-1 border-b border-gray-300">{item.hsn}</td>
                <td className="p-1 border-b border-gray-300 text-right">
                  {item.quantity?.toFixed(1)}
                </td>
                <td className="p-1 border-b border-gray-300 text-right">
                  AED {item.pricePerUnit?.toFixed(2)}
                </td>
                <td className="p-1 border-b border-gray-300 text-right">
                  AED {item.discount?.toFixed(2)}
                </td>
                <td className="p-1 border-b border-gray-300 text-right">
                  AED {item.gst?.toFixed(2)}
                </td>
                <td className="p-1 border-b border-gray-300 text-right">
                  AED {item.amount?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          {invoiceData.totalItemQuantityChecked && (
            <tfoot>
              <tr>
                <td
                  className="p-1 border-t border-gray-300 font-bold text-left"
                  colSpan="2"
                >
                  Total
                </td>
                <td className="p-1 border-t border-gray-300 font-bold text-right">
                  {invoiceData.items
                    .reduce((total, item) => total + item.quantity, 0)
                    ?.toFixed(1)}
                </td>
                <td className="p-1 border-t border-gray-300 font-bold text-right">
                  -
                </td>
                <td className="p-1 border-t border-gray-300 font-bold text-right">
                  AED{" "}
                  {invoiceData.items
                    .reduce((total, item) => total + item.discount, 0)
                    ?.toFixed(2)}
                </td>
                <td className="p-1 border-t border-gray-300 font-bold text-right">
                  AED{" "}
                  {invoiceData.items
                    .reduce((total, item) => total + item.gst, 0)
                    ?.toFixed(2)}
                </td>
                <td className="p-1 border-t border-gray-300 font-bold text-right">
                  AED{" "}
                  {invoiceData.items
                    .reduce((total, item) => total + item.amount, 0)
                    ?.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className="mt-4 border border-gray-300">
        {/* Table Header */}
        <div className="border-b border-gray-300 p-2">
          <h3 className="text-base font-medium">Tax Summary</h3>
        </div>

        {/* Table Content */}
        <div className="grid grid-cols-5 text-sm">
          {/* HSN/SAC Column */}
          <div className="border-r border-gray-300 p-2">
            <h4 className="font-medium">HSN/SAC</h4>
            <p>Taxable Amount (AED):</p>
            <p>Rate (%):</p>
            <p>CGST Amount (AED):</p>
            <p>SGST Amount (AED):</p>
            <p>Total Tax Amount (AED):</p>
          </div>

          {/* Data Columns */}
          <div className="border-r border-gray-300 p-2">
            <h4 className="font-medium text-gray-600">AED 50.20</h4>
            <p className="text-gray-600">2.5%</p>
            <p className="text-gray-600">AED 1.26</p>
            <p className="text-gray-600">AED 1.26</p>
            <p className="text-gray-600">AED 2.52</p>
          </div>

          <div className="border-r border-gray-300 p-2">
            <h4 className="font-medium text-gray-600">AED 30.00</h4>
            <p className="text-gray-600">9.0%</p>
            <p className="text-gray-600">AED 2.70</p>
            <p className="text-gray-600">AED 2.70</p>
            <p className="text-gray-600">AED 5.40</p>
          </div>

          {/* Summary Column */}
          <div className="col-span-2 p-2">
            <h4 className="font-medium">Summary</h4>
            <p className="text-gray-600">
              Sub Total: AED {invoiceData.summary.subTotal?.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Discount: AED {invoiceData.summary.discount?.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Tax (5%): AED {invoiceData.summary.totalTax?.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Total: AED {invoiceData.summary.totalAmount?.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Invoice Amount in Words: {invoiceData.summary.amountInWords}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-2 text-sm">
          <div className="border-t border-gray-300 p-2">
            <p>Payment Mode: Credit</p>
          </div>
          <div className="border-t border-gray-300 p-2">
            <p className="text-gray-600">Received: AED 12.00</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-b border-gray-300 pb-4">
        <h3 className="text-base font-medium">Terms & Conditions</h3>
        <p className="text-gray-600">{invoiceData.terms}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <h3 className="text-base font-medium">Bank Details</h3>
          <div className="flex flex-col items-start text-gray-600">
            <p>Bank Name: {invoiceData.bankDetails.bankName}</p>
            <p>Bank Account No.: {invoiceData.bankDetails.accountNo}</p>
            <p>Bank IFSC Code: {invoiceData.bankDetails.ifscCode}</p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <img
            src={invoiceData.qrCodeSrc}
            alt="Bank QR Code"
            className="h-24 w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Theme1Triplicate;
