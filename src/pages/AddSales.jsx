import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Input,
  Typography,
  Select,
  InputLabel,
  IconButton,
  Popover,
} from "@mui/material";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import {
  calculateItemTotals,
  calculateBillTotals,
  applyBillLevelDiscountAndTax,
  roundOff,
} from "./calculationUtils";
import {
  X as CloseIcon,
  Camera,
  Plus as AddIcon,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  FileText as DescriptionIcon,
  Share as ShareIcon,
  UserPlus as UserPlusIcon,
  Delete as DeleteIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import AddPartyModal from "./AddPartyModal.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import db from "../config/dbConfig.js";
import { decodeToken } from "../DecodeToken.js";
import InvoicePage from "./InvoicePage.jsx";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const emptySaleForm = {
  saleType: "credit",
  customer: "",
  phone: "",
  charges: [],
  ewaybill: "",
  billingAddress: "",
  billingName: "",
  invoiceNumber: "",
  invoiceTime: "",
  poDate: new Date().toISOString().split("T")[0],
  poNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  stateOfSupply: "",
  items: [
    {
      id: 1,
      itemName: "",
      itemId: "",
      quantity: {
        primary: "",
        secondary: "",
        primaryUnit: "",
        secondaryUnit: "",
      },
      unit: "NONE",
      price: "",
      freeItemQuantity: 0,
      discount: {
        percentage: "",
        amount: "",
      },
      tax: {
        percentage: "",
        amount: "",
      },
      amount: 0,
    },
  ],
  roundOff: 0,
  total: 0,
  transportName: "", // New field for transport name
  paymentType: "cash", // New field for payment type
  description: "", // New field for description
  image: "", // New field for image
  discount: { percentage: "", amount: "" }, // New field for discount
  tax: { percentage: "", amount: "" }, // New field for tax
  balanceAmount: 0,
  receivedAmount: 0,
  transportationDetails: [],
};

export default function AddSales() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState();
  const [newCategory, setNewCategory] = useState();
  // const [taxRates, setTaxRates] = useState([]);
  const [allPrinterSettings, setAllPrinterSettings] = useState({});
  const [billParty, setBillParty] = useState(null);
  const [profile, setProfile] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [allTransactionSettings, setAllTransactionSettings] = useState();

  useEffect(() => {
    console.log(location.state?.page, "Current Location");
    setCurrentPage(location.state?.page);
  }, [location]);
  const [tabs, setTabs] = useState([
    {
      id: 1,
      label:
        location.state?.page === "addsales"
          ? "Sale #1"
          : location.state?.page === "estimate"
          ? "Estimate #1"
          : location.state?.page === "orders"
          ? "Sales Order #1"
          : location.state?.page === "deliverychallan"
          ? "Delivery Challan #1"
          : location.state?.page === "salesreturn"
          ? "Sales Return #1"
          : location.state?.page === "addpurchase"
          ? "Purchase #1"
          : location.state?.page === "purchaseexpenses"
          ? "Expenses #1"
          : location.state?.page === "purchaseorders"
          ? "Purchase Orders #1"
          : location.state?.page === "purchasereturn"
          ? "Purchase Return #1"
          : "Default #1",
      form: { ...emptySaleForm },
    },
  ]);

  const handleSavePrimary = (unit) => {
    setTabs((prevTab) =>
      prevTab.map((tab) => ({
        ...tab,
        form: {
          ...tab.form,
          items: tab.form.items.map((item) => ({
            ...item,
            quantity: {
              ...item.quantity,
              primaryUnit: unit,
            },
          })),
        },
      }))
    );
  };

  const handleSaveSecondary = (unit) => {
    setTabs((prevTab) =>
      prevTab.map((tab) => ({
        ...tab,
        form: {
          ...tab.form,
          items: tab.form.items.map((item) => ({
            ...item,
            quantity: {
              ...item.quantity,
              secondaryUnit: unit,
            },
          })),
        },
      }))
    );
  };

  // useEffect(() => {
  //   const fetchCountry = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const decoded = jwtDecode(token);
  //       const response = await axios.get(`${serviceUrl}/auth/getCountry`, {
  //         params: { email: decoded.email },
  //       });

  //       const allTaxRates = response?.data?.country?.taxRates || [];

  //       // Filter unique tax rates based on name and rate
  //       const uniqueTaxRates = allTaxRates.filter(
  //         (value, index, self) =>
  //           index ===
  //           self.findIndex(
  //             (t) => t.name === value.name && t.rate === value.rate
  //           )
  //       );

  //       setTaxRates(uniqueTaxRates);
  //     } catch (error) {
  //       console.error("Error fetching country:", error);
  //     }
  //   };
  //   fetchCountry();
  // }, []);

  useEffect(() => {
    if (allTransactionSettings?.additionalFields?.transaction) {
      let dynamicFields = {};

      allTransactionSettings.additionalFields.transaction.forEach((field) => {
        if (field.enabled && field.name) {
          dynamicFields[field.name] = field.value || ""; // Initialize with default value if exists
        }
      });

      setTabs([
        {
          id: 1,
          label:
            location.state?.page === "addsales"
              ? "Sale #1"
              : location.state?.page === "estimate"
              ? "Estimate #1"
              : location.state?.page === "orders"
              ? "Sales Order #1"
              : location.state?.page === "deliverychallan"
              ? "Delivery Challan #1"
              : location.state?.page === "salesreturn"
              ? "Sales Return #1"
              : location.state?.page === "addpurchase"
              ? "Purchase #1"
              : location.state?.page === "purchaseexpenses"
              ? "Expenses #1"
              : location.state?.page === "purchaseorders"
              ? "Purchase Orders #1"
              : location.state?.page === "purchasereturn"
              ? "Purchase Return #1"
              : "Default #1",
          form: { ...emptySaleForm, ...dynamicFields }, // Merge with new fields
        },
      ]);
    }
  }, [allTransactionSettings]);

  useEffect(() => {
    if (allTransactionSettings?.transportationDetails) {
      const updatedTabs = tabs.map((tab, tabIndex) =>
        tabIndex === 0
          ? {
              ...tab,
              form: {
                ...tab.form,
                transportationDetails:
                  allTransactionSettings.transportationDetails.map(
                    (detail) => ({
                      id: detail.id || detail.value, // Unique identifier
                      name: detail.value,
                      inputValue: "", // Initially empty
                    })
                  ),
              },
            }
          : tab
      );

      console.log(updatedTabs, "Updated Tabs Before Setting State");

      setTabs(updatedTabs);
    }
  }, [allTransactionSettings]);

  useEffect(() => {
    console.log(tabs, "THis is tabsssss");
  }, [allTransactionSettings, tabs]);
  // Dependency array ensures this runs when `allTransactionSettings` changes

  const handleTransportationChange = (index, value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab, tabIndex) =>
        tabIndex === 0
          ? {
              ...tab,
              form: {
                ...tab.form,
                transportationDetails: tab.form.transportationDetails.map(
                  (detail, i) =>
                    i === index ? { ...detail, inputValue: value } : detail
                ),
              },
            }
          : tab
      )
    );
  };

  const [activeTab, setActiveTab] = useState(0);
  const [addPartyNew, setAddPartyNew] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemPopover, setItemPopover] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [parties, setParties] = useState([]);
  const [isUnique, setIsUnique] = useState(true);

  const [items, setItems] = useState([]);
  const [primaryUnits, setPrimaryUnits] = useState([]);
  const [secondaryUnits, setSecondaryUnits] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [banks, setBanks] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isPartyNameUnique, setIsPartyNameUnique] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [allPrintSettings, setAllPartySettings] = useState();
  const [paymentType, setPaymentType] = useState("credit");
  const [taxRates, setTaxRates] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentCompany, setCurrentCompany] = useState("");
  const [invoiceData, setInvoiceData] = useState({
    currentTheme: 1,
    companyLogo: "",
    companyName: "",
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
    items: [],
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
  const [updatedPrimaryUnits, setUpdatedPrimaryUnits] = useState([
    { name: "BAGS" },
    { name: "BOTTLES" },
    { name: "BOX" },
    { name: "BUNDLES" },
    { name: "CANS" },
    { name: "CARTONS" },
    { name: "DOZENS" },
    { name: "GRAMMES" },
    { name: "KILOGRAMS" },
    { name: "LITRE" },
    { name: "MILLILITRE" },
    { name: "NUMBERS" },
    { name: "PACKS" },
    { name: "PAIRS" },
    { name: "PIECES" },
    { name: "QUINTAL" },
    { name: "ROLLS" },
    { name: "SQUARE FEET" },
  ]);

  const [updatedSecondaryUnits, setUpdatedSecondaryUnits] = useState([
    { name: "BAGS" },
    { name: "BOTTLES" },
    { name: "BOX" },
    { name: "BUNDLES" },
    { name: "CANS" },
    { name: "CARTONS" },
    { name: "DOZENS" },
    { name: "GRAMMES" },
    { name: "KILOGRAMS" },
    { name: "LITRE" },
    { name: "MILLILITRE" },
    { name: "NUMBERS" },
    { name: "PACKS" },
    { name: "PAIRS" },
    { name: "PIECES" },
    { name: "QUINTAL" },
    { name: "ROLLS" },
    { name: "SQUARE FEET" },
  ]);

  const [phone, setPhone] = useState();
  useEffect(() => {
    const fetchPhone = async () => {
      const decodedPhone = await decodeToken();
      setPhone(decodedPhone);
    };

    fetchPhone();
  }, []);

  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const existingDoc = await db.get(phone);
        console.log(existingDoc?.conversion, "This is Conversions");
        setConversions(existingDoc?.conversion || []);
      } catch (error) {
        console.error("Error fetching conversions:", error);
      }
    };

    fetchConversions();
  }, [phone]);

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (phone) {
        try {
          const existingDoc = await db.get(phone);
          setCurrentCompany(existingDoc?.users);
        } catch (error) {
          console.error("Error fetching company name:", error);
        }
      }
    };
    fetchCompanyName();
  }, [phone]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setPrimaryUnits(existingDoc?.units?.primaryUnits);
        setSecondaryUnits(existingDoc?.units?.secondaryUnits);
      }
    };
    fetchUnits();
  }, [phone]);

  useEffect(() => {
    if (!phone) return; // Ensure phone is available before querying

    const fetchAllParties = async () => {
      try {
        const existingDoc = await db.get(phone);

        if (existingDoc?.parties) {
          setParties(existingDoc.parties);
        } else {
          setParties([]);
        }
      } catch (error) {
        console.error("Error fetching parties:", error);
        setParties([]);
      }
    };

    fetchAllParties();
  }, [phone, addPartyNew]);

  useEffect(() => {
    const fetchAllBills = async () => {
      if (phone) {
        const exisitingDoc = await db.get(phone);
        if (exisitingDoc?.bills) {
          setTotalInvoices(exisitingDoc.bills.length + 1);
        } else {
          setTotalInvoices(0);
        }
      }
    };

    fetchAllBills();
  }, [phone]);

  useEffect(() => {
    const fetchItems = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    };
    fetchItems();
  }, [phone]);

  useEffect(() => {
    const fetchTaxes = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const updatedTaxes = existingDoc.settings.find(
          (setting) => setting.name === "taxSettings"
        );
        console.log(updatedTaxes, "This is the Updated Tax Settings");
        setTaxRates(updatedTaxes.taxRates);
      }
    };
    fetchTaxes();
  }, [phone]);

  const handleCheckItemName = async (itemName) => {
    try {
      const existingDoc = await db.get(phone);

      if (!existingDoc || !existingDoc.items) {
        return false;
      }

      const itemExists = existingDoc.items.some(
        (item) => item.itemName === itemName
      );

      setIsUnique(!itemExists);
    } catch (error) {
      console.error("Error checking item name:", error);
      return false;
    }
  };

  const getInvoicePrefix = () => {
    const isPrefix = [
      allTransactionSettings?.transactionPrefixes?.sale,
      allTransactionSettings?.transactionPrefixes?.creditNote,
      allTransactionSettings?.transactionPrefixes?.deliveryChallan,
      allTransactionSettings?.transactionPrefixes?.paymentIn,
    ].find((prefix) => {
      console.log(prefix, "This is the Prefix for the allTransactions");
      prefix && prefix !== "none";
    });
    console.log(isPrefix, "This should be the prefix for");
    return isPrefix;
  };

  useEffect(() => {
    const fetchBanks = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setBanks(existingDoc.banks);
      }
    };
    fetchBanks();
  }, [phone]);

  useEffect(() => {
    if (primaryUnits && secondaryUnits) {
      const updatedPrimary = [
        ...new Set([...updatedPrimaryUnits, ...primaryUnits]),
      ];
      const updatedSecondary = [
        ...new Set([...updatedSecondaryUnits, ...secondaryUnits]),
      ];
      setUpdatedPrimaryUnits(updatedPrimary);
      setUpdatedSecondaryUnits(updatedSecondary);
    }
  }, [
    primaryUnits,
    secondaryUnits,
    updatedPrimaryUnits,
    updatedSecondaryUnits,
  ]);
  useEffect(() => {
    if (allTransactionSettings) {
      if (allTransactionSettings?.header?.cashSaleByDefault) {
        setPaymentType("cash");
      }
    }
  }, [allTransactionSettings]);
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
    const fetchProfile = async () => {
      if (!phone) return;

      try {
        const existingDoc = await db.get(phone);
        if (existingDoc && existingDoc.user) {
          const userProfile = existingDoc.user.find(
            (user) => user.phone === phone
          );
          if (userProfile) {
            setProfile(userProfile);
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
      } finally {
      }
    };
    fetchProfile();
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

  useEffect(() => {
    const fetchPrintSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newPrintSettings = existingDoc?.settings?.filter(
          (setting) => setting.name === "printSettings"
        )[0]?.data;
        setAllPrinterSettings(newPrintSettings);
      }
    };

    fetchPrintSettings();
  }, [phone]);

  const handleAddTab = () => {
    const newTabId = tabs.length + 1;

    const labels = {
      addsales: "Sale",
      estimate: "Estimate",
      orders: "Sales Order",
      deliverychallan: "Delivery Challan",
      salesreturn: "Sales Return",
      addpurchase: "Purchase",
      purchaseexpenses: "Expenses",
      purchaseorders: "Purchase Orders",
      purchasereturn: "Purchase Return",
    };

    const label = labels[currentPage]
      ? `${labels[currentPage]} #${newTabId}`
      : `Tab #${newTabId}`;

    // Reset emptySaleForm before using it
    const resetForm = JSON.parse(JSON.stringify(emptySaleForm));
    console.log(resetForm, "This is the reset form");
    setTabs([
      ...tabs,
      {
        id: newTabId,
        label: label,
        form: resetForm, // Use the reset empty form
      },
    ]);

    setActiveTab(tabs.length);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tabToClose, setTabToClose] = useState(null);

  const handleCloseTab = (event, tabId) => {
    event.stopPropagation();
    setTabToClose(tabId);
    setIsDialogOpen(true);
  };

  const handleSelect = (party, index) => {
    setInputValue(party.partyName);
    handleFormChange(index, "customer", party.partyName);
    handleFormChange(index, "billingAddress", party.billingAddress)
    setIsOpen(false);
  };

  const handleConfirmClose = () => {
    const resetTabs = tabs.map((tab) =>
      tab.id === tabToClose
        ? { ...tab, form: JSON.parse(JSON.stringify(emptySaleForm)) }
        : tab
    );

    const newTabs = resetTabs.filter((tab) => tab.id !== tabToClose);

    setTabs(newTabs);

    if (newTabs.length === 0) {
      navigate(-1);
    } else if (activeTab >= newTabs.length) {
      setActiveTab(newTabs.length - 1);
    }

    setIsDialogOpen(false);
    setTabToClose(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // For handling primary unit changes

  const handleAddRow = () => {
    const updatedTabs = [...tabs];
    const newItem = {
      id: updatedTabs[0].form.items.length + 1,
      item: "",
      quantity: "",
      unit: "NONE",
      price: "",
      discount: "",

      tax: "",
      amount: 0,
    };
    updatedTabs[0].form.items.push(newItem);
    setTabs(updatedTabs);
  };

  const handleFormChange = (tabIndex, field, value) => {
    const updatedTabs = [...tabs];

    if (field === "customer") {
      const selectedParty = parties.find((party) => party._id === value);
      updatedTabs[tabIndex].form.customer = value;
      updatedTabs[tabIndex].form.phone = selectedParty
        ? selectedParty.phone
        : "";
    } else if (field === "discount" || field === "tax") {
      updatedTabs[tabIndex].form[field] = {
        ...updatedTabs[tabIndex].form[field],
        ...value,
      };

      // Recalculate totals when bill-level discount or tax changes
      const billTotals = calculateBillTotals(updatedTabs[tabIndex].form.items);
      const finalTotals = applyBillLevelDiscountAndTax(
        billTotals,
        updatedTabs[tabIndex].form.discount,
        updatedTabs[tabIndex].form.tax
      );

      // Apply round off if enabled
      const roundedTotal = updatedTabs[tabIndex].form.roundOff
        ? roundOff(finalTotals.grandTotal)
        : finalTotals.grandTotal;

      updatedTabs[tabIndex].form.total = roundedTotal;
    } else {
      updatedTabs[tabIndex].form[field] = value;
    }

    setTabs(updatedTabs);
  };

  const handleParty = async (partyData) => {
    let existingDoc = await db.get(phone).catch(() => null);

    if (existingDoc) {
      const isPartyExists = existingDoc.parties.some(
        (party) => party.partyId === partyData.partyId
      );

      if (!isPartyExists) {
        existingDoc.parties.push(partyData);
        await db.put(existingDoc);
      }
    } else {
      await db.put({
        _id: phone,
        parties: [partyData],
      });
    }
    setAddPartyNew(false);
  };

  const handleDeleteRow = (tabIndex, itemId) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].form.items = updatedTabs[tabIndex].form.items.filter(
      (item) => item.id !== itemId
    );
    setTabs(updatedTabs);
  };

  const handleChangeReceived = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePrimaryUnitChange = (itemId, value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        form: {
          ...tab.form,
          items: tab.form.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                primaryUnit: value,
              };
            }
            return item;
          }),
        },
      }))
    );
  };

  // For handling secondary unit changes
  const handleSecondaryUnitChange = (itemId, value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        form: {
          ...tab.form,
          items: tab.form.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                secondaryUnit: value,
              };
            }
            return item;
          }),
        },
      }))
    );
  };

  const handleItemSelect = (tabIndex, rowId, currentItem) => {
    const updatedTabs = [...tabs];
    const itemIndex = updatedTabs[tabIndex].form.items.findIndex(
      (item) => item.id === rowId
    );

    if (itemIndex !== -1) {
      let discountAmount = 0;
      if (currentItem.saleDiscountType === "Percentage") {
        discountAmount =
          (currentItem.salePrice * currentItem.saleDiscount) / 100;
      } else if (currentItem.saleDiscountType !== "Percentage") {
        discountAmount = currentItem.saleDiscount;
      }

      const updatedDiscount = {
        percentage:
          currentItem.saleDiscountType === "Percentage"
            ? currentItem.saleDiscount
            : updatedTabs[tabIndex].form.items[itemIndex].discount.percentage,
        amount: discountAmount,
      };

      const taxPercentage = currentItem.taxRate.match(/@(\d+)%/);
      const taxAmount = taxPercentage
        ? (currentItem.salePrice - discountAmount) *
          (parseFloat(taxPercentage[1]) / 100)
        : 0;
      const updatedTax = {
        percentage: currentItem.taxRate,
        amount: taxAmount,
      };
      console.log(
        currentItem.price - discountAmount,
        currentItem.price,
        discountAmount,
        "This is the updated discount"
      );
      // const updatedQuantity = currentItem.quantity.
      // const item = updatedTabs[tabIndex].form.items[itemIndex];
      const conversion = conversions?.find(
        (conv) =>
          conv.primaryUnit === currentItem.quantity.primary &&
          conv.secondaryUnit === currentItem.quantity.secondary
      );

      const conversionRate = conversion
        ? parseFloat(conversion.conversionRate)
        : 1;
      const itemPrice = parseFloat(currentItem.salePrice) || 0;
      const secondaryQuantity = 1;
      const oneSecondaryUnitPrice = itemPrice / conversionRate;

      const updatedSecondaryUnitPrice =
        secondaryQuantity * oneSecondaryUnitPrice;

      console.log(
        conversionRate,
        itemPrice,
        oneSecondaryUnitPrice,
        conversion,
        conversions,
        "All details are here"
      );
      updatedTabs[tabIndex].form.items[itemIndex] = {
        ...updatedTabs[tabIndex].form.items[itemIndex],
        itemName: currentItem.itemName,
        price: currentItem.salePrice,
        itemId: currentItem.itemCode,
        primaryUnit: currentItem.quantity.primary,
        secondaryUnit: currentItem.quantity.secondary,
        quantity: {
          primary: 1,
          secondary: 1,
        },
        discount: updatedDiscount,
        // tax: updatedTax,
        amount:
          currentItem.salePrice -
          discountAmount +
          taxAmount +
          updatedSecondaryUnitPrice,
      };
    }
    setSelectedItem(currentItem);
    setIsSelected(true);
    setTabs(updatedTabs);
    setItemPopover(null);
  };

  const handleItemPopover = (event, rowId) => {
    setSelectedRowId(rowId);
    setItemPopover(event.currentTarget); // Ensure this is the input field
  };

  const handleCloseItemPopover = () => {
    setItemPopover(null);
  };

  const { enabledFields, customFields } = useSelector((state) => state.item);

  const handleChargeChange = (e, index) => {
    const updatedTabs = [...tabs];
    const form = updatedTabs[0].form;

    // Ensure charges array exists and is an array of objects
    form.charges = form.charges || [];

    // Find the selected tax rate
    const selectedTaxRate = profile?.taxRates.find(
      (rate) => rate._id === form.charges[index]?.taxRate
    );

    // Get the charge name from allTransactionSettings
    const chargeName = allTransactionSettings?.additionalCharges?.[index]?.name;

    // Calculate total with tax
    const baseValue = parseFloat(e.target.value) || 0;
    const taxRate = selectedTaxRate ? selectedTaxRate.rate / 100 : 0;
    const totalWithTax = baseValue * (1 + taxRate);

    form.charges[index] = {
      ...form.charges[index],
      name: chargeName, // Add the charge name
      value: e.target.value,
      baseValue: baseValue,
      taxRate: form.charges[index]?.taxRate,
      totalWithTax: totalWithTax.toFixed(2),
    };

    setTabs(updatedTabs);
  };

  const handleTaxRateChange = (e, index) => {
    const updatedTabs = [...tabs];
    const form = updatedTabs[0].form;

    form.charges = form.charges || [];

    // Find the selected tax rate
    const selectedTaxRate = profile?.taxRates.find(
      (rate) => rate._id === e.target.value
    );

    // Get the charge name from allTransactionSettings
    const chargeName = allTransactionSettings?.additionalCharges?.[index]?.name;

    // Recalculate total with tax if base value exists
    const baseValue = form.charges[index]?.value
      ? parseFloat(form.charges[index].value)
      : 0;
    const taxRate = selectedTaxRate ? selectedTaxRate.rate / 100 : 0;
    const totalWithTax = baseValue * (1 + taxRate);

    form.charges[index] = {
      ...form.charges[index],
      name: chargeName, // Add the charge name
      taxRate: e.target.value,
      totalWithTax: totalWithTax.toFixed(2),
    };

    setTabs(updatedTabs);
  };

  // First, let's add the number to words converter function
  const numberToWords = (num) => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";

      let result = "";

      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " hundred ";
        n %= 100;
        if (n > 0) result += "and ";
      }

      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
        if (n > 0) result += ones[n] + " ";
      } else if (n >= 10) {
        result += teens[n - 10] + " ";
      } else if (n > 0) {
        result += ones[n] + " ";
      }

      return result;
    };

    if (num === 0) return "zero rupees";

    let result = "";

    if (num >= 100000) {
      result += convertLessThanThousand(Math.floor(num / 100000)) + "lakh ";
      num %= 100000;
    }

    if (num >= 1000) {
      result += convertLessThanThousand(Math.floor(num / 1000)) + "thousand ";
      num %= 1000;
    }

    result += convertLessThanThousand(num);

    return result.trim() + " rupees";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredParties, setFilteredParties] = useState(parties);
  const wrapperRef = useRef(null);

  // useEffect(() => {
  //   // Set initial input value if there's a selected party
  //   const selectedParty = parties.find((p) => p.partyId === value);
  //   if (selectedParty) {
  //     setInputValue(selectedParty.partyName);
  //   }
  // }, [value, parties]);

  useEffect(() => {
    // Filter parties based on input
    const filtered = parties.filter((party) =>
      party.partyName.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredParties(filtered);
  }, [inputValue, parties]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e, index) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    handleFormChange(index, "customer", e.target.value);
  };

  const handleVerifyPartyName = async (partyName) => {
    try {
      let existingDoc = await db.get(phone).catch(() => null);

      if (existingDoc) {
        const partyExists = existingDoc.parties.some(
          (party) => party.partyName === partyName
        );
        console.log(partyExists, "This is a party");
        setIsPartyNameUnique(!partyExists);
      }
    } catch (error) {
      console.error("Error verifying party name:", error);
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");

    try {
      const updatedTabs = tabs.map((tab, index) => ({
        ...tab,
        form: {
          ...tab.form,
          total: getTotalForField(tab?.form?.items, "amount"),
          invoiceNumber: totalInvoices + index + 1,
        },
        invoiceNumber: totalInvoices + index + 1,
        billType: currentPage,
      }));

      console.log("Updated Tabs: ", updatedTabs);

      // Check if we have valid phone before proceeding
      if (!phone) {
        throw new Error("Phone number is required");
      }

      // Get existing document
      let existingDoc = await db.get(phone);

      if (!existingDoc) {
        throw new Error("Customer data not found");
      }

      const updatedItems = existingDoc.items.map((existingItem) => {
        let matchedItem = updatedTabs
          .flatMap((tab) => tab.form.items) // Get all items from all tabs
          .find((item) => item.itemId === existingItem.itemCode); // Match itemId with itemCode

        if (matchedItem) {
          let quantityChangePrimary = Number(matchedItem.quantity.primary) || 0;
          let quantityChangeSecondary =
            Number(matchedItem.quantity.secondary) || 0;

          let openingPrimaryQuantity =
            Number(existingItem.openingPrimaryQuantity) || 0;
          let openingSecondaryQuantity =
            Number(existingItem.openingSecondaryQuantity) || 0;

          if (currentPage === "addsales") {
            return {
              ...existingItem,
              openingPrimaryQuantity: (
                openingPrimaryQuantity - quantityChangePrimary
              ).toString(),
              openingSecondaryQuantity: (
                openingSecondaryQuantity - quantityChangeSecondary
              ).toString(),
            };
          } else if (currentPage === "addpurchase") {
            return {
              ...existingItem,
              openingPrimaryQuantity: (
                openingPrimaryQuantity + quantityChangePrimary
              ).toString(),
              openingSecondaryQuantity: (
                openingSecondaryQuantity + quantityChangeSecondary
              ).toString(),
            };
          }
        }

        return existingItem;
      });

      // Create a variable to store the matched party for invoice generation
      let matchedParty = null;

      const updatedParties = existingDoc.parties.map((party) => {
        let matchedTab = updatedTabs.find(
          (tab) => tab.form.customer === party.partyName
        );
        if (matchedTab) {
          // Store the matched party for later use
          matchedParty = { ...party };
          setBillParty(party);
        }
        if (matchedTab) {
          let updatedBalance = Number(party.openingBalance) || 0;

          if (currentPage === "addsales") {
            updatedBalance += matchedTab.form.total; // Increase balance on sales
          } else if (currentPage === "addpurchase") {
            updatedBalance -= matchedTab.form.total; // Decrease balance on purchase
          }

          return { ...party, openingBalance: updatedBalance };
        }

        return party;
      });

      // Apply the updates
      existingDoc.items = updatedItems;
      existingDoc.parties = updatedParties;
      existingDoc.bills.push(...updatedTabs);

      // Save to the database
      await db.put(existingDoc);

      console.log("Creating updatedInvoiceData...");
      let updatedInvoiceData = {};

      try {
        let dynamicInvoiceFields = {};

        if (allTransactionSettings?.additionalFields?.transaction) {
          allTransactionSettings.additionalFields.transaction.forEach(
            (field) => {
              if (field.enabled && field.name) {
                dynamicInvoiceFields[field.name] =
                  updatedTabs[0]?.form?.[field.name] || "";
              }
            }
          );
        }

        // Get the total amount for converting to words
        const totalAmount = updatedTabs[0]?.form?.total || 0;
        const totalAmountInWords = numberToWords(Math.round(totalAmount));

        updatedInvoiceData = {
          currency: currentCompany.currencySymbol,
          billTo: {
            name: updatedTabs[0]?.form?.customer,
            partyPhone: matchedParty?.partyPhone || "",
            partyAddress: matchedParty?.billingAddress || "",
            partyState: matchedParty?.partyState || "",
            billingName: updatedTabs[0]?.form?.billingName,
            companyName: currentCompany.name,
            companyPhone: currentCompany.phone,
            contact: updatedTabs[0]?.form?.phone,
            address: updatedTabs[0]?.form?.billingAddress,
          },
          invoiceDetails: {
            invoiceNo: totalInvoices + 1,
            prefix: allTransactionSettings?.transactionPrefixes?.sale
              ? allTransactionSettings?.transactionPrefixes?.sale
              : allTransactionSettings?.transactionPrefixes?.creditNote
              ? allTransactionSettings?.transactionPrefixes?.creditNote
              : allTransactionSettings?.transactionPrefixes?.deliveryChallan
              ? allTransactionSettings?.transactionPrefixes?.deliveryChallan
              : allTransactionSettings?.transactionPrefixes?.paymentIn,
            date: updatedTabs[0]?.form?.invoiceDate,
            time: updatedTabs[0]?.form?.invoiceTime,
            poDate: updatedTabs[0]?.form?.poDate,
            poNumber: updatedTabs[0]?.form?.poNumber,
            countryName: currentCompany?.country,
            ewaybill: updatedTabs[0]?.form?.ewaybill,
            dynamicInvoiceFields: dynamicInvoiceFields,
            billType: updatedTabs[0]?.form?.billType,
            stateOfSupply: updatedTabs[0]?.form?.stateOfSupply,
          },
          items: updatedTabs[0]?.form?.items.map((item, i) => {
            console.log(`Mapping item ${i}: `, item);
            return {
              name: item?.itemName,
              quantity: `${item?.quantity?.primary} ${item?.primaryUnit}, ${item?.quantity?.secondary} ${item?.secondaryUnit}`,
              pricePerUnit: Number(item?.price),
              tax: Number(item?.tax?.amount),
              freeItemQuantity: item?.freeItemQuantity,
              discount: item?.discount?.percentage,
              discountAmount: Number(item?.discount?.amount),
              tax: item?.tax?.percentage,
              taxAmount: Number(item?.tax?.amount),
              amount: Number(item?.amount),
            };
          }),
          summary: {
            totalAmount: updatedTabs[0]?.form?.total,
            totalAmountInWords: totalAmountInWords,
          },
          terms: invoiceData.terms,
          additionalFields: allTransactionSettings?.additionalFields
            ? allTransactionSettings?.additionalFields
            : {},
          additionalCharges: updatedTabs[0]?.form?.charges,
          transportationDetails: updatedTabs[0]?.form?.transportationDetails,
        };

        console.log("Final updatedInvoiceData: ", updatedInvoiceData);

        // Set invoice preview if needed
        if (!allTransactionSettings?.moreFeatures?.doNotShowInvoicePreview) {
          setSelectedTheme(
            <InvoicePage
              invoiceData={updatedInvoiceData}
              setInvoiceData={setInvoiceData}
              isEditable={true}
            />
          );
        }

        // Show success toast - using response.message was incorrect as there's no response object
        toast.success("Bills added successfully!", {
          duration: 3000,
          position: "top-center",
          style: { background: "#48bb78", color: "#fff" },
        });
        setTabs([
          {
            id: 1,
            label: "",
            form: { ...emptySaleForm },
          },
        ]);
      } catch (invoiceError) {
        console.error(
          "Error while creating updatedInvoiceData: ",
          invoiceError
        );
        // Handle the specific invoice creation error
        toast.error(`Error creating invoice: ${invoiceError.message}`, {
          duration: 3000,
          position: "top-center",
          style: { background: "#f56565", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Error in API call: ", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while adding bills";

      toast.error(errorMessage, {
        duration: 3000,
        position: "top-center",
        style: { background: "#f56565", color: "#fff" },
      });

      if (errorMessage.includes("Duplicate invoice number")) {
        console.error("Duplicate invoice number detected");
        // You might want to handle this specific case differently
        // For example, suggesting a different invoice number
      }
    }
  };
  // Helper function to parse numeric input and handle invalid values
  const parseNumericInput = (value) => {
    // Handle null, undefined, empty string
    if (value == null || value === "") return 0;

    // Convert to number, handling string numbers and numeric values
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]/g, ""))
        : Number(value);

    // Return 0 if not a valid number
    return isNaN(numValue) ? 0 : numValue;
  };

  // Enhanced handleInputChange to properly handle numeric inputs
  const handleItemChange = (itemId, field, value, subfield = null) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        const newItems = tab.form.items.map((item) => {
          if (item.id === itemId) {
            let updatedItem;
            let extractedTaxPercentage = null;

            if (subfield) {
              // Handle tax percentage extraction from dropdown
              if (
                field === "tax" &&
                subfield === "percentage" &&
                typeof value === "string"
              ) {
                const match = value.match(/(\d+(\.\d+)?)%/); // Extracts the numeric part before %
                if (match) {
                  extractedTaxPercentage = parseFloat(match[1]); // Convert to number
                } else {
                  extractedTaxPercentage = value === "" ? "" : 0; // Empty string if nothing selected
                }

                updatedItem = {
                  ...item,
                  [field]: {
                    ...item[field],
                    [subfield]: value, // Keep the original value (with tax name)
                    rate: extractedTaxPercentage, // Store numeric rate separately
                  },
                };
              } else {
                // Handle other subfields normally
                updatedItem = {
                  ...item,
                  [field]: {
                    ...item[field],
                    [subfield]: value,
                  },
                };
              }
            } else {
              // Handle regular fields
              updatedItem = { ...item, [field]: value };
            }

            // Specific handling for different field changes
            if (
              field === "quantity" ||
              field === "price" ||
              field === "primaryUnit" ||
              field === "secondaryUnit"
            ) {
              // Recalculate totals for quantity, price, and unit changes
              const totals = calculateItemTotals(updatedItem, conversions);
              updatedItem.amount = totals.finalAmount;
              updatedItem.discount.amount = totals.discountAmount;
              updatedItem.tax.amount = totals.taxAmount;
            } else if (field === "discount" && subfield === "percentage") {
              // For discount percentage changes, recalculate all totals
              const totals = calculateItemTotals(updatedItem, conversions);
              updatedItem.amount = totals.finalAmount;
              updatedItem.discount.amount = totals.discountAmount;
              updatedItem.tax.amount = totals.taxAmount;
            } else if (field === "tax" && subfield === "percentage") {
              // For tax percentage changes, recalculate totals
              const totals = calculateItemTotals(updatedItem, conversions);
              updatedItem.amount = totals.finalAmount;
              updatedItem.tax.amount = totals.taxAmount;
            }

            return updatedItem;
          }
          return item;
        });

        // Calculate bill totals
        const billTotals = calculateBillTotals(newItems, conversions);
        const finalTotals = applyBillLevelDiscountAndTax(
          billTotals,
          tab.form.discount,
          tab.form.tax
        );

        // Apply round off if enabled
        const roundedTotal = tab.form.roundOff
          ? roundOff(finalTotals.grandTotal)
          : finalTotals.grandTotal;

        return {
          ...tab,
          form: {
            ...tab.form,
            items: newItems,
            total: roundedTotal,
          },
        };
      })
    );
  };

  const handleNumericInputChange = (itemId, field, value, subfield = null) => {
    // Allow empty string or valid numbers
    const numericValue =
      value === ""
        ? ""
        : field === "tax" && subfield === "percentage"
        ? value // Keep tax dropdown selection as is
        : !isNaN(parseFloat(value))
        ? parseFloat(value)
        : ""; // Convert to number if possible

    handleItemChange(itemId, field, numericValue, subfield);
  };

  // Updated calculation function to include secondary quantity in total
  const calculateItemTotals = (item, conversions) => {
    // Extract numeric values with defaults
    const primaryQuantity = parseFloat(item.quantity?.primary || 0);
    const secondaryQuantity = parseFloat(item.quantity?.secondary || 0);
    const price = parseFloat(item.price || 0);
    const discountPercentage = parseFloat(item.discount?.percentage || 0);

    // Only apply tax if a valid percentage has been selected
    const taxRate =
      item.tax?.rate !== undefined &&
      item.tax?.rate !== "" &&
      item.tax?.rate !== null
        ? parseFloat(item.tax.rate)
        : 0;

    // Find the conversion rate for secondary unit
    const conversion = conversions?.find(
      (conv) =>
        conv.primaryUnit === item.primaryUnit &&
        conv.secondaryUnit === item.secondaryUnit
    );

    const conversionRate = conversion
      ? parseFloat(conversion.conversionRate)
      : 1;

    // Calculate price for one secondary unit
    const oneSecondaryUnitPrice = price / conversionRate;

    // Calculate base amount including both primary and secondary quantities
    const primaryAmount = primaryQuantity * price;
    const secondaryAmount = secondaryQuantity * oneSecondaryUnitPrice;

    // Add primary and secondary amounts for the base amount
    const baseAmount = primaryAmount + secondaryAmount;

    // Calculate discount amount
    const discountAmount = (baseAmount * discountPercentage) / 100;

    // Calculate amount after discount
    const amountAfterDiscount = baseAmount - discountAmount;

    // Calculate tax amount - only if tax rate is set
    const taxAmount = taxRate ? (amountAfterDiscount * taxRate) / 100 : 0;

    // Calculate final amount
    const finalAmount = amountAfterDiscount + taxAmount;

    return {
      baseAmount,
      discountAmount,
      amountAfterDiscount,
      taxAmount,
      finalAmount,
      primaryAmount,
      secondaryAmount,
    };
  };

  // Helper function to calculate bill totals with secondary quantity
  const calculateBillTotals = (items, conversions) => {
    // Initial values
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    // Iterate through items and calculate with secondary quantity included
    items.forEach((item) => {
      // Recalculate each item's total with secondary quantity
      const itemTotals = calculateItemTotals(item, conversions);

      // Add to totals
      totalAmount += itemTotals.finalAmount;
      totalDiscount += itemTotals.discountAmount;
      totalTax += itemTotals.taxAmount;
    });

    return {
      totalAmount,
      totalDiscount,
      totalTax,
      subTotal: totalAmount - totalTax, // Subtotal excludes tax
    };
  };

  // Apply bill level discount and tax
  const applyBillLevelDiscountAndTax = (billTotals, billDiscount, billTax) => {
    const billDiscountAmount = billDiscount?.percentage
      ? (billTotals.subTotal * parseFloat(billDiscount.percentage)) / 100
      : 0;

    const subtotalAfterDiscount = billTotals.subTotal - billDiscountAmount;

    const billTaxAmount = billTax?.percentage
      ? (subtotalAfterDiscount * parseFloat(billTax.percentage)) / 100
      : 0;

    return {
      ...billTotals,
      billDiscountAmount,
      billTaxAmount,
      grandTotal: subtotalAfterDiscount + billTaxAmount,
    };
  };

  // Round off function
  const roundOff = (value) => {
    return Math.round(value);
  };

  // Get total for a field across all items
  const getTotalForField = (items, field, subfield, conversions) => {
    if (!items || !Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      let value;

      if (subfield && item[field]?.[subfield] !== undefined) {
        value = parseFloat(item[field][subfield]);
      } else if (!subfield && item[field] !== undefined) {
        value = parseFloat(item[field]);
      } else {
        return total;
      }

      return !isNaN(value) ? total + value : total;
    }, 0);
  };

  // Updated function to calculate secondary quantity price total
  const getSecondaryQuantityPrice = (items) => {
    return items.reduce((total, item) => {
      const conversion = conversions?.find(
        (conv) =>
          conv.primaryUnit === item.primaryUnit &&
          conv.secondaryUnit === item.secondaryUnit
      );

      const conversionRate = conversion
        ? parseFloat(conversion.conversionRate)
        : 1;
      const itemPrice = parseFloat(item.price) || 0;
      const secondaryQuantity = parseFloat(item.quantity?.secondary) || 0;
      const oneSecondaryUnitPrice = itemPrice / conversionRate;
      console.log(
        item.primaryUnit,
        item.secondaryUnit,
        conversions,
        "This is the Price fors"
      );
      return total + secondaryQuantity * oneSecondaryUnitPrice;
    }, 0);
  };

  // This function needs to be updated to use the calculateItemTotals function
  const calculateGrandTotal = (index) => {
    const items = tabs[index]?.form?.items || [];

    // Calculate itemsTotal using the full calculation including secondary quantities
    let itemsTotal = 0;
    items.forEach((item) => {
      const totals = calculateItemTotals(item, conversions);
      itemsTotal += totals.finalAmount;
    });

    const chargesTotal = tabs[index].form.charges
      ? tabs[index].form.charges.reduce(
          (total, charge) => total + (parseFloat(charge.totalWithTax) || 0),
          0
        )
      : 0;

    return (itemsTotal + chargesTotal).toFixed(2);
  };

  // Update balanceAmount using useEffect
  useEffect(() => {
    setTabs((prevTabs) => {
      let updated = false;

      const newTabs = prevTabs.map((tab, index) => {
        const grandTotal = calculateGrandTotal(index);
        const receivedAmount = parseFloat(tab?.form?.receivedAmount) || 0;
        const newBalanceAmount = (grandTotal - receivedAmount).toFixed(2);

        if (tab.form.balanceAmount !== newBalanceAmount) {
          updated = true;
          return {
            ...tab,
            form: {
              ...tab.form,
              balanceAmount: newBalanceAmount,
            },
          };
        }

        return tab;
      });

      return updated ? newTabs : prevTabs;
    });
  }, [calculateGrandTotal]);

  // Additionally, you need to update your table rendering to show the correct amount
  // Make sure that when rendering each item row, you use the calculated amount from calculateItemTotals
  // instead of just using item.amount directly

  // Add this function to your code to recalculate all items when component mounts
  const recalculateAllItems = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        const newItems = tab.form.items.map((item) => {
          const totals = calculateItemTotals(item, conversions);
          return {
            ...item,
            amount: totals.finalAmount,
            discount: {
              ...item.discount,
              amount: totals.discountAmount,
            },
            tax: {
              ...item.tax,
              amount: totals.taxAmount,
            },
          };
        });

        // Calculate bill totals
        const billTotals = calculateBillTotals(newItems, conversions);
        const finalTotals = applyBillLevelDiscountAndTax(
          billTotals,
          tab.form.discount,
          tab.form.tax
        );

        // Apply round off if enabled
        const roundedTotal = tab.form.roundOff
          ? roundOff(finalTotals.grandTotal)
          : finalTotals.grandTotal;

        return {
          ...tab,
          form: {
            ...tab.form,
            items: newItems,
            total: roundedTotal,
          },
        };
      })
    );
  };

  // Call this in a useEffect on component mount
  useEffect(() => {
    recalculateAllItems();
  }, []);

  return (
    <>
      {selectedTheme ? (
        selectedTheme
      ) : (
        <>
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogTitle>Are you sure you want to close this tab?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ width: "100%", overflowY: "scroll" }}>
            <Paper elevation={3} className="h-screen">
              <AppBar
                position="fixed"
                color="default"
                sx={{ width: "100%", top: 0 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {tabs.map((tab, index) => (
                      <Tab
                        key={tab.id}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {tab.label}
                            </Typography>
                            <Box
                              component="button"
                              sx={{
                                ml: 1,
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                p: 0,
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={(e) => handleCloseTab(e, tab.id)}
                            >
                              <CloseIcon size={16} />
                            </Box>
                          </Box>
                        }
                      />
                    ))}
                  </Tabs>
                  <Box
                    component="button"
                    sx={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handleAddTab}
                  >
                    <AddIcon size={24} />
                  </Box>
                </Box>
              </AppBar>

              {tabs.map((tab, index) => (
                <>
                  <TabPanel
                    key={tab.id}
                    value={activeTab}
                    index={index}
                    className="overflow-y-auto h-[calc(100vh-64px)] pt-12" // Adjust the height based on the AppBar
                  >
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                            {currentPage === "addsales"
                              ? "Sale"
                              : currentPage === "estimate"
                              ? "Estimate"
                              : currentPage === "orders"
                              ? "Sales Order"
                              : currentPage === "deliverychallan"
                              ? "Delivery Challan"
                              : currentPage === "salesreturn"
                              ? "Sales Return"
                              : currentPage === "addpurchase"
                              ? "Purchase"
                              : currentPage === "purchaseexpenses"
                              ? "Expenses"
                              : currentPage === "purchaseorders"
                              ? "Purchase Orders"
                              : currentPage === "purchasereturn"
                              ? "Purchase Return"
                              : "Default Label"}
                          </Typography>
                        </Grid>
                        {currentPage === "addsales" && (
                          <>
                            <Grid item>
                              <Button
                                variant={
                                  paymentType === "credit"
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() => setPaymentType("credit")}
                                sx={{ fontSize: "0.875rem" }}
                              >
                                Credit
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant={
                                  paymentType === "cash"
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() => setPaymentType("cash")}
                                sx={{ fontSize: "0.875rem" }}
                              >
                                Cash
                              </Button>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Box>
                    <div className="flex flex-col gap-4 p-4">
                      {/* Main container with two columns */}
                      <div className="flex justify-between">
                        {/* Left column */}
                        <div className="flex flex-col gap-4 w-1/2">
                          {/* Select Party Input */}
                          <div className="w-full flex gap-2">
                            {currentPage !== "purchaseexpenses" && (
                              <div className="relative" ref={wrapperRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Select Party
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={tab?.form?.customer}
                                    onChange={(e) =>
                                      handleInputChange(e, index)
                                    }
                                    onFocus={() => setIsOpen(true)}
                                    onBlur={() =>
                                      handleVerifyPartyName(inputValue, index)
                                    }
                                    placeholder="Type or select party"
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-2 flex items-center"
                                    onClick={() => setIsOpen(!isOpen)}
                                  >
                                    <svg
                                      className="w-5 h-5 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                          isOpen
                                            ? "M5 15l7-7 7 7"
                                            : "M19 9l-7 7-7-7"
                                        }
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Agar party name duplicate hai to error message show hoga */}
                                {!isPartyNameUnique && (
                                  <span className="text-red-500 text-sm mt-1">
                                    Party Name already exists
                                  </span>
                                )}

                                {isOpen && (
                                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-300 max-h-60 overflow-auto">
                                    {filteredParties.map((party) => (
                                      <button
                                        key={party.partyId}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                        onClick={() =>
                                          handleSelect(party, index)
                                        }
                                      >
                                        <span>{party.partyName}</span>
                                        <span className="text-gray-500 ml-2">
                                          - {party.openingBalance} (
                                          {party.balanceType === "to-receive"
                                            ? "↑"
                                            : "↓"}
                                          )
                                        </span>
                                      </button>
                                    ))}
                                    {filteredParties.length === 0 && (
                                      <div className="px-4 py-2 text-gray-500">
                                        No parties found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {allTransactionSettings?.header
                              ?.billingNameOfParties && (
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">
                                  Billing Name (Optional)
                                </label>
                                <input
                                  type="text"
                                  className="w-[197px] border rounded pl-2 pr-2 py-2 focus:outline-none focus:border-blue-500"
                                  value={tab.form.billingName}
                                  onChange={(e) =>
                                    handleFormChange(
                                      index,
                                      "billingAddress",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}

                            {/* label */}
                            {currentPage === "purchaseexpenses" && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Expenses Category
                                  </label>
                                  <select
                                    className="w-full h-10 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={tab.form.customer}
                                    onChange={(e) => {
                                      const selectedValue = e.target.value;
                                      if (selectedValue === "new") {
                                        setNewCategory(true); // Open the modal or handle adding a new party
                                      } else {
                                        handleFormChange(
                                          index,
                                          "customer",
                                          selectedValue
                                        );
                                      }
                                    }}
                                  >
                                    <option value="" disabled>
                                      Select Expenses Category
                                    </option>

                                    <option
                                      value="new"
                                      className="text-blue-600"
                                    >
                                      + Add New Category
                                    </option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>

                          {currentPage === "purchasereturn" && (
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700">
                                Phone No.
                              </label>
                              <Input
                                type="text"
                                className="h-[40px]"
                                value={tab.form.phone}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "phone",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}

                          {allTransactionSettings?.moreFeatures?.eWayBillNo && (
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700">
                                E-Way Bill No.
                              </label>
                              <Input
                                type="text"
                                className="h-[40px]"
                                value={tab.form.ewaybill}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "ewaybill",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                          {allTransactionSettings?.additionalFields?.transaction?.map(
                            (field, i) =>
                              field.enabled && (
                                <div key={i} className="w-full">
                                  <label className="block text-sm font-medium text-gray-700">
                                    {field.name}
                                  </label>
                                  <input
                                    type="text"
                                    className="h-[40px] border rounded px-2"
                                    value={tab.form[field.name] || ""}
                                    onChange={(e) =>
                                      handleFormChange(
                                        index,
                                        field.name,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              )
                          )}

                          {allTransactionSettings?.header
                            ?.customersPODetails && (
                            <div className="flex gap-2">
                              <div className="flex items-center justify-end">
                                <label className="text-sm font-medium text-gray-700">
                                  PO Date:
                                </label>
                                <Input
                                  type="date"
                                  className="h-[40px] w-32"
                                  value={tab.form.poDate}
                                  onChange={(e) =>
                                    handleFormChange(
                                      index,
                                      "poDate",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">
                                  PO Number
                                </label>
                                <input
                                  type="text"
                                  className="w-[197px] border rounded pl-2 pr-2 py-2 focus:outline-none focus:border-blue-500"
                                  value={tab.form.poNumber}
                                  onChange={(e) =>
                                    handleFormChange(
                                      index,
                                      "poNumber",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {currentPage !== "purchaseorders" &&
                            currentPage !== "purchasereturn" && (
                              <>
                                {/* Billing Address Input */}
                                <div className="w-full">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Billing Address
                                  </label>
                                  <input
                                    type="text"
                                    className="w-[197px] border rounded pl-2 pr-2 py-2 focus:outline-none focus:border-blue-500"
                                    value={tab.form.billingAddress}
                                    onChange={(e) =>
                                      handleFormChange(
                                        index,
                                        "billingAddress",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </>
                            )}
                        </div>

                        {/* Right column */}
                        <div className="flex flex-col gap-4 w-1/3">
                          {/* Invoice Number Input */}
                          {allTransactionSettings?.header?.invoiceBillNo && (
                            <div className="flex items-center justify-end">
                              <label className="text-sm font-medium text-gray-700">
                                Invoice Number:{" "}
                              </label>
                              <input
                                type="text"
                                className="w-32 border rounded pl-2 pr-2 py-2 focus:outline-none focus:border-blue-500"
                                value={
                                  getInvoicePrefix()
                                    ? getInvoicePrefix() +
                                      (totalInvoices || totalInvoices)
                                    : totalInvoices || totalInvoices
                                }
                                disabled
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "invoiceNumber",
                                    totalInvoices || ""
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* Invoice Date Input */}
                          {allTransactionSettings?.header
                            ?.addTimeOnTransactions && (
                            <div className="flex items-center justify-end space-x-4 mt-2">
                              <label className="text-sm font-medium text-gray-700">
                                Invoice Time:
                              </label>
                              <Input
                                type="time"
                                className="h-[40px] w-32"
                                value={tab.form.invoiceTime}
                                onChange={(e) =>
                                  handleFormChange(
                                    index,
                                    "invoiceTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-end">
                            <label className="text-sm font-medium text-gray-700">
                              Invoice Date:
                            </label>
                            <Input
                              type="date"
                              className="h-[40px] w-32"
                              value={tab.form.invoiceDate}
                              onChange={(e) =>
                                handleFormChange(
                                  index,
                                  "invoiceDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {/* State of Supply Input */}
                          <div className="flex items-center justify-end">
                            <label className="text-sm font-medium text-gray-700">
                              State of Supply:
                            </label>
                            <select
                              className="w-32 h-10 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                              value={tab.form.stateOfSupply}
                              onChange={(e) =>
                                handleFormChange(
                                  index,
                                  "stateOfSupply",
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                Select State
                              </option>
                              {[
                                "Andhra Pradesh",
                                "Arunachal Pradesh",
                                "Assam",
                                "Bihar",
                                "Chhattisgarh",
                                "Goa",
                                "Gujarat",
                                "Haryana",
                                "Himachal Pradesh",
                                "Jharkhand",
                                "Karnataka",
                                "Kerala",
                                "Madhya Pradesh",
                                "Maharashtra",
                                "Manipur",
                                "Meghalaya",
                                "Mizoram",
                                "Nagaland",
                                "Odisha",
                                "Punjab",
                                "Rajasthan",
                                "Sikkim",
                                "Tamil Nadu",
                                "Telangana",
                                "Tripura",
                                "Uttar Pradesh",
                                "Uttarakhand",
                                "West Bengal",
                                "Andaman and Nicobar Islands",
                                "Chandigarh",
                                "Dadra and Nagar Haveli and Daman and Diu",
                                "Lakshadweep",
                                "Delhi",
                                "Puducherry",
                              ].map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr>
                            <th className="p-2 text-xs text-white bg-blue-500 border border-blue-600">
                              #
                            </th>
                            <th className="p-2 text-xs text-white bg-blue-500 border border-blue-600">
                              ITEM
                            </th>
                            {/* Dynamic columns */}
                            {Object.entries(enabledFields).map(
                              ([field, enabled]) =>
                                enabled && (
                                  <th
                                    key={field}
                                    className="p-2 text-xs text-white bg-blue-500 border border-blue-600"
                                  >
                                    {field.toUpperCase()}
                                  </th>
                                )
                            )}
                            {/* Custom fields */}
                            {customFields.map((field) => (
                              <th
                                key={field.name}
                                className="p-2 text-xs text-white bg-blue-500 border border-blue-600"
                              >
                                {field.name.toUpperCase()}
                              </th>
                            ))}
                            {/* Quantity columns */}
                            <th
                              className="p-2 text-xs text-center text-white bg-blue-500 border border-blue-600"
                              colSpan={4}
                            >
                              QTY
                            </th>
                            {allTransactionSettings?.itemsTable
                              ?.freeItemQuantity && (
                              <th className="p-2 text-xs text-white bg-blue-500 border border-blue-600">
                                Free Quantity
                              </th>
                            )}
                            <th className="p-2 text-xs text-white bg-blue-500 border border-blue-600">
                              PRICE/UNIT
                            </th>
                            <th
                              className="p-2 text-xs text-center text-white bg-blue-500 border border-blue-600"
                              colSpan={2}
                            >
                              DISCOUNT
                            </th>
                            <th
                              className="p-2 text-xs text-center text-white bg-blue-500 border border-blue-600"
                              colSpan={2}
                            >
                              TAX
                            </th>
                            <th className="p-2 text-xs text-white bg-blue-500 border border-blue-600">
                              AMOUNT
                            </th>
                          </tr>
                          {/* Subcolumn labels */}
                          <tr>
                            <th colSpan={2} className="border bg-blue-500"></th>
                            {Object.entries(enabledFields).map(
                              ([field, enabled]) =>
                                enabled && (
                                  <th
                                    key={field}
                                    className="border-r border-b"
                                  />
                                )
                            )}
                            {customFields.map(() => (
                              <th className="border-b" />
                            ))}
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Base
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Unit
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Secondary
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Unit
                            </th>
                            {allTransactionSettings?.itemsTable
                              ?.freeItemQuantity && (
                              <th className="border bg-blue-500" />
                            )}
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Without Tax
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              %
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Amount
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              %
                            </th>
                            <th className="p-1 text-xs text-center text-white bg-blue-500 border border-blue-600">
                              Amount
                            </th>
                            <th className="border bg-blue-500" />
                          </tr>
                        </thead>
                        <tbody>
                          {tab.form.items.map((item, itemIndex) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="p-1 border text-center">
                                {itemIndex + 1}
                              </td>
                              <td className="p-1 border">
                                <div className="flex flex-col">
                                  <input
                                    type="text"
                                    value={item.itemName}
                                    onChange={(e) =>
                                      handleNumericInputChange(
                                        item.id,
                                        "itemName",
                                        e.target.value
                                      )
                                    }
                                    onClick={(e) =>
                                      handleItemPopover(e, item.id)
                                    }
                                    onBlur={() =>
                                      handleCheckItemName(
                                        item.id,
                                        item.itemName
                                      )
                                    }
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter item name"
                                  />
                                  {!isUnique && (
                                    <span className="text-red-500 text-[10px] mt-1">
                                      Item name already exists
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Dynamic fields */}
                              {Object.entries(enabledFields).map(
                                ([field, enabled]) =>
                                  enabled && (
                                    <td key={field} className="p-1 border">
                                      <input
                                        type="text"
                                        value={item[field] || ""}
                                        onChange={(e) =>
                                          handleItemChange(
                                            item.id,
                                            field,
                                            e.target.value
                                          )
                                        }
                                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                      />
                                    </td>
                                  )
                              )}
                              {/* Custom fields */}
                              {customFields.map((field) => (
                                <td key={field.name} className="p-1 border">
                                  <input
                                    type="text"
                                    value={item[field.name] || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        item.id,
                                        field.name,
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                  />
                                </td>
                              ))}
                              {/* Base Quantity input */}
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.quantity?.primary || ""}
                                  onChange={(e) =>
                                    handleNumericInputChange(
                                      item.id,
                                      "quantity",
                                      e.target.value,
                                      "primary"
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              </td>
                              {/* Base Unit dropdown */}
                              <td className="p-1 border">
                                <select
                                  value={item.primaryUnit || ""}
                                  onChange={(e) =>
                                    handlePrimaryUnitChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">Select</option>
                                  <option value="BOX">BOX</option>
                                  <option value="NONE">NONE</option>
                                  {updatedPrimaryUnits?.map((unit, index) => (
                                    <option key={index} value={unit.name}>
                                      {unit.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              {/* Secondary Quantity input */}
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.quantity?.secondary || ""}
                                  onChange={(e) =>
                                    handleNumericInputChange(
                                      item.id,
                                      "quantity",
                                      e.target.value,
                                      "secondary"
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              </td>
                              {/* Secondary Unit dropdown */}
                              <td className="p-1 border">
                                <select
                                  value={item.secondaryUnit || ""}
                                  onChange={(e) =>
                                    handleSecondaryUnitChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">Select</option>
                                  <option value="PIECES">PIECES</option>
                                  <option value="NONE">NONE</option>
                                  {updatedSecondaryUnits?.map((unit, index) => (
                                    <option key={index} value={unit.name}>
                                      {unit.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              {/* Free item quantity */}
                              {allTransactionSettings?.itemsTable
                                ?.freeItemQuantity && (
                                <td className="p-1 border">
                                  <input
                                    type="text"
                                    value={item.freeItemQuantity || ""}
                                    onChange={(e) =>
                                      handleNumericInputChange(
                                        item.id,
                                        "freeItemQuantity",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                  />
                                </td>
                              )}
                              {/* Price input */}
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.price || ""}
                                  onChange={(e) =>
                                    handleNumericInputChange(
                                      item.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              </td>
                              {/* Discount inputs */}
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.discount.percentage || ""}
                                  onChange={(e) =>
                                    handleNumericInputChange(
                                      item.id,
                                      "discount",
                                      e.target.value,
                                      "percentage"
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.discount.amount || ""}
                                  readOnly
                                  className="w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 focus:outline-none"
                                />
                              </td>
                              {/* Tax inputs */}
                              <td className="p-1 border">
                                <select
                                  value={item.tax.percentage || ""}
                                  onChange={(e) =>
                                    handleNumericInputChange(
                                      item.id,
                                      "tax",
                                      e.target.value,
                                      "percentage"
                                    )
                                  }
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="">Select Tax %</option>
                                  {taxRates?.map((tax, index) => (
                                    <option
                                      key={index}
                                      value={`${tax.name} ${tax.rate}`}
                                    >
                                      {tax.name} {tax.rate}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.tax.amount || ""}
                                  readOnly
                                  className="w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 focus:outline-none"
                                />
                              </td>
                              {/* Amount */}
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={item.amount || ""}
                                  readOnly
                                  className="w-full text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 focus:outline-none"
                                />
                              </td>
                            </tr>
                          ))}
                          {/* Totals Row */}
                          <tr className="font-bold bg-gray-100 text-blue-600">
                            <td
                              colSpan={2}
                              className="p-2 border flex items-center"
                            >
                              <button
                                className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2"
                                onClick={handleAddRow}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                              TOTAL
                            </td>
                            <td className="p-2 border text-center"></td>
                            {/* Dynamic field totals */}
                            {Object.entries(enabledFields).map(
                              ([field, enabled]) =>
                                enabled && (
                                  <td key={field} className="p-2 border">
                                    {getTotalForField(tab.form?.items, field)}
                                  </td>
                                )
                            )}
                            {/* Custom fields */}
                            {customFields.map(() => (
                              <td className="border" />
                            ))}
                            <td className="p-2 border text-center">
                              {getTotalForField(
                                tab.form?.items,
                                "quantity",
                                "primary"
                              ) || 0}
                            </td>
                            <td className="p-2 border text-center"></td>
                            <td className="p-2 border text-center">
                              {getSecondaryQuantityPrice(tab.form?.items) || 0}
                            </td>
                            <td className="p-2 border text-center"></td>
                            {allTransactionSettings?.itemsTable
                              ?.freeItemQuantity && (
                              <td className="p-2 border">
                                {getTotalForField(
                                  tab.form?.items,
                                  "freeItemQuantity"
                                )}
                              </td>
                            )}
                            <td className="p-2 border">
                              {getTotalForField(tab.form?.items, "price")}
                            </td>
                            <td className="p-2 border text-center">
                              {getTotalForField(
                                tab.form?.items,
                                "discount",
                                "percentage"
                              ) || 0}
                            </td>
                            <td className="p-2 border text-center">
                              {getTotalForField(
                                tab.form?.items,
                                "discount",
                                "amount"
                              ) || 0}
                            </td>
                            <td className="p-2 border text-center">
                              {getTotalForField(
                                tab.form?.items,
                                "tax",
                                "percentage"
                              ) || 0}
                            </td>
                            <td className="p-2 border text-center">
                              {getTotalForField(
                                tab.form?.items,
                                "tax",
                                "amount"
                              ) || 0}
                            </td>
                            <td className="p-2 border text-center">
                              {getTotalForField(tab.form?.items, "amount") || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="flex flex-col space-y-4">
                        {/* Left Column */}

                        {tabs[index]?.form?.transportationDetails
                          ?.filter((detail) => detail.name.trim() !== "") // 🚀 Empty name wale remove
                          .map((detail, idx) => (
                            <div className="w-[212px]" key={detail.id}>
                              <input
                                type="text"
                                placeholder={detail.name}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={detail.inputValue}
                                onChange={(e) =>
                                  handleTransportationChange(
                                    idx,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ))}
                      </div>

                      {/* Middle Column */}
                      <div className="space-y-2 flex flex-col">
                        <div className="flex items-center gap-2">
                          <Select
                            value={tab[index]?.form.paymentType} // Bind to state
                            onChange={
                              (e) =>
                                handleFormChange(
                                  0,
                                  "paymentType",
                                  e.target.value
                                ) // Handle change
                            }
                            className="w-[150px] text-sm"
                            size="small"
                          >
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="cheque">Cheque</MenuItem>
                            {banks?.map((item) => (
                              <MenuItem value={item.bankName}>
                                {item.bankName}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>

                        <Button
                          variant="outlined"
                          size="small"
                          className="text-sm flex items-center w-[220px] justify-start"
                          onClick={() => {
                            // Logic to add description if needed
                          }}
                        >
                          <AddIcon className="w-4 h-4 mr-1" />
                          ADD DESCRIPTION
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="text-sm flex items-center w-[150px] justify-start"
                          onClick={() => {
                            // Logic to add image if needed
                          }}
                        >
                          <Camera className="w-4 h-4 mr-1" />
                          ADD IMAGE
                        </Button>
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col gap-3 w-full items-end">
                        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                          {/* Additional Charges Section */}
                          {allTransactionSettings?.additionalCharges?.map(
                            (charge, index1) => (
                              <React.Fragment key={charge.name}>
                                <span className="text-sm text-right">
                                  {charge.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    className="w-[100px] p-2 border border-gray-300 rounded-sm text-sm"
                                    value={
                                      tab[index]?.form.charges?.[index1]
                                        ?.value || ""
                                    }
                                    onChange={(e) =>
                                      handleChargeChange(e, index1)
                                    }
                                    placeholder="Amount"
                                  />
                                  <select
                                    className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                                    value={
                                      tab[index]?.form.charges?.[index1]
                                        ?.taxRate || ""
                                    }
                                    onChange={(e) =>
                                      handleTaxRateChange(e, index1)
                                    }
                                  >
                                    <option value="">Select Tax Rate</option>
                                    {(profile?.country === "India"
                                      ? profile?.taxRates
                                      : profile?.taxRates
                                    ).map((rate) => (
                                      <option key={rate._id} value={rate._id}>
                                        {rate.name} ({rate.rate}%)
                                      </option>
                                    ))}
                                  </select>
                                  <span className="w-[100px] text-sm">
                                    {tab[index]?.form.charges?.[index1]
                                      ?.totalWithTax || 0}
                                  </span>
                                </div>
                              </React.Fragment>
                            )
                          )}

                          {/* Totals and Balance Section */}
                          <span className="text-sm text-right">
                            Items Total
                          </span>
                          <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                            value={getTotalForField(
                              tab[index]?.form.items,
                              "amount"
                            )}
                            readOnly
                          />

                          <span className="text-sm text-right">
                            Charges Total
                          </span>
                          <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                            value={
                              tab[index]?.form.charges
                                ? tab[index]?.form.charges
                                    .reduce(
                                      (total, charge) =>
                                        total +
                                        (parseFloat(charge.totalWithTax) || 0),
                                      0
                                    )
                                    .toFixed(2)
                                : "0.00"
                            }
                            readOnly
                          />

                          <span className="text-sm text-right">
                            Grand Total
                          </span>
                          <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                            value={calculateGrandTotal(index)}
                            readOnly
                          />

                          <div className="col-span-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="received"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setIsChecked(checked);
                                setTabs((prevTabs) =>
                                  prevTabs.map((tab, index2) =>
                                    index2 === index
                                      ? {
                                          ...tab,
                                          form: {
                                            ...tab.form,
                                            receivedAmount: checked
                                              ? calculateGrandTotal(index)
                                              : 0,
                                            balanceAmount: checked
                                              ? 0
                                              : calculateGrandTotal(index),
                                          },
                                        }
                                      : tab
                                  )
                                );
                              }}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">Received</span>
                          </div>

                          <span className="text-sm text-right">
                            Received Amount
                          </span>
                          <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                            value={tabs[index]?.form.receivedAmount}
                            onChange={(e) => {
                              if (isChecked) return; // Agar checkbox checked hai, to manual change allow na ho
                              const newReceivedAmount =
                                parseFloat(e.target.value) || 0;
                              setTabs((prevTabs) =>
                                prevTabs.map((tab, index2) =>
                                  index2 === index
                                    ? {
                                        ...tab,
                                        form: {
                                          ...tab.form,
                                          receivedAmount: newReceivedAmount,
                                          balanceAmount:
                                            calculateGrandTotal(index) -
                                            newReceivedAmount,
                                        },
                                      }
                                    : tab
                                )
                              );
                            }}
                            disabled={isChecked} // Agar checkbox checked hai to disable input
                          />

                          <span className="text-sm text-right">
                            Balance Amount
                          </span>
                          <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-sm text-sm"
                            value={
                              calculateGrandTotal(index) -
                              tabs[index]?.form?.receivedAmount
                            }
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </>
              ))}
              <div className="fixed bottom-0 left-0 right-0 flex justify-end items-center gap-2 p-4 bg-white border-t">
                <Button
                  variant="outlined"
                  className="text-blue-500 hover:bg-blue-50"
                  onClick={() => {
                    /* handle share */
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="contained"
                  className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={(e) => handleSubmit(e)}
                  disabled={!isUnique || !isPartyNameUnique} // Disable if any is false
                >
                  Save
                </Button>
              </div>
            </Paper>

            <Popover
              open={Boolean(itemPopover)}
              anchorEl={itemPopover}
              onClose={handleCloseItemPopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 2, maxWidth: 600 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: "0.75rem" }}>ITEM</TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          SALE PRICE
                        </TableCell>
                        {allTransactionSettings?.itemsTable
                          ?.displayPurchasePrice && (
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            PURCHASE PRICE
                          </TableCell>
                        )}
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          STOCK
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          LOCATION
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items?.map((item) => (
                        <TableRow
                          key={item.id}
                          onClick={() =>
                            handleItemSelect(activeTab, selectedRowId, item)
                          }
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            {item.itemName}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            {item.salePrice}
                          </TableCell>
                          {allTransactionSettings?.itemsTable
                            ?.displayPurchasePrice && (
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {item.purchasePrice}
                            </TableCell>
                          )}
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            {item.minStockToMaintain}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            {item.location}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Popover>
            <AddPartyModal
              isOpen={addPartyNew}
              onClose={() => setAddPartyNew(false)}
              handleParty={handleParty}
            />
          </Box>
        </>
      )}
    </>
  );
}
