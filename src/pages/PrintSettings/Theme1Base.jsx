import React, { useCallback, useEffect, useState, useRef } from "react";
import { QrCode } from "lucide-react";
import { Rnd } from "react-rnd";
import { useLocation, useNavigate } from "react-router-dom";
import db from "../../config/dbConfig";
import { decodeToken } from "../../DecodeToken";

const Theme1Base = () => {
  const location = useLocation();
  const [profile, setProfile] = useState({});
  const { invoiceData } = location?.state;
  const navigate = useNavigate();
  const [styles, setStyles] = useState({
    fontSize: "text-sm",
    fontFamily: "font-sans",
    headerSize: "text-xl",
    subheaderSize: "text-base",
    spacing: "space-y-4",
    tableFontSize: "text-xs",
    headerBgColor: "bg-gray-100",
    headerTextColor: "text-gray-700",
    sectionHeaderColor: "text-gray-700",
    borderColor: "border-gray-300",
    accentColor: "bg-gray-50",
    pageWidth: "max-w-3xl",
    pageMargin: "mx-auto",
    pagePadding: "p-4",
  });
  const [businessProfile, setBusinessProfile] = useState({});
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
  console.log(invoiceData, "This is the Invoice");
  useEffect(() => {
    if (phone) {
      fetchProfile();
    }
  }, [phone]);

  const [sections, setSections] = useState([
    {
      id: "header",
      title: "Header",
      component: "header",
      isVisible: false,
      x: 0,
      y: 0,
      width: 400,
      height: 50,
    },
    {
      id: "invoice-details",
      title: "Invoice Details",
      component: "invoiceDetails",
      isVisible: false,
      x: 0,
      y: 60,
      width: 400,
      height: 150,
    },
    {
      id: "bill-to",
      title: "Bill To",
      component: "billTo",
      isVisible: false,
      x: 0,
      y: 220,
      width: 200,
      height: 100,
    },
    {
      id: "ship-to",
      title: "Ship To",
      component: "shipTo",
      isVisible: false,
      x: 220,
      y: 220,
      width: 200,
      height: 100,
    },
    {
      id: "transportationDetails",
      title: "Transportation Details",
      component: "transportationDetails",
      isVisible: false,
      x: 220,
      y: 220,
      width: 400,
      height: 100,
    },
    {
      id: "items",
      title: "Items Table",
      component: "items",
      isVisible: false,
      x: 0,
      y: 330,
      width: 600,
      height: 200,
    },
    {
      id: "tax-summary",
      title: "Tax Summary",
      component: "summary",
      isVisible: true,
      x: 0,
      y: 540,
      width: 300,
      height: 100,
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      component: "terms",
      isVisible: false,
      x: 310,
      y: 540,
      width: 300,
      height: 100,
    },
    {
      id: "bank-details",
      title: "Bank Details",
      component: "bankDetails",
      isVisible: true,
      x: 0,
      y: 650,
      width: 300,
      height: 100,
    },
    {
      id: "acknowledgement",
      title: "Acknowledgement",
      component: "acknowledgement",
      isVisible: false,
      x: 310,
      y: 650,
      width: 300,
      height: 100,
    },
  ]);

  const toggleSectionVisibility = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      )
    );
  };

  const updateSectionPosition = useCallback(
    (id, x, y, width, height) => {
      setSections(
        sections.map((section) =>
          section.id === id ? { ...section, x, y, width, height } : section
        )
      );
    },
    [sections]
  );

  const CompanyLogo = ({ logo, onUpload }) => {
    const fileInputRef = useRef(null);

    const handleClick = (e) => {
      e.stopPropagation(); // Prevent unintended drag events
      fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    };

    const handleFileUpload = (file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log("File uploaded successfully");
          onUpload(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Invalid file type");
      }
    };

    const handleFileChange = (e) => {
      console.log("File input changed", e.target.files);
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };

    return (
      <div
        className="w-24 h-24 flex-shrink-0 cursor-pointer"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {logo ? (
          <img
            src={logo}
            alt="Company Logo"
            className="w-full h-full object-contain border rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 border rounded flex flex-col items-center justify-center text-gray-500 text-xs text-center p-2">
            <svg
              className="w-8 h-8 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Upload Company Logo</span>
          </div>
        )}
      </div>
    );
  };

  const updateInvoiceLogo = (logoUrl) => {
    setInvoiceData((prev) => ({
      ...prev,
      companyLogo: logoUrl,
    }));
  };

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
      let taxRate = parseFloat(item.tax.match(/\d+/)?.[0]) || 0;

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

  const renderSection = (section) => {
    if (!section.isVisible) return null;

    switch (section.component) {
      case "header":
        return (
          <div className="text-center py-2 text-lg font-semibold">
            Tax Invoice
          </div>
        );

      case "invoiceDetails":
        return (
          <div className="bg-gray-200 flex p-4 border-t border-b border-gray-300">
            <div
              className="pointer-events-none"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="pointer-events-auto"
                style={{ pointerEvents: "auto" }}
              >
                {invoiceData.companyLogo ? (
                  <CompanyLogo
                    logo={invoiceData.companyLogo}
                    onUpload={updateInvoiceLogo}
                  />
                ) : (
                  <div className="bg-gray-500 w-20 h-20 flex items-center justify-center text-white">
                    LOGO
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <div className="text-xl font-semibold text-gray-700">
                {invoiceData.billTo.companyName}
              </div>
              <div className="text-sm mt-1">
                Phone: {invoiceData.phone || invoiceData.billTo.companyPhone}
              </div>
              {invoiceData.address && (
                <div className="text-sm mt-1">
                  Address: {invoiceData.address}
                </div>
              )}
              {invoiceData.email && (
                <div className="text-sm mt-1">Email: {invoiceData.email}</div>
              )}
              {invoiceData.trnOnSale && (
                <div className="text-sm mt-1">
                  GSTIN: {invoiceData.trnOnSale}
                </div>
              )}
              {/* Firm Additional Fields */}
              {invoiceData.additionalFields?.firm?.map((field, index) => (
                <div key={index} className="text-sm mt-1">
                  {field.name}: {field.value}
                </div>
              ))}
            </div>
          </div>
        );

      case "billTo":
        return (
          <div className="grid grid-cols-2">
            <div className="border-r border-b border-gray-300 p-2">
              <div className="font-semibold">Bill To:</div>
              <div>{invoiceData.billTo.name}</div>
              <div>
                {invoiceData.billTo.address || invoiceData.billTo.partyAddress}
              </div>
              <div className="flex space-x-4">
                <span>
                  Contact No:{" "}
                  {invoiceData.billTo.contact || invoiceData.billTo.partyPhone}
                </span>
                {invoiceData.billTo.partyState && (
                  <span>State: {invoiceData.billTo.partyState}</span>
                )}
              </div>
            </div>
            <div className="border-b border-gray-300 p-2">
              <div className="font-semibold">Invoice Details:</div>
              <div>
                No: {invoiceData.invoiceDetails?.prefix || ""}
                {invoiceData.invoiceDetails.invoiceNo}
              </div>
              <div>Date: {invoiceData.invoiceDetails.date}</div>
              {invoiceData.invoiceDetails.time && (
                <div>Time: {invoiceData.invoiceDetails.time}</div>
              )}
              {invoiceData.invoiceDetails.stateOfSupply && (
                <div>
                  Place Of Supply: {invoiceData.invoiceDetails.stateOfSupply}
                </div>
              )}
              {invoiceData.invoiceDetails.poDate && (
                <div>PO Date: {invoiceData.invoiceDetails.poDate}</div>
              )}
              {invoiceData.invoiceDetails.poNumber && (
                <div>PO Number: {invoiceData.invoiceDetails.poNumber}</div>
              )}
              {invoiceData.invoiceDetails.ewaybill && (
                <div>
                  E-way Bill number: {invoiceData.invoiceDetails.ewaybill}
                </div>
              )}
              {invoiceData.invoiceDetails?.dynamicInvoiceFields &&
                Object.entries(
                  invoiceData.invoiceDetails.dynamicInvoiceFields
                ).map(([key, value], index) => (
                  <div key={index}>
                    {key}: {value}
                  </div>
                ))}
            </div>
          </div>
        );

      case "transportationDetails":
        return (
          <div className="w-full border-b p-4">
            <div className="text-sm font-semibold mb-2">
              Transportation Details:
            </div>
            <div className="space-y-1">
              {invoiceData.transportationDetails?.map((detail, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{detail.name}:</span>
                  <span className="ml-1">{detail.inputValue}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "items":
        return (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-left">#</th>
                <th className="border border-gray-300 p-1 text-left">
                  Item name
                </th>
                <th className="border border-gray-300 p-1 text-left">
                  HSN/SAC
                </th>
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
                const discountAmount =
                  item.discountAmount || (item.discount / 100) * itemTotal;
                const taxableAmount = itemTotal - discountAmount;
                const taxAmount =
                  item.taxAmount || (item.tax / 100) * taxableAmount;
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 p-1">{index + 1}</td>
                    <td className="border border-gray-300 p-1">{item.name}</td>
                    <td className="border border-gray-300 p-1">
                      {item.hsn || ""}
                    </td>
                    {item.freeItemQuantity ? (
                      <td className="border border-gray-300 p-1 text-center">
                        {item.quantity} + {item.freeItemQuantity}
                      </td>
                    ) : (
                      <td className="border border-gray-300 p-1 text-center">
                        {item.quantity}
                      </td>
                    )}
                    <td className="border border-gray-300 p-1 text-right">
                      {totals.currency} {item.pricePerUnit.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-1 text-right">
                      {totals.currency} {discountAmount.toFixed(2)}
                    </td>
                    {totals.totalTax > 0 && (
                      <td className="border border-gray-300 p-1 text-right">
                        {totals.currency} {taxAmount.toFixed(2)}
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
                  {invoiceData.totalItemQuantityChecked
                    ? totals.currency +
                      " " +
                      invoiceData.items
                        .reduce((sum, item) => sum + item.pricePerUnit, 0)
                        .toFixed(2)
                    : invoiceData.items
                        .map(
                          (item) =>
                            totals.currency + " " + item.pricePerUnit.toFixed(2)
                        )
                        .join(", ")}
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {invoiceData.totalItemQuantityChecked
                    ? totals.currency +
                      " " +
                      invoiceData.items
                        .reduce((sum, item) => {
                          const itemTotal = item.quantity * item.pricePerUnit;
                          return (
                            sum +
                            (item.discountAmount ||
                              (item.discount / 100) * itemTotal)
                          );
                        }, 0)
                        .toFixed(2)
                    : invoiceData.items
                        .map((item) => {
                          const itemTotal = item.quantity * item.pricePerUnit;
                          const discountAmount =
                            item.discountAmount ||
                            (item.discount / 100) * itemTotal;
                          return (
                            totals.currency + " " + discountAmount.toFixed(2)
                          );
                        })
                        .join(", ")}
                </td>
                {totals.totalTax > 0 && (
                  <td className="border border-gray-300 p-1 text-right">
                    {invoiceData.totalItemQuantityChecked
                      ? totals.currency +
                        " " +
                        invoiceData.items
                          .reduce((sum, item) => {
                            const itemTotal = item.quantity * item.pricePerUnit;
                            const discountAmount =
                              item.discountAmount ||
                              (item.discount / 100) * itemTotal;
                            const taxableAmount = itemTotal - discountAmount;
                            return (
                              sum +
                              (item.taxAmount ||
                                (item.tax / 100) * taxableAmount)
                            );
                          }, 0)
                          .toFixed(2)
                      : invoiceData.items
                          .map((item) => {
                            const itemTotal = item.quantity * item.pricePerUnit;
                            const discountAmount =
                              item.discountAmount ||
                              (item.discount / 100) * itemTotal;
                            const taxableAmount = itemTotal - discountAmount;
                            const taxAmount =
                              item.taxAmount ||
                              (item.tax / 100) * taxableAmount;
                            return totals.currency + " " + taxAmount.toFixed(2);
                          })
                          .join(", ")}
                  </td>
                )}
                <td className="border border-gray-300 p-1 text-right">
                  {invoiceData.totalItemQuantityChecked
                    ? totals.currency +
                      " " +
                      invoiceData.items
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toFixed(2)
                    : invoiceData.items
                        .map(
                          (item) =>
                            totals.currency + " " + item.amount.toFixed(2)
                        )
                        .join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        );

      case "summary":
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {invoiceData.summary?.amountInWords && (
              <div className="bg-gray-100 p-3 border">
                <h4 className="font-semibold border-b pb-1 mb-2">
                  Invoice Amount In Words
                </h4>
                <p>{invoiceData.summary.amountInWords}</p>
              </div>
            )}
            <div className="space-y-2 border p-3">
              <div className="flex justify-between border-b pb-1">
                <span>Sub Total</span>
                <span>
                  {totals.currency} {invoiceData.summary.subTotal}
                </span>
              </div>
              {invoiceData.additionalCharges?.map((charge, index) => (
                <div key={index} className="flex justify-between border-b pb-1">
                  <span>{charge.name}</span>
                  <span>
                    {totals.currency} {charge.value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-b pb-1">
                <span>Discount</span>
                <span>
                  {totals.currency} {invoiceData.summary.discount}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {totals.currency} {invoiceData.summary.totalAmount}
                </span>
              </div>
            </div>
          </div>
        );

      case "terms":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-300">
            <div className="p-2 border-b md:border-b-0 md:border-r border-gray-300">
              <div className="text-sm font-semibold">Terms & Conditions:</div>
              <div className="text-sm">
                {invoiceData.terms || "Thanks for doing business with us!"}
              </div>
            </div>
            {invoiceData.printDescription ? (
              <div className="p-2">
                <div className="text-sm font-semibold">Description:</div>
                <div className="text-sm">{invoiceData.description}</div>
              </div>
            ) : (
              <div className="p-2">
                <div className="text-sm font-semibold">
                  For{" "}
                  {invoiceData.companyName || invoiceData.billTo.companyName}:
                </div>
                <div className="h-16"></div>
                <div className="text-sm text-right">Authorized Signatory</div>
              </div>
            )}
          </div>
        );

      case "bankDetails":
        return (
          <div className="grid grid-cols-2 gap-2 mt-4 border">
            <div className="pr-4 p-2 border-r">
              <QrCode className="w-16 h-16 mr-4" />
              <div>
                <h3 className="font-medium border-b pb-1 mb-2">Bank Details</h3>
                <div className="flex flex-col items-start">
                  <p className="border-b py-1">
                    Bank Name: {invoiceData.bankDetails?.bankName}
                  </p>
                  <p className="border-b py-1">
                    Bank Account No.: {invoiceData.bankDetails?.accountNo}
                  </p>
                  <p className="border-b py-1">
                    Bank IFSC Code: {invoiceData.bankDetails?.ifscCode}
                  </p>
                </div>
              </div>
            </div>
            {invoiceData.customerSignature && (
              <div className="pl-4 flex flex-col items-center justify-center border-l p-2">
                <div className="w-20 h-20 bg-gray-200 border mb-2"></div>
                <span>
                  {invoiceData?.customerSignatureTitle || "Customer Signature"}
                </span>
              </div>
            )}
          </div>
        );

      case "acknowledgement":
        return (
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
                <div className="mb-4 border p-2">
                  <span className="text-sm font-medium">Company Details:</span>
                  <p className="text-lg font-bold">
                    {invoiceData.companyName || invoiceData.billTo.companyName}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="border p-2">
                    <h4 className="font-medium border-b pb-1 mb-2">
                      Invoice Details:
                    </h4>
                    <p className="border-b py-1">
                      Invoice No.: {invoiceData.invoiceDetails.invoiceNo}
                    </p>
                    <p className="border-b py-1">
                      Invoice Date: {invoiceData.invoiceDetails.date}
                    </p>
                    <p>
                      Invoice Amount: {totals.currency}{" "}
                      {invoiceData.summary.totalAmount}
                    </p>
                  </div>
                  <div className="border p-2">
                    <h4 className="font-medium border-b pb-1 mb-2">
                      Party Details:
                    </h4>
                    <p className="border-b py-1">{invoiceData.billTo.name}</p>
                    <p>
                      {invoiceData.billTo.address ||
                        invoiceData.billTo.partyAddress}
                    </p>
                  </div>
                  <div className="border p-2 text-center">
                    <h4 className="font-medium border-b pb-1 mb-2">
                      Receiver's Seal & Sign:
                    </h4>
                    <div className="mt-4 w-20 h-20 border mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const StyleControls = () => {
    const fontSizeOptions = [
      { value: "text-xs", label: "Extra Small" },
      { value: "text-sm", label: "Small" },
      { value: "text-base", label: "Medium" },
      { value: "text-lg", label: "Large" },
    ];

    const fontFamilyOptions = [
      { value: "font-sans", label: "Sans Serif" },
      { value: "font-serif", label: "Serif" },
      { value: "font-mono", label: "Monospace" },
    ];

    const headerSizeOptions = [
      { value: "text-lg", label: "Small Header" },
      { value: "text-xl", label: "Medium Header" },
      { value: "text-2xl", label: "Large Header" },
    ];

    const subheaderSizeOptions = [
      { value: "text-sm", label: "Small Subheader" },
      { value: "text-base", label: "Medium Subheader" },
      { value: "text-lg", label: "Large Subheader" },
    ];

    const spacingOptions = [
      { value: "space-y-2", label: "Compact" },
      { value: "space-y-4", label: "Normal" },
      { value: "space-y-6", label: "Relaxed" },
    ];

    const colorOptions = [
      { value: "gray", label: "Gray" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
      { value: "pink", label: "Pink" },
      { value: "orange", label: "Orange" },
    ];

    const getColorClasses = (color) => {
      const colorMap = {
        gray: {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-300",
          header: "text-gray-700",
          accent: "bg-gray-50",
        },
        blue: {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-300",
          header: "text-blue-700",
          accent: "bg-blue-50",
        },
        green: {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-300",
          header: "text-green-700",
          accent: "bg-green-50",
        },
        purple: {
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-300",
          header: "text-purple-700",
          accent: "bg-purple-50",
        },
        pink: {
          bg: "bg-pink-100",
          text: "text-pink-700",
          border: "border-pink-300",
          header: "text-pink-700",
          accent: "bg-pink-50",
        },
        orange: {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-300",
          header: "text-orange-700",
          accent: "bg-orange-50",
        },
      };
      return colorMap[color];
    };

    const handleColorChange = (e) => {
      const colorClasses = getColorClasses(e.target.value);
      setStyles({
        ...styles,
        headerBgColor: colorClasses.bg,
        headerTextColor: colorClasses.text,
        borderColor: colorClasses.border,
        sectionHeaderColor: colorClasses.header,
        accentColor: colorClasses.accent,
      });
    };

    const pageWidthOptions = [
      { value: "max-w-xl", label: "Extra Small" },
      { value: "max-w-2xl", label: "Small" },
      { value: "max-w-3xl", label: "Medium" },
      { value: "max-w-4xl", label: "Large" },
      { value: "max-w-5xl", label: "Extra Large" },
      { value: "max-w-full", label: "Full Width" },
    ];

    const pageMarginOptions = [
      { value: "mx-auto", label: "Centered", uniqueKey: "centered-margin" },
      {
        value: "mx-0",
        label: "Left Aligned",
        uniqueKey: "left-aligned-margin",
      },
      {
        value: "ml-auto",
        label: "Right Aligned",
        uniqueKey: "right-aligned-margin",
      },
    ];

    const pagePaddingOptions = [
      { value: "p-2", label: "Extra Compact" },
      { value: "p-4", label: "Compact" },
      { value: "p-6", label: "Normal" },
      { value: "p-8", label: "Spacious" },
      { value: "p-12", label: "Extra Spacious" },
    ];

    return (
      <div className="space-y-6">
        <div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white text-xl shadow-md transition"
            onClick={() => navigate(-2)}
          >
            ✖
          </button>
          <h2 className="text-lg font-semibold mb-4">Style Controls</h2>

          {/* Color Theme Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Color Theme
            </label>
            <select
              className="w-full p-2 border rounded"
              onChange={handleColorChange}
              value={styles.headerBgColor.split("-")[1]}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Body Font Size
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.fontSize}
              onChange={(e) =>
                setStyles({ ...styles, fontSize: e.target.value })
              }
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table Font Size Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Table Font Size
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.tableFontSize}
              onChange={(e) =>
                setStyles({ ...styles, tableFontSize: e.target.value })
              }
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Family Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Font Family
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.fontFamily}
              onChange={(e) =>
                setStyles({ ...styles, fontFamily: e.target.value })
              }
            >
              {fontFamilyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Header Size Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Header Size
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.headerSize}
              onChange={(e) =>
                setStyles({ ...styles, headerSize: e.target.value })
              }
            >
              {headerSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subheader Size Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Subheader Size
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.subheaderSize}
              onChange={(e) =>
                setStyles({ ...styles, subheaderSize: e.target.value })
              }
            >
              {subheaderSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Spacing Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Section Spacing
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.spacing}
              onChange={(e) =>
                setStyles({ ...styles, spacing: e.target.value })
              }
            >
              {spacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Page Width Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Page Width</label>
            <select
              className="w-full p-2 border rounded"
              value={styles.pageWidth}
              onChange={(e) =>
                setStyles({ ...styles, pageWidth: e.target.value })
              }
            >
              {pageWidthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Page Alignment
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.pageMargin}
              onChange={(e) =>
                setStyles({ ...styles, pageMargin: e.target.value })
              }
            >
              {pageMarginOptions.map((option) => (
                <option key={option.uniqueKey} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Page Padding Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Page Padding
            </label>
            <select
              className="w-full p-2 border rounded"
              value={styles.pagePadding}
              onChange={(e) =>
                setStyles({ ...styles, pagePadding: e.target.value })
              }
            >
              {pagePaddingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Reordering with Checkboxes */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Section Order</h3>
          <p className="text-sm text-gray-600 mb-4">
            Toggle sections visibility and drag to reorder
          </p>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center p-3 bg-white rounded border cursor-move hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={section.isVisible}
                  onChange={() => toggleSectionVisibility(section.id)}
                  className="mr-3 h-4 w-4 rounded border-gray-300"
                />
                {section.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[100vh]">
      {/* Style Controls Panel */}
      <div className="w-1/3 bg-gray-50 p-4 rounded-lg overflow-y-auto">
        <StyleControls />
      </div>

      {/* Invoice Preview */}
      <div className="w-2/3 overflow-y-auto">
        <div
          className={`w-full ${styles.pageWidth} ${styles.pageMargin} bg-white shadow-md rounded-lg ${styles.pagePadding} ${styles.fontFamily} ${styles.fontSize} text-gray-700 ${styles.spacing} h-full`}
        >
          {sections.map((section) => (
            <Rnd
              key={section.id}
              size={{
                width: section.width,
                height: section.height,
              }}
              position={{ x: section.x, y: section.y }}
              onDragStop={(e, d) =>
                updateSectionPosition(
                  section.id,
                  d.x,
                  d.y,
                  section.width,
                  section.height
                )
              }
              onResizeStop={(e, direction, ref, delta, position) => {
                const newWidth = ref.clientWidth;
                const newHeight = ref.clientHeight;

                updateSectionPosition(
                  section.id,
                  position.x,
                  position.y,
                  newWidth,
                  newHeight
                );
              }}
              bounds="parent"
              enableResizing={{
                bottom: true,
                bottomLeft: true,
                bottomRight: true,
                left: true,
                right: true,
                top: true,
                topLeft: true,
                topRight: true,
              }}
            >
              <div className="h-full w-full">{renderSection(section)}</div>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme1Base;
