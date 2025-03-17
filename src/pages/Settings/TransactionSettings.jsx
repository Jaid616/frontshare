import React, { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import AdditionalFields from "./Transactions/AdditionalFields.jsx";
import TransportationDetails from "./Transactions/TransportationDetails.jsx";
import AdditionalCharges from "./Transactions/AddtionalCharges.jsx";
import db from "../../config/dbConfig.js";
import { decodeToken } from "../../DecodeToken.js";
const TransactionSettings = ({
  settings,
  onSettingsChange,
  setTransactionChanged,
  transactionChanged,
  setTransactionSettings
}) => {
  const [additionalFields, setAdditionalFields] = useState(false);
  const [transportDetails, setTransportDetails] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({});
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  console.log(settings, "This is the application")
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
      if (existingDoc && existingDoc.user) {
        const userProfile = existingDoc.user.find(
          (user) => user.phone === phone
        );
        if (userProfile) {
          setBusinessProfile(userProfile);
        }
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

  useEffect(() => {
    if (phone) {
      fetchProfile();
    }
  }, [phone]);

  const handleCheckboxClick = (e) => {
    e.preventDefault();

    if (!settings?.taxesAndTotals?.transactionWiseTax) {
      setShowWarning(true);
    } else {
      onSettingsChange("taxesAndTotals", "transactionWiseTax", false);
    }
  };

  const handleConfirm = () => {
    onSettingsChange("taxesAndTotals", "transactionWiseTax", true);
    setShowWarning(false);
  };

  const handleCancel = () => {
    setShowWarning(false);
  };

  const [prefixes, setPrefixes] = useState({
    sale: [],
    creditNote: [],
    deliveryChallan: [],
    paymentIn: [],
  });

  const [newPrefix, setNewPrefix] = useState("");
  const [openPopovers, setOpenPopovers] = useState({
    sale: false,
    creditNote: false,
    deliveryChallan: false,
    paymentIn: false,
  });

  // Refs for popover positioning and click outside detection
  const popoverRefs = {
    sale: useRef(null),
    creditNote: useRef(null),
    deliveryChallan: useRef(null),
    paymentIn: useRef(null),
  };

  const buttonRefs = {
    sale: useRef(null),
    creditNote: useRef(null),
    deliveryChallan: useRef(null),
    paymentIn: useRef(null),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(popoverRefs).forEach((type) => {
        if (
          popoverRefs[type].current &&
          !popoverRefs[type].current.contains(event.target) &&
          !buttonRefs[type].current.contains(event.target)
        ) {
          setOpenPopovers((prev) => ({ ...prev, [type]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addPrefix = (type) => {
    if (newPrefix.trim()) {
      setPrefixes((prev) => ({
        ...prev,
        [type]: [...prev[type], newPrefix.trim()],
      }));
      setNewPrefix("");
    }
  };

  const removePrefix = (type, prefixToRemove) => {
    setPrefixes((prev) => ({
      ...prev,
      [type]: prev[type].filter((prefix) => prefix !== prefixToRemove),
    }));
  };

  const handleOnClose = () => {
    setAdditionalCharges(!additionalCharges)
  }

  const PrefixManager = ({ type, label }) => (
    <div className="relative">
      <label className="text-sm text-gray-500 mb-2 block">{label}</label>
      <button
        ref={buttonRefs[type]}
        onClick={() =>
          setOpenPopovers((prev) => ({
            ...prev,
            [type]: !prev[type],
          }))
        }
        className="w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
      >
        <span className="text-gray-700">
          {settings?.transactionPrefixes[type] || "None"}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {openPopovers[type] && (
        <div
          ref={popoverRefs[type]}
          className="absolute z-10 mt-1 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="p-4 space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                placeholder="Enter prefix"
                className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => addPrefix(type)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  onSettingsChange("transactionPrefixes", type, "none");
                  setOpenPopovers((prev) => ({ ...prev, [type]: false }));
                }}
              >
                None
              </button>

              {prefixes[type].map((prefix) => (
                <div
                  key={prefix}
                  className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                >
                  <button
                    className="flex-1 text-left px-3 py-1 text-sm hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      onSettingsChange("transactionPrefixes", type, prefix);
                      setOpenPopovers((prev) => ({ ...prev, [type]: false }));
                    }}
                  >
                    {prefix}
                  </button>
                  <button
                    onClick={() => removePrefix(type, prefix)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="max-w-5xl h-full mx-auto p-6 space-y-8">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 relative">
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Warning</h3>
              <p className="text-gray-600">
                According to Government there should not be tax on tax. You have
                enabled item wise tax, so you should not enable transaction
                level tax. Do you wish to continue?
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <section>
          <h2 className="text-lg font-semibold mb-4">Transaction Header</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.header?.invoiceBillNo}
                onChange={(e) =>
                  onSettingsChange("header", "invoiceBillNo", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Invoice/Bill No.</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.header?.addTimeOnTransactions}
                onChange={(e) =>
                  onSettingsChange(
                    "header",
                    "addTimeOnTransactions",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Add Time on Transactions</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.header?.cashSaleByDefault}
                onChange={(e) =>
                  onSettingsChange(
                    "header",
                    "cashSaleByDefault",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Cash Sale by default</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.header?.billingNameOfParties}
                onChange={(e) =>
                  onSettingsChange(
                    "header",
                    "billingNameOfParties",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Billing Name of Parties</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.header?.customersPODetails}
                onChange={(e) =>
                  onSettingsChange(
                    "header",
                    "customersPODetails",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                Customers P.O. Details on Transactions
              </span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
          </div>
        </section>

        {/* Items Table Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Items Table</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.itemsTable?.inclusiveExclusiveTax}
                onChange={(e) =>
                  onSettingsChange(
                    "itemsTable",
                    "inclusiveExclusiveTax",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                Inclusive/Exclusive Tax on Rate(Price/Unit)
              </span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.itemsTable?.displayPurchasePrice}
                onChange={(e) =>
                  onSettingsChange(
                    "itemsTable",
                    "displayPurchasePrice",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Display Purchase Price of Items</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.itemsTable?.showLastFiveSalePrice}
                onChange={(e) =>
                  onSettingsChange(
                    "itemsTable",
                    "showLastFiveSalePrice",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Show last 5 Sale Price of Items</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.itemsTable?.freeItemQuantity}
                onChange={(e) =>
                  onSettingsChange(
                    "itemsTable",
                    "freeItemQuantity",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Free Item Quantity</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.itemsTable?.count}
                onChange={(e) =>
                  onSettingsChange("itemsTable", "count", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Count</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>
          </div>
        </section>

        {/* Taxes & Totals Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Taxes, Discount & Totals
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.taxesAndTotals?.transactionWiseTax}
                onChange={handleCheckboxClick}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Transaction wise Tax</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.taxesAndTotals?.transactionWiseDiscount}
                onChange={(e) =>
                  onSettingsChange(
                    "taxesAndTotals",
                    "transactionWiseDiscount",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Transaction wise Discount</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.taxesAndTotals?.roundOffTotal}
                onChange={(e) =>
                  onSettingsChange(
                    "taxesAndTotals",
                    "roundOffTotal",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Round Off Total</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <div className="flex items-center space-x-4">
              <select
                value={settings?.taxesAndTotals?.roundingMethod}
                onChange={(e) =>
                  onSettingsChange(
                    "taxesAndTotals",
                    "roundingMethod",
                    e.target.value
                  )
                }
                className="w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="nearest">Nearest</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
              <span className="text-sm">To</span>
              <select
                value={settings?.taxesAndTotals?.roundingValue}
                onChange={(e) =>
                  onSettingsChange(
                    "taxesAndTotals",
                    "roundingValue",
                    e.target.value
                  )
                }
                className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="flex gap-[50px]">
        {/* More Features Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            More Transaction Features
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.eWayBillNo}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "eWayBillNo",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">E-way bill no</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.quickEntry}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "quickEntry",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Quick Entry</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.doNotShowInvoicePreview}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "doNotShowInvoicePreview",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Do not Show Invoice Preview</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            {/* <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.moreFeatures.enablePasscodeForEdit}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "enablePasscodeForEdit",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                Enable Passcode for transaction edit/delete
              </span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label> */}

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.discountDuringPayments}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "discountDuringPayments",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Discount During Payments</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.linkPaymentsToInvoices}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "linkPaymentsToInvoices",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Link Payments to Invoices</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings?.moreFeatures?.dueDatesAndPaymentTerms}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "dueDatesAndPaymentTerms",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Due Dates and Payment Terms</span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label>

            {/* <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.moreFeatures.showProfitOnSaleInvoice}
                onChange={(e) =>
                  onSettingsChange(
                    "moreFeatures",
                    "showProfitOnSaleInvoice",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                Show Profit while making Sale Invoice
              </span>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </label> */}
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => setAdditionalFields(!additionalFields)}
              className="bg-gray-300 w-[166px] rounded-full px-3 py-1.5 mt-4 text-blue-600 ml-6 hover:bg-gray-400 transition"
            >
              Additional Fields {">"}
            </button>

            <button
              onClick={() => setTransportDetails(!transportDetails)}
              className="bg-gray-300 w-[205px] rounded-full px-3 py-1.5 mt-4 text-blue-600 ml-6 hover:bg-gray-400 transition"
            >
              Transportation Details {">"}
            </button>

            <button
              onClick={() => setAdditionalCharges(!additionalCharges)}
              className="bg-gray-300 w-[205px] rounded-full px-3 py-1.5 mt-4 text-blue-600 ml-6 hover:bg-gray-400 transition"
            >
              Additional Charges {">"}
            </button>
          </div>
        </section>

        {/* Transaction Prefixes Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Transaction Prefixes</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Firm</label>
              <input
                type="text"
                value={businessProfile?.name}
                readOnly
                placeholder="My Company"
                className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <PrefixManager type="sale" label="Sale" />
              <PrefixManager type="creditNote" label="Credit Note" />
              <PrefixManager type="deliveryChallan" label="Delivery Challan" />
              <PrefixManager type="paymentIn" label="Payment In" />
            </div>
          </div>
        </section>
      </div>
      {additionalFields && (
        <AdditionalFields
          additionalFields={additionalFields}
          setAdditionalFields={setAdditionalFields}
          setTransactionChanged={setTransactionChanged}
          transactionChanged={transactionChanged}
          setTransactionSettings={setTransactionSettings}
        />
      )}
      {transportDetails && (
        <TransportationDetails
          transportDetails={transportDetails}
          setTransportDetails={setTransportDetails}
          setTransactionSettings={setTransactionSettings}
        />
      )}
      {additionalCharges && (
        <AdditionalCharges
          onClose={handleOnClose}
        />
      )}
    </div>
  );
};

export default TransactionSettings;
