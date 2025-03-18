import React, { useState, useEffect , useCallback, useRef } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  MoreVertical,
  X,
  Calendar,
  Loader2,
  Info,
  InfoIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";




const AddBankModal = ({isEdit , setIsAddBankModalOpen , formData , handleAddBank , setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Validation for openingBalance: Only numbers, no negative values
    // Validation for numbers: Only allow digits (0-9), no negative values
    if ((name === "openingBalance" || name === "accountNumber") && !/^\d*$/.test(value)) {
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
<>
<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
      {/* Header */}

      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">Add Bank Account</h2>

        <button
          onClick={() => setIsAddBankModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
        <div className="p-6">
          {/* Form Fields */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="bankName" className="sr-only">
                Account Display Name
              </label>

              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData?.bankName}
                onChange={handleInputChange}
                placeholder="Account Display Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="openingBalance" className="sr-only">
                Opening Balance
              </label>

              <input
                type="text"
                id="openingBalance"
                name="openingBalance"
                value={formData?.openingBalance}
                onChange={handleInputChange}
                placeholder="Opening Balance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="text-xs text-gray-500 absolute -top-5">
                As Of Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  id="asOfDate"
                  name="asOfDate"
                  value={formData?.asOfDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                id="printUPI"
                name="printUPI"
                checked={formData?.printUPI}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />

              <label
                htmlFor="printUPI"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Print UPI QR Code on Invoices
              </label>

              <InfoIcon size={16} className="ml-2 text-gray-400" />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="printBankDetails"
                name="printBankDetails"
                checked={formData?.printBankDetails}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />

              <label
                htmlFor="printBankDetails"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Print bank details on invoices
              </label>

              <InfoIcon size={16} className="ml-2 text-gray-400" />
            </div>
          </div>

          {
            formData?.printUPI ? <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="accountNumber" className="sr-only">
                Account Number
              </label>

              <input
                type="number"
                id="accountNumber"
                name="accountNumber"
                value={formData?.accountNumber}
                onChange={handleInputChange}
                placeholder="Account Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="openingBalance" className="sr-only">
                 IFSC Code
              </label>

              <input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={formData?.ifscCode}
                onChange={handleInputChange}
                placeholder="IFSC Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="text-xs text-gray-500 absolute -top-5">
                  UPI ID
              </label>

              <div className="relative">
                <input
                  type="text"
                  id=""
                  name="upiId"
                  value={formData?.upiId || ''}
                  placeholder="UPI ID"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
            </> : <>
            </>
          }

          {
            formData?.printBankDetails ? 
            <>   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className=" relative">
              <label htmlFor="accountholder" className="sr-only">
                Account HolderName
              </label>

              <input
                type="text"
                id="accountholder"
                name="accountHolder"
                value={formData?.accountHolder}
                onChange={handleInputChange}
                placeholder="Account Holder Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            </div></>:<></>
          }
        </div>

        {/* Footer */}

        <div className="flex justify-end p-4 border-t">
          <button
            type="submit"
            onClick={handleAddBank}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
    </div>
  </div>

</>
  )
}




const Banking = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [isEdit , setIsEdit] = useState(false)
    const [menuOpen, setMenuOpen] = useState(null);
    const toggleMenu = (index) => {
      setMenuOpen(menuOpen === index ? null : index);
    };

    const menuRef = useRef(null);

       
  
    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(null);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  const [transactions] = useState([
    {
      type: "Purchase",
      name: "Party2",
      date: "31/12/2024, 12:04 PM",
      amount: 59.0,
    },
    {
      type: "Sale",
      name: "Party2",
      date: "31/12/2024, 12:03 PM",
      amount: 59.0,
    },
    {
      type: "Opening Balance",
      name: "Opening Balance",
      date: "31/12/2024",
      amount: 20000.0,
    },
    { type: "Bank Adj Reduce", name: "", date: "31/12/2024", amount: 10000.0 },
    {
      type: "Bank To Bank",
      name: "To: SBI",
      date: "31/12/2024",
      amount: 5000.0,
    },
  ]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    openingBalance: "",
    asOfDate: "",
    printUPI: false,
    printBankDetails: false,
  });

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        if (decodedPhone) {
          setPhone(decodedPhone);
        } else {
          throw new Error("Failed to decode phone number.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPhone();
  }, []);

  const fetchAllBanks = async () => {
    if (!phone) return;

    try {
      const existingDoc = await db.get(phone);

      setBanks(existingDoc?.banks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAllBanks();
  }, [phone]);

  useEffect(() => {
    if (banks?.length > 0 && !selectedBank) {
      console.log(banks , "b")
      setSelectedBank(banks[0]);
    }
  }, [banks, selectedBank]);

 

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };
  
  const handleDateChange = (e) => {
    const { value } = e.target;
    // Allow only numbers and forward slashes
    const formattedValue = value.replace(/[^\d/]/g, "");
    // Automatically add forward slashes
    let finalValue = formattedValue;
    if (formattedValue.length === 2 && !formattedValue.includes("/")) {
      finalValue = formattedValue + "/";
    }
    if (formattedValue.length === 5 && formattedValue.indexOf("/", 3) === -1) {
      finalValue = formattedValue + "/";
    }
    setFormData((prev) => ({ ...prev, asOfDate: finalValue }));
  };



  const handleAddBank = async () => {
    try {
      if (!phone) {
        toast.error("Phone number is required.");
        return;
      }
  
      let existingDoc;
      try {
        existingDoc = await db.get(phone);
      } catch (error) {
        if (error.name === "not_found") {
          existingDoc = { _id: phone, banks: [] }; // Create new doc if not found
        } else {
          throw error;
        }
      }
  
      const { bankName, openingBalance, asOfDate } = formData;
  
      if (!bankName || !openingBalance || !asOfDate) {
        toast.error("All fields are required.", { style: { background: "#f56565", color: "#fff" } });
        return;
      }
  
      const [day, month, year] = asOfDate.split("/");
      const formattedDate = new Date(`${year}-${month}-${day}`);
  
      if (isNaN(formattedDate.getTime())) {
        toast.error("Invalid date format.", { style: { background: "#f56565", color: "#fff" } });
        return;
      }
  
      const existingBanks = existingDoc.banks || [];
  
      if (isEdit) {
        if (menuOpen === null || menuOpen < 0 || menuOpen >= existingBanks.length) {
          toast.error("Invalid bank index.");
          return;
        }
  
        existingBanks[menuOpen] = {  // ✅ Update existing bank
          ...existingBanks[menuOpen],
          bankName,
          openingBalance,
          asOfDate: formattedDate.toISOString().split("T")[0],
          printUPI: formData.printUPI,
          printBankDetails: formData.printBankDetails,
          accountNumber: formData.accountNumber || '',
          accountHolder: formData.accountHolder || '',
          ifscCode: formData.ifscCode || '',
          upiId: formData.upiId || '',
        };
  
        toast.success("Bank updated successfully!", { style: { background: "#48bb78", color: "#fff" } });
      } else {
        const existingBank = existingBanks.find((bank) => bank.bankName === bankName);
        if (existingBank) {
          toast.error("A bank with this name already exists.", { style: { background: "#f56565", color: "#fff" } });
          return;
        }
  
        existingBanks.push({  // ✅ Add new bank
          bankName,
          openingBalance,
          asOfDate: formattedDate.toISOString().split("T")[0],
          printUPI: formData.printUPI,
          printBankDetails: formData.printBankDetails,
          accountNumber: formData.accountNumber || '',
          accountHolder: formData.accountHolder || '',
          ifscCode: formData.ifscCode || '',
          upiId: formData.upiId || '',
        });
  
        toast.success("Bank added successfully!", { style: { background: "#48bb78", color: "#fff" } });
      }
  
      await db.put({ ...existingDoc, banks: existingBanks });
  
      resetForm();
      setIsAddBankModalOpen(false)
      fetchAllBanks();
    } catch (error) {
      console.error("Failed to add/update bank:", error);
      toast.error(`Failed to add/update bank: ${error.message}`, { style: { background: "#f56565", color: "#fff" } });
    }
  };
  
  // 🔹 Reset form and edit state
  const resetForm = () => {
    setIsEdit(false);
    setMenuOpen(null);
    setFormData({
      bankName: "",
      openingBalance: "",
      asOfDate: "",
      printUPI: false,
      printBankDetails: false,
      accountNumber: '',
      accountHolder: '',
      ifscCode: '',
      upiId: '',
    });
  };
  
  
  const handleAddClick = ()=>{
    setIsAddBankModalOpen(true)
    setIsEdit(false)
    resetForm()
  }


  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Banking with Paper Bill</h1>
        <p className="text-gray-600 mb-8">
          Add Bank accounts on Paper Bill and you can effortlessly:
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">
              Print Bank Details on Invoices
            </h3>
            <p className="text-gray-600 text-sm">
              Print account details on your invoices and get payments via
              NEFT/RTGS/IMPS etc.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">
              Track your transactions
            </h3>
            <p className="text-gray-600 text-sm">
              Keep track of bank transactions by entering them on Paper Bill to
              maintain accurate records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">
              Receive Online Payments
            </h3>
            <p className="text-gray-600 text-sm">
              Print QR code on your invoices or send payment links to your
              customers.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAddClick()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Add Bank Account
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            At Paper Bill, the security of your details is our top priority.
          </p>
          <div className="flex justify-center items-center gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full flex items-center gap-2">
              <svg
                className="w-6 h-6 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm text-yellow-700">
                Paper Bill never stores any details that you enter. No one can
                access them without your permission.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  // 21/01/2025
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownOptions = [
    {
      label: "Bank to Cash Transfer",
      value: "bank-to-cash",
    },
    {
      label: "Cash to Bank Transfer",
      value: "cash-to-bank",
    },
    {
      label: "Bank to Bank Transfer",
      value: "bank-to-bank",
    },
    {
      label: "Adjust Bank Balance",
      value: "adjust-balance",
    },
  ];

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
    // Handle the selected option here
    console.log("Selected option:", option);
  };

  if (!banks || banks.length === 0) {
    return (
      <>
        <EmptyState />
        {isAddBankModalOpen && <AddBankModal setIsAddBankModalOpen={setIsAddBankModalOpen} formData={formData} setFormData={setFormData} isEdit={isEdit} handleAddBank={handleAddBank} />}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/3 p-4 bg-white border-r">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 w-full text-sm"
                  placeholder="Search"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Search
                className="h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
            )}
          </div>
          {!isSearchOpen && (
            <button
              className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => handleAddClick()}
            >
              <Plus className="h-4 w-4" />
              Add Bank
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            ACCOUNT NAME
          </div>
          <div>AMOUNT</div>
        </div>

        {banks &&
          banks?.map((bank, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer ${
                selectedBank?.id === bank.id ? "bg-blue-100" : "bg-blue-50"
              }`}
              onClick={() => handleBankSelect(bank)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏛️</span>
                <span className="text-sm">{bank.bankName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-400">
                  ₹ {Number(bank.openingBalance)?.toFixed(2)}
                </span>
                  <span className="text-sm border-t relative">
                                        <button
                                          className="p-2 hover:bg-gray-200 rounded-full"
                                          onClick={() => toggleMenu(index)}
                                        >
                                          <MoreVertical className="w-5 h-5" />
                                        </button>
                                       
                {/* <MoreVertical className="h-4 w-4 text-gray-500"   onClick={() => toggleMenu(index)} /> */}
                  {menuOpen === index && (
                                          <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
                                            <button
                                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                              onClick={() => {
                                                setIsEdit(true);
                                                setIsAddBankModalOpen(true)
                                                setFormData(bank)
                                                // setCurrentParty(party);
                                                // setMenuOpen(false);
                                              }}
                                            >
                                              View/Edit
                                            </button>
                                            <button
  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
  onClick={async () => {
    try {
      const existingDoc = await db.get(phone);

      if (!existingDoc.banks || existingDoc.banks.length === 0) {
        throw new Error("No banks found");
      }

      // Find the index of the bank to delete
      const bankIndex = existingDoc.banks.findIndex((b) => b.bankName === bank.bankName);
      if (bankIndex === -1) {
        throw new Error("Bank not found");
      }

      // Remove the bank from the list
      existingDoc.banks.splice(bankIndex, 1);

      // Update the database
      await db.put(existingDoc);

      // Refresh the list
      fetchAllBanks();

      toast.success("Bank deleted successfully!", {
        duration: 4000,
        position: "top-center",
        style: { background: "#48bb78", color: "#fff" },
      });

      setMenuOpen(null);
    } catch (error) {
      toast.error(
        error?.message || "Failed to delete bank. Please try again later.",
        {
          duration: 4000,
          position: "top-center",
          style: { background: "#f56565", color: "#fff" },
        }
      );
    }
  }}
>
  Delete
</button>

                                          </div>
                                        )}
                                         </span>
              </div>
            </div>
          ))}
      </div>

      <div className="flex-1 p-2">
        {selectedBank ? (
          <div className="bg-white rounded-lg p-2 mb-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bank Name:
                </label>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  {selectedBank.bankName}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Account Number:
                </label>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  {selectedBank.accountNumber || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  IFSC Code:
                </label>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  {selectedBank.ifscCode || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  UPI ID:
                </label>
                <div className="text-sm p-2 bg-gray-50 rounded">
                  {selectedBank.upiId || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex justify-end relative">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <ChevronDown className="h-4 w-4" />
                Deposit / Withdraw
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-[200px]">
                  {dropdownOptions.map((option) => (
                    <button
                      key={option.value}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-lg p-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-sm">TRANSACTIONS</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm"
                placeholder="Search transactions..."
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-2">TYPE</th>
                <th className="pb-2">NAME</th>
                <th className="pb-2">DATE</th>
                <th className="pb-2 text-right">AMOUNT</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {transaction.type === "Purchase" && (
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                      {transaction.type === "Sale" && (
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                      <span className="text-sm">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{transaction.name}</td>
                  <td className="py-3 text-sm">{transaction.date}</td>
                  <td className="py-3 text-right text-sm">
                    ₹ {transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3 text-right">
                    <MoreVertical className="h-4 w-4 text-gray-500 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddBankModalOpen && <AddBankModal setIsAddBankModalOpen={setIsAddBankModalOpen} formData={formData} setFormData={setFormData} isEdit={isEdit} handleAddBank={handleAddBank} />}
    </div>
  );
};

export default Banking;
