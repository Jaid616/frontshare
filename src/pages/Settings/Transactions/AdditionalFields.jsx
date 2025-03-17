import React, { useEffect, useState } from "react";
import NotEditable from "../../PrintSettings/NotEditable.jsx";
import { decodeToken } from "../../../DecodeToken.js";
import db from "../../../config/dbConfig.js";

const AdditionalFields = ({
  additionalFields,
  setAdditionalFields,
  setTransactionChanged,
  transactionChanged,
  setTransactionSettings
}) => {
  const [invoiceData, setInvoiceData] = useState({
    printer: "regular-printer",
    currentTheme: 1,
    companyName: "NewComp",
    phone: "23423423",
    address: "",
    email: "",
    trnOnSale: "",
    paperSize: "A4",
    orientation: "portrait",
    companyNameTextSize: "large",
    invoiceTextSize: "v-small",
    printOriginalDuplicate: false,
    printOriginalForRecipient: true,
    printDuplicate: false,
    printTriplicate: false,
    printOriginalForRecipientLabel: "ORIGINAL FOR RECIPIENT",
    printDuplicateLabel: "DUPLICATE FOR TRANSPORTER",
    printTriplicateLabel: "TRIPLICATE FOR SUPPLIER",
    descriptionFooter: false,
    invoiceDetails: {
      invoiceNo: "INV234",
      date: "03-02-2025",
      time: "12:30 PM",
      dueDate: "17-02-2025",
    },
    billTo: {
      name: "Vyapar tech solutions (Sample Party Name)",
      address: "Sarjapur Road, Bangalore",
      contact: "(+91) 9333 911 911",
    },
    shipTo: {
      name: "Vyapar tech solutions",
      address: "Sarjapur Road, Bangalore",
    },
    items: [
      {
        name: "sample item 1",
        hsn: "",
        quantity: 3,
        pricePerUnit: 100.0,
        discount: 0,
        gst: 0,
        amount: 300.0,
      },
      {
        name: "sample item 2",
        hsn: "",
        quantity: 3,
        pricePerUnit: 150.0,
        discount: 0,
        gst: 0,
        amount: 450.0,
      },
      {
        name: "sample item 3",
        hsn: "",
        quantity: 6,
        pricePerUnit: 100.0,
        discount: 0,
        gst: 0,
        amount: 600.0,
      },
    ],
    summary: {
      subTotal: 1350.0,
      discount: 80.0,
      totalTax: 0,
      totalAmount: 792.0,
      amountInWords: "Seven Hundred Ninety Two Rupees only",
    },
    terms: "Thanks for doing business with us!",
    bankDetails: {
      bankName: "123123123123",
      accountNo: "123123123123",
      ifscCode: "123123123",
    },
    qrCodeSrc: "/api/placeholder/120/120",
    totalItemQuantityChecked: true,
    printDescription: false,
    customerSignature: false,
    customerSignatureTitle: "Customer Signature",
    printAcknowledgement: false,
    additionalFields: {
      firm: [
        { enabled: false, name: "", value: "", showInPrint: false },
        { enabled: false, name: "", value: "", showInPrint: false },
      ],
      transaction: [
        { enabled: false, name: "", value: "", showInPrint: false },
        { enabled: false, name: "", value: "", showInPrint: false },
        { enabled: false, name: "", value: "", showInPrint: false },
      ],
    },
  });
  const [allTransactionSettings, setAllTransactionSettings] = useState();
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {}
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchTransactionSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "transactionSettings"
        );
        console.log(
          newTransactionSettings.data,
          "THis is the new transaction settings"
        );
        if (newTransactionSettings?.data) {
          setInvoiceData((prev) => ({
            ...prev,
            additionalFields: newTransactionSettings?.data?.additionalFields,
          }));
        }
      }
    };

    fetchTransactionSettings();
  }, [phone]);

  const handleFieldChange = (type, index, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      additionalFields: {
        ...prev.additionalFields,
        [type]: prev.additionalFields[type].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleDone = async () => {
    try {
      // Default structure for additional fields
      const defaultField = () => ({
        enabled: false,
        name: "",
        value: "",
        showInPrint: false,
      });
  
      const existingDoc = await db.get(phone);
  
      // Ensure settings exists
      if (!existingDoc.settings) {
        existingDoc.settings = [];
      }
  
      // Find the transactionSettings object in settings array
      let transactionSettings = existingDoc.settings.find(
        (setting) => setting.name === "transactionSettings"
      );
  
      // If transactionSettings is not found, create a new one
      if (!transactionSettings) {
        transactionSettings = { name: "transactionSettings", data: {} };
        existingDoc.settings.push(transactionSettings);
      }
  
      // Ensure transactionSettings.data is an object
      if (!transactionSettings.data || typeof transactionSettings.data !== "object") {
        transactionSettings.data = {};
      }

      transactionSettings.data = {
        ...transactionSettings.data,
        additionalFields: invoiceData.additionalFields,
      };
      setTransactionSettings((prev) => ({
        ...prev,
        additionalFields: invoiceData.additionalFields,
      }))
      console.log(transactionSettings.data, "This is sisisisisisisisisisis");
      await db.put({ ...existingDoc });
  
      console.log(existingDoc, invoiceData.additionalFields, "This is the Updated ExistingDoc");
  
      setTransactionChanged(!transactionChanged);
      setAdditionalFields(!additionalFields);
    } catch (error) {
      console.error("Error updating transaction settings:", error);
    }
  };
  

  useEffect(() => {
    if (allTransactionSettings?.additionalFields) {
      setInvoiceData((prev) => ({
        ...prev,
        additionalFields: {
          ...allTransactionSettings.additionalFields,
        },
      }));

      console.log(
        "Updated Invoice Data:",
        allTransactionSettings.additionalFields
      );
    }
  }, [allTransactionSettings]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Firm</h2>
            <select className="border rounded px-3 py-2 w-64">
              <option>NewComp</option>
            </select>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setAdditionalFields(!additionalFields)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 h-[calc(100%-73px)]">
          {/* Left Panel - Fields Management */}
          <div className="p-6 border-r overflow-y-auto">
            {/* Firm Fields */}
            <div className="mb-8">
              <h3 className="text-gray-600 flex items-center gap-1 mb-4">
                Firm additional fields
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  />
                </svg>
              </h3>
              <div className="space-y-6">
                {invoiceData.additionalFields.firm.map((field, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={(e) =>
                          handleFieldChange(
                            "firm",
                            index,
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-medium">
                        Additional Field {index + 1}
                      </span>
                    </div>
                    {field.enabled && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="block text-sm mb-1">
                            Field Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(
                                "firm",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Enter Field Name"
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Value</label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              handleFieldChange(
                                "firm",
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Show in print</span>
                          <button
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${
                              field.showInPrint ? "bg-blue-500" : "bg-gray-300"
                            }`}
                            onClick={() =>
                              handleFieldChange(
                                "firm",
                                index,
                                "showInPrint",
                                !field.showInPrint
                              )
                            }
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                field.showInPrint ? "translate-x-6" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Fields */}
            <div>
              <h3 className="text-gray-600 flex items-center gap-1 mb-4">
                Transaction additional fields
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  />
                </svg>
              </h3>
              <div className="space-y-6">
                {invoiceData.additionalFields.transaction.map(
                  (field, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) =>
                            handleFieldChange(
                              "transaction",
                              index,
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-medium">
                          Additional Field {index + 1}
                        </span>
                      </div>
                      {field.enabled && (
                        <div className="space-y-3 pl-6">
                          <div>
                            <label className="block text-sm mb-1">
                              Field Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) =>
                                handleFieldChange(
                                  "transaction",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Field Name"
                              className="w-full border rounded px-3 py-2"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Show in print</span>
                            <button
                              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                                field.showInPrint
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                              onClick={() =>
                                handleFieldChange(
                                  "transaction",
                                  index,
                                  "showInPrint",
                                  !field.showInPrint
                                )
                              }
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  field.showInPrint ? "translate-x-6" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Invoice Preview */}
          <div className="overflow-y-auto bg-gray-50">
            <NotEditable invoiceData={invoiceData} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 right-0 p-4 bg-white border-t w-full flex justify-end">
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFields;
