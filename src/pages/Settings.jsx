import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PrintSettingPage from "./PrintSettings/PrintSettingPage.jsx";
import GeneralSettings from "./Settings/GeneralSettings.jsx";
import ItemSettings from "./Settings/ItemSettings.jsx";
import GSTSettings from "./Settings/GSTSettings.jsx";
import PartySettings from "./Settings/PartySettings.jsx";
import TransactionMessage from "./Settings/TransactionMessage.jsx";
import TransactionSettings from "./Settings/TransactionSettings.jsx";
import { jwtDecode } from "jwt-decode";
import { serviceUrl } from "../Services/url.js";
import db from "../config/dbConfig.js";
import { decodeToken } from "../DecodeToken.js";

const Settings = () => {
  const [activePage, setActivePage] = useState("GENERAL");

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

  const [transactionChanged, setTransactionChanged] = useState(false);
  const [email, setEmail] = useState(null);

  const [gstSettings, setGstSettings] = useState({
    taxRates: [],
    taxGroups: [],
    gstEnabled: false,
    hsnEnabled: false,
    additionalCess: false,
    reverseCharge: false,
    placeOfSupply: false,
    compositeScheme: false,
    tcsEnabled: false,
    tdsEnabled: false,
  });
  const [transactionMessageSettings, setTransactionMessageSettings] = useState({
    messageType: "Sales Transaction",
    sendSMS: false,
    sendCopy: false,
    transactionType: "Sales Transaction",
    whatsappLoggedIn: false,
    messageTemplate: {
      greeting: "Greetings from [Firm_Name]",
      intro:
        "We are pleased to have you as a valuable customer. Please find the details of your transaction.",
      transactionLabel: "[Transaction_Type] :",
      invoiceAmount: "Invoice Amount: [Invoice_Amount]",
      balance: "Balance: [Transaction_Balance]",
      thanks: "Thanks for doing business with us.",
      regards: "Regards,",
      firmName: "[Firm_Name]",
    },
    variables: {
      firmName: "NewCompany",
      transactionType: "Sale Invoice",
      invoiceAmount: "792",
      balance: "0",
    },
  });

  const [generalSettings, setGeneralSettings] = useState({
    enablePasscode: false,
    passcode: "",
    confirmPasscode: "",
    businessCurrency: "USD",
    amount: "0.00",
    gstnumber: false,
    multiFirm: false,
    company: "DEFAULT",
    autoBackup: false,
    auditTrail: false,
    screenZoom: 100,
    showPasscodeDialog: false,
    // Additional transactions
    estimateQuotation: false,
    salePurchaseOrder: false,
    otherIncome: false,
    fixedAssets: false,
    deliveryChallan: false,
    goodsReturnOnDeliveryChallan: false,
    printAmountInDeliveryChallan: false,
    // Godown management
    godownManagement: false,
    email: "",
  });

  const [transactionSettings, setTransactionSettings] = useState({
    header: {
      invoiceBillNo: true,
      addTimeOnTransactions: false,
      cashSaleByDefault: false,
      billingNameOfParties: false,
      customersPODetails: false,
    },
    itemsTable: {
      inclusiveExclusiveTax: true,
      displayPurchasePrice: true,
      showLastFiveSalePrice: false,
      freeItemQuantity: false,
      count: false,
    },
    taxesAndTotals: {
      transactionWiseTax: false,
      transactionWiseDiscount: false,
      roundOffTotal: true,
      roundingMethod: "nearest",
      roundingValue: "1",
    },
    moreFeatures: {
      eWayBillNo: false,
      quickEntry: false,
      doNotShowInvoicePreview: false,
      enablePasscodeForEdit: false,
      discountDuringPayments: false,
      linkPaymentsToInvoices: false,
      dueDatesAndPaymentTerms: false,
      showProfitOnSaleInvoice: false,
    },
    transactionPrefixes: {
      firm: "",
      sale: "none",
      creditNote: "none",
      deliveryChallan: "none",
      paymentIn: "none",
    },
    additionalFields: {
      firm: [
        {
          enabled: false,
          name: "",
          value: "",
          showInPrint: false,
        },
        {
          enabled: false,
          name: "",
          value: "",
          showInPrint: false,
        },
      ],
      transaction: [
        {
          enabled: false,
          name: "",
          value: "",
          showInPrint: false,
        },
        {
          enabled: false,
          name: "",
          value: "",
          showInPrint: false,
        },
        {
          enabled: false,
          name: "",
          value: "",
          showInPrint: false,
        },
      ],
    },
    additionalCharges: [
      {
        enabled: false,
        name: "Shipping",
        sac: "",
        tax: "NONE",
        enableTax: false,
      },
      {
        enabled: false,
        name: "Packaging",
        sac: "",
        tax: "NONE",
        enableTax: false,
      },
      {
        enabled: false,
        name: "Adjustment",
        sac: "",
        tax: "NONE",
        enableTax: false,
      },
    ],
    transportationDetails: [
      { enable: false, value: "", index: 0 },
      { enable: false, value: "", index: 1 },
      { enable: false, value: "", index: 2 },
      { enable: false, value: "", index: 3 },
      { enable: false, value: "", index: 4 },
      { enable: false, value: "", index: 5 },
    ],
  });

  const [partySettings, setPartySettings] = useState({
    partyGrouping: false,
    shippingAddress: false,
    enablePaymentReminder: true,
    paymentReminderDays: 1,
    reminderMessage: {
      additionalMessage: "",
      defaultMessage:
        "If you have already made the payment, kindly ignore this message.",
    },
    additionalFields: [
      {
        enabled: false,
        fieldName: "",
        showInPrint: false,
        type: "text", // For field 4, this would be "date"
      },
      {
        enabled: false,
        fieldName: "",
        showInPrint: false,
        type: "text",
      },
      {
        enabled: false,
        fieldName: "",
        showInPrint: false,
        type: "text",
      },
      {
        enabled: false,
        fieldName: "",
        showInPrint: false,
        type: "date",
      },
    ],
    loyaltyPoints: {
      enabled: true,
    },
  });

  const [invoiceData, setInvoiceData] = useState({
    printer: "regular-printer",
    currentTheme: 1,
    companyName: "NewCompany",
    phone: "7892737777",
    address: "",
    email: "",
    trnOnSale: "",
    paperSize: "A4", // Added paperSize field
    orientation: "portrait", // Added orientation field
    companyNameTextSize: "large", // Added companyNameTextSize field
    invoiceTextSize: "v-small", // Added invoiceTextSize field
    printOriginalDuplicate: false, // Added printOriginalDuplicate field
    printOriginalForRecipient: true, // Added printOriginalForRecipient field
    printDuplicate: false, // Added printDuplicate field
    printTriplicate: false, // Added printTriplicate field
    printOriginalForRecipientLabel: "ORIGINAL FOR RECIPIENT",
    printDuplicateLabel: "DUPLICATE FOR TRANSPORTER",
    printTriplicateLabel: "TRIPLICATE FOR SUPPLIER",
    descriptionFooter: false,
    invoiceDetails: {
      invoiceNo: "Inv. 101",
      date: "02-07-2019",
      time: "12:30 PM",
      dueDate: "17-07-2019",
    },
    billTo: {
      name: "Classic enterprises",
      address: "Plot No. 1, Shop No. 6, Koramangala, Bangalore, 560014",
      contact: "888888888",
    },
    shipTo: {
      name: "Mehra Textiles",
      address: "Marathalli Road, Bangalore, Karnataka, 560014",
    },
    items: [
      {
        name: "ITEM 1",
        hsn: "1234",
        quantity: 1.1,
        pricePerUnit: 10.0,
        discount: 0.1,
        gst: 0.5,
        amount: 11.4,
      },
      {
        name: "ITEM 2",
        hsn: "6325",
        quantity: 1.1,
        pricePerUnit: 30.0,
        discount: 0.6,
        gst: 1.4,
        amount: 34.4,
      },
    ],
    taxDetails: {
      taxableAmount: 40.2,
      rate: 2.5,
      sgstAmount: 1.0,
      cgstAmount: 1.0,
      totalTaxAmount: 2.0,
    },
    summary: {
      subTotal: 45.8,
      discount: 5.5,
      totalTax: 2.0,
      totalAmount: 42.32,
      amountInWords: "Forty-Two Dirhams and Thirty-Two Fills only",
    },
    terms: "Thanks for doing business with us!",
    bankDetails: {
      bankName: "123123123123",
      accountNo: "123123123123",
      ifscCode: "123123123",
    },
    qrCodeSrc: "/api/placeholder/120/120",
    totalItemQuantityChecked: false,
    amountWithDecimalChecked: false,
    receivedAmountChecked: false,
    balanceAmountChecked: false,
    currentBalanceOfPartyChecked: false,
    taxDetailsChecked: false,
    youSavedChecked: false,
    printAmountWithGroupingChecked: false,
    printDescription: false,
    customerSignature: false,
    customerSignatureTitle: "Customer Signature",
    printAcknowledgement: false,
    paymentMode: false,
  });
  const [selectedTheme, setSelectedTheme] = useState("theme-1");

  const [printerSettings, setPrinterSettings] = useState({
    pageSize: "4-inch",
    makeDefault: false,
    useTextStyling: true,
    autoCutPaper: false,
    openCashDrawer: false,
    extraLines: 0,
    numberOfCopies: 1,
    colors: "default",
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    includeLogo: false,
    address: "",
    email: "",
    phone: "",
    gstin: "",
  });

  const [itemTableSettings, setItemTableSettings] = useState({
    showSNo: true,
    showHSN: true,
    showUOM: true,
    showMRP: true,
    showDescription: true,
    showBatch: true,
    showExpiry: true,
    showMfg: true,
    showSize: true,
    showModelNo: true,
    showSerialNo: true,
  });

  const [totalsAndTaxes, setTotalsAndTaxes] = useState({
    showTotalQuantity: true,
    showAmountDecimal: true,
    showReceivedAmount: true,
    showBalance: true,
    showCurrentBalance: false,
    showTaxDetails: true,
    showYouSaved: true,
    showAmountGrouping: true,
    amountLanguage: "indian",
  });

  const [footerSettings, setFooterSettings] = useState({
    showPrintDescription: true,
  });

  const handlePrinterSettingsChange = (field, value) => {
    setPrinterSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemTableSettingsChange = (field, value) => {
    setItemTableSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleTotalsAndTaxesChange = (field, value) => {
    setTotalsAndTaxes((prev) => ({ ...prev, [field]: value }));
  };

  const handleFooterSettingsChange = (field, value) => {
    setFooterSettings((prev) => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();

  // Initialize GST settings based on country and fetch tax rates
  // useEffect(() => {
  //   const initializeGSTSettings = async () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const decoded = jwtDecode(token);

  //         // Fetch country information
  //         const countryResponse = await axios.get(
  //           `${serviceUrl}/auth/getCountry`,
  //           {
  //             params: { email: decoded.email },
  //           }
  //         );

  //         const country = countryResponse.data.country;
  //         const countryVATRates = {
  //           UAE: 5,
  //           OMAN: 5,
  //           BAHRAIN: 10,
  //           "SAUDI ARABIA": 15,
  //         };
  //         const taxRatesResponse = await axios.get(
  //           `${serviceUrl}/settings/getTaxRates`,
  //           {
  //             params: { email: decoded.email },
  //           }
  //         );

  //         let taxRates = [];
  //         if (
  //           taxRatesResponse.data.taxRates &&
  //           taxRatesResponse.data.taxRates.length > 0
  //         ) {
  //           taxRates = taxRatesResponse.data.taxRates;
  //         }

  //         let taxGroups = [];
  //         if (
  //           taxRatesResponse.data.taxGroups &&
  //           taxRatesResponse.data.taxGroups.length > 0
  //         ) {
  //           taxGroups = taxRatesResponse.data.taxGroups;
  //         }

  //         setGstSettings((prev) => ({
  //           ...prev,
  //           taxRates,
  //           taxGroups,
  //         }));
  //       } catch (error) {
  //         console.error("Error initializing GST settings:", error);
  //       }
  //     }
  //   };

  //   initializeGSTSettings();
  // }, []);

  // Decode token to get email
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newGeneralSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "generalSettings"
        );

        if (newGeneralSettings?.data) {
          setGeneralSettings(newGeneralSettings.data);
        }
      }
    };

    fetchGeneralSettings();
  }, [phone]);

  useEffect(() => {
    const fetchTransactionSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "transactionSettings"
        );
        if (newTransactionSettings?.data) {
          console.log(
            newTransactionSettings.data,
            "THis is the new transaction settings"
          );
          setTransactionSettings(newTransactionSettings.data);
        }
      }
    };

    fetchTransactionSettings();
  }, [phone]);

  useEffect(() => {
    const fetchPartySettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newPartySettings = existingDoc?.settings?.find(
          (setting) => setting.name === "partySettings"
        );

        if (newPartySettings?.data) {
          setPartySettings(newPartySettings.data);
        }
      }
    };

    fetchPartySettings();
  }, [phone]);
  useEffect(() => {
    const fetchTaxesSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTaxSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "taxSettings"
        );

        if (newTaxSettings) {
          setGstSettings(newTaxSettings);
        }
      }
    };

    fetchTaxesSettings();
  }, [phone]);

  useEffect(() => {
    const fetchTransactionMessageSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionMessageSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "transactionMessageSettings"
        );

        if (newTransactionMessageSettings?.data) {
          setTransactionMessageSettings(newTransactionMessageSettings.data);
        }
      }
    };

    fetchTransactionMessageSettings();
  }, [phone]);

  useEffect(() => {
    const fetchPrintSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newPrintSettings = existingDoc?.settings?.find(
          (setting) => setting.name === "printSettings"
        );

        if (newPrintSettings?.data) {
          setPrinterSettings(newPrintSettings.data);
        }
      }
    };

    fetchPrintSettings();
  }, [phone]);

  const handleTransactionSettingsChange = (section, field, value) => {
    setTransactionSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleGSTSettingsChange = (updates) => {
    setGstSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const onPartySettingsChange = (updatedSettings) => {
    setPartySettings(updatedSettings);
  };

  const handleAddTaxRates = async (newTaxRates) => {
    // try {
    //   const payload = {
    //     email,
    //     taxRates: newTaxRates.taxRates,
    //     taxGroups: newTaxRates.taxGroups,
    //   };
    //   const response = await axios.post(
    //     `${serviceUrl}/settings/addTaxRates`,
    //     payload
    //   );
    //   console.log(newTaxRates.taxGroups, "This is New Tax Group");
    //   setGstSettings((prev) => ({
    //     ...prev,
    //     taxRates: newTaxRates.taxRates,
    //     taxGroups: newTaxRates.taxGroups,
    //   }));
    //   console.log("Tax rates added successfully:", response.data);
    // } catch (error) {
    //   console.error(
    //     "Error adding tax rates:",
    //     error.response?.data || error.message
    //   );
    // }
  };

  const menuItems = [
    { label: "GENERAL", id: "GENERAL" },
    { label: "TRANSACTION", id: "TRANSACTION" },
    { label: "PRINT", id: "PRINT" },
    { label: "TAXES & GST", id: "TAXES_GST" },
    { label: "TRANSACTION MESSAGE", id: "TRANSACTION_MESSAGE" },
    { label: "PARTY", id: "PARTY" },
    { label: "ITEM", id: "ITEM" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "GENERAL":
        return (
          <GeneralSettings
            generalSettings={generalSettings}
            setGeneralSettings={setGeneralSettings}
          />
        );
      case "ITEM":
        return <ItemSettings />;
      case "TRANSACTION":
        return (
          <TransactionSettings
            settings={transactionSettings}
            onSettingsChange={handleTransactionSettingsChange}
            setTransactionChanged={setTransactionChanged}
            transactionChanged={transactionChanged}
            setTransactionSettings={setTransactionSettings}
          />
        );
      case "TAXES_GST":
        return (
          <GSTSettings
            settings={gstSettings}
            onSettingsChange={handleGSTSettingsChange}
            onSave={handleAddTaxRates}
          />
        );
      case "PRINT":
        return (
          <PrintSettingPage
            invoiceData={invoiceData}
            // setActiveTab={setActiveTab}
            setInvoiceData={setInvoiceData}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            printerSettings={printerSettings}
            handlePrinterSettingsChange={handlePrinterSettingsChange}
            companyInfo={companyInfo}
            handleCompanyInfoChange={handleCompanyInfoChange}
            itemTableSettings={itemTableSettings}
            handleItemTableSettingsChange={handleItemTableSettingsChange}
            totalsAndTaxes={totalsAndTaxes}
            handleTotalsAndTaxesChange={handleTotalsAndTaxesChange}
            footerSettings={footerSettings}
            handleFooterSettingsChange={handleFooterSettingsChange}
          />
        ); // Changed to use PrintSettingPage
      case "PARTY":
        return (
          <PartySettings
            settings={partySettings}
            onSettingsChange={onPartySettingsChange}
          />
        );
      case "TRANSACTION_MESSAGE":
        return (
          <TransactionMessage
            transactionMessageSettings={transactionMessageSettings}
            setTransactionMessageSettings={setTransactionMessageSettings}
          />
        );
      default:
        return (
          <div className="p-6 text-gray-600">Content for {activePage}</div>
        );
    }
  };

  const handleBack = async () => {
    const newInvoiceData = {
      ...invoiceData,
      selectedTheme,
      printerSettings,
      companyInfo,
      itemTableSettings,
      totalsAndTaxes,
      footerSettings,
    };

    const existingDoc = await db.get(phone);

    if (!Array.isArray(existingDoc.settings)) {
      existingDoc.settings = [];
    }

    const updateOrAddSetting = (name, data) => {
      console.log(data, "This is the new setting", name);
      const index = existingDoc.settings.findIndex(
        (item) => item.name === name
      );

      if (name === "taxSettings") {
        // ✅ Directly update the array element instead of using .data
        if (index !== -1) {
          existingDoc.settings[index] = { name, ...data }; // Directly replace it
        } else {
          existingDoc.settings.push({ name, ...data }); // Add it if not found
        }
      } else {
        if (index !== -1) {
          existingDoc.settings[index].data = data;
        } else {
          existingDoc.settings.push({ name, data });
        }
      }
    };

    updateOrAddSetting("generalSettings", generalSettings);
    updateOrAddSetting("partySettings", partySettings);
    updateOrAddSetting("transactionSettings", transactionSettings);
    updateOrAddSetting("printSettings", newInvoiceData);
    updateOrAddSetting("itemSettings", itemTableSettings);
    updateOrAddSetting("taxSettings", gstSettings); // ✅ Correctly updated

    await db.put({ ...existingDoc });
    console.log("This is the Updated Doc", existingDoc.settings);
    navigate(-1);
};


  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-[#1a1f37] flex flex-col">
        <div className="flex items-center gap-[43px] px-6 py-4 text-white border-b border-gray-700">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <span className="w-5 h-5">
              <ChevronLeft />
            </span>
          </button>
          <h1 className="text-xl font-normal">Settings</h1>
        </div>

        <nav className="flex-1 pt-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-6 py-3 cursor-pointer transition-colors mx-3 my-1 ${
                activePage === item.id
                  ? "bg-white text-black rounded-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span
                className={`text-sm ${
                  activePage === item.id ? "font-medium" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="bg-white rounded-lg shadow-sm">{renderContent()}</div>
        </div>
      </div>

      <Link to="/">
        <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"></button>
      </Link>
    </div>
  );
};

export default Settings;
