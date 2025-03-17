import React, { useState } from "react";
import { QrCode, Upload } from "lucide-react";

const NotEditable = ({ invoiceData }) => {
  const [companyLogo, setCompanyLogo] = useState(null);

  // Validate if invoiceData exists
  if (!invoiceData) {
    return <div>No invoice data available</div>;
  }

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter enabled and printable transaction fields
  const filteredFields = invoiceData.additionalFields?.transaction?.filter(
    (field) => field?.enabled && field?.showInPrint
  ) || [];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center">
        <h1 className="font-bold">Tax Invoice</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 border-b pb-4">
        <div>
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 border rounded overflow-hidden">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full bg-gray-50 hover:bg-gray-100">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
              {companyLogo && (
                <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="font-medium">{invoiceData.companyName || 'Company Name Not Available'}</h3>
              <p>Phone: {invoiceData.phone || 'N/A'}</p>
              {invoiceData.address && <p>Address: {invoiceData.address}</p>}
              {invoiceData.email && <p>Email: {invoiceData.email}</p>}
              {invoiceData.trnOnSale && <p>GSTIN: {invoiceData.trnOnSale}</p>}
            </div>
          </div>

          {/* Firm Additional Fields - Only show enabled fields */}
          {invoiceData.additionalFields?.firm?.filter(
            (field) => field?.enabled && field?.showInPrint
          )?.map((field, index) => (
            <p key={index}>
              {field.name || 'Field'}: {field.value || 'N/A'}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-medium">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-1">
            <p>Invoice No.: {invoiceData.invoiceDetails?.invoiceNo || 'N/A'}</p>
            <p>Date: {invoiceData.invoiceDetails?.date || 'N/A'}</p>
            <p>Time: {invoiceData.invoiceDetails?.time || 'N/A'}</p>
            <p>Due Date: {invoiceData.invoiceDetails?.dueDate || 'N/A'}</p>

            {/* Transaction Additional Fields - Only show enabled fields */}
            {invoiceData.additionalFields?.transaction?.filter(
              (field) => field?.enabled && field?.showInPrint
            )?.map((field, index) => (
              <p key={index}>
                {field.name || 'Field'}: {field.value || 'N/A'}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-b pb-4">
        <h3 className="font-medium">Bill To</h3>
        <p>
          {invoiceData.billTo?.name || 'N/A'}, {invoiceData.billTo?.address || 'N/A'}
        </p>
        <p>Contact No.: {invoiceData.billTo?.contact || 'N/A'}</p>
      </div>

      <div className="mt-4 border-b pb-4">
        <h3 className="font-medium">Ship To</h3>
        <p>
          {invoiceData.shipTo?.name || 'N/A'}, {invoiceData.shipTo?.address || 'N/A'}
        </p>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1 border-b text-left">Item Name</th>
              <th className="p-1 border-b text-left">HSN/SAC</th>
              <th className="p-1 border-b text-right">Quantity</th>
              <th className="p-1 border-b text-right">Price/Unit</th>
              <th className="p-1 border-b text-right">Discount</th>
              <th className="p-1 border-b text-right">GST</th>
              <th className="p-1 border-b text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoiceData.items || []).map((item, index) => (
              <tr key={index}>
                <td className="p-1 border-b">{item?.name || 'N/A'}</td>
                <td className="p-1 border-b">{item?.hsn || 'N/A'}</td>
                <td className="p-1 border-b text-right">{item?.quantity || 0}</td>
                <td className="p-1 border-b text-right">
                  ₹ {item?.pricePerUnit || 0}
                </td>
                <td className="p-1 border-b text-right">₹ {item?.discount || 0}</td>
                <td className="p-1 border-b text-right">₹ {item?.gst || 0}</td>
                <td className="p-1 border-b text-right">₹ {item?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
          {invoiceData.totalItemQuantityChecked && invoiceData.items && (
            <tfoot>
              <tr>
                <td className="p-1 border-t font-bold text-left" colSpan="2">
                  Total
                </td>
                <td className="p-1 border-t font-bold text-right">
                  {invoiceData.items.reduce(
                    (total, item) => total + (item?.quantity || 0),
                    0
                  )}
                </td>
                <td className="p-1 border-t font-bold text-right">-</td>
                <td className="p-1 border-t font-bold text-right">
                  ₹{" "}
                  {invoiceData.items.reduce(
                    (total, item) => total + (item?.discount || 0),
                    0
                  )}
                </td>
                <td className="p-1 border-t font-bold text-right">
                  ₹{" "}
                  {invoiceData.items.reduce(
                    (total, item) => total + (item?.gst || 0),
                    0
                  )}
                </td>
                <td className="p-1 border-t font-bold text-right">
                  ₹{" "}
                  {invoiceData.items.reduce(
                    (total, item) => total + (item?.amount || 0),
                    0
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-100 p-3">
          <h4 className="font-semibold">Invoice Amount In Words</h4>
          <p>{invoiceData.summary?.amountInWords || 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹ {invoiceData.summary?.subTotal || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>₹ {invoiceData.summary?.discount || 0}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {invoiceData.summary?.totalAmount || 0}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-b pb-4 flex items-start justify-between">
        <div className="pr-4 w-1/2">
          <h3 className="font-medium">Terms & Conditions</h3>
          <p>{invoiceData.terms || 'No terms specified'}</p>
        </div>
        {invoiceData.printDescription && (
          <div className="border-l pl-4 w-1/2">
            <h3 className="font-medium">Description</h3>
            <p>{invoiceData.terms || 'No description available'}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="pr-4">
          <QrCode className="w-16 h-16 mr-4" />
          <div>
            <h3 className="font-medium">Bank Details</h3>
            <div className="flex flex-col items-start">
              <p>Bank Name: {invoiceData.bankDetails?.bankName || 'N/A'}</p>
              <p>Bank Account No.: {invoiceData.bankDetails?.accountNo || 'N/A'}</p>
              <p>Bank IFSC Code: {invoiceData.bankDetails?.ifscCode || 'N/A'}</p>
            </div>
          </div>
        </div>
        {invoiceData.customerSignature && (
          <div className="border-l pl-4 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200"></div>
            <span>{invoiceData.customerSignatureTitle || 'Signature'}</span>
          </div>
        )}
      </div>

      {invoiceData.printAcknowledgement && (
        <>
          <div className="relative my-4">
            <div className="border-t border-dotted"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-gray-500 text-sm rotate-90">
              ✂️
            </span>
          </div>
          <div className="border mt-4">
            <div className="border-b text-center py-2">
              <h3 className="font-medium">Acknowledgement</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <span className="text-sm font-medium">Company Details:</span>
                <div className="flex items-center gap-4">
                  {companyLogo && (
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <p className="text-lg font-bold">{invoiceData.companyName || 'Company Name Not Available'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="border p-2">
                  <h4 className="font-medium">Invoice Details:</h4>
                  <p>Invoice No.: {invoiceData.invoiceDetails?.invoiceNo || 'N/A'}</p>
                  <p>Invoice Date: {invoiceData.invoiceDetails?.date || 'N/A'}</p>
                  <p>Invoice Amount: ₹ {invoiceData.summary?.totalAmount || 0}</p>
                </div>
                <div className="border p-2">
                  <h4 className="font-medium">Party Details:</h4>
                  <p>{invoiceData.billTo?.name || 'N/A'}</p>
                  <p>{invoiceData.billTo?.address || 'N/A'}</p>
                </div>
                <div className="border p-2 text-center">
                  <h4 className="font-medium">Receiver's Seal & Sign:</h4>
                  <div className="mt-4 w-20 h-20 border mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotEditable;