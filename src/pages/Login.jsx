// import React, { useState } from "react";
// import { FaPhoneAlt, FaLock, FaSpinner } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../Redux/userSlice";
// import { useDispatch } from "react-redux";
// import {toast} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import db from "../config/dbConfig";
// import * as jose from "jose";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     phone: "",
//     otp: "",
//   });
//   const [generatedOTP, setGeneratedOTP] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [userExists, setUserExists] = useState(null);

//   const generateOTP = () =>
//     Math.floor(100000 + Math.random() * 900000).toString();

//   async function generateToken(payload, secret) {
//     const secretEncoder = new TextEncoder().encode(secret);
//     const jwt = await new jose.SignJWT(payload)
//       .setProtectedHeader({ alg: "HS256" })
//       .setIssuedAt()
//       .setExpirationTime("2h")
//       .sign(secretEncoder);
//     return jwt;
//   }

//   const handleCheckPhone = async (e) => {
//     e.preventDefault();

//     try {
//       // DB se user check karo
//       const phoneId = formData.phone.trim(); // Use phone as _id

//       // Check if the user exists
//       const existingUser = await db.get(phoneId).catch(() => null);

//       if (!existingUser) {
//         toast.error("🚨 User not found! Please register first.", {
//           duration: 4000,
//           position: "top-center",
//           style: { background: "#f56565", color: "#fff" },
//         });
//         return;
//       }
//       setUserExists(existingUser.users[0]);
//       // Internet connection check
//       if (!navigator.onLine) {
//         const token = await generateToken(existingUser.users[0], "mySecretKey123");
//         console.log(token, "This is a token");
//         localStorage.setItem("token", token);
//         navigate("/");
//         window.location.reload();
//         toast.success("✅ Logged in successfully!", {
//           duration: 4000,
//           position: "top-center",
//           style: { background: "#48bb78", color: "#fff" },
//         });
//         return;
//       }

//       // Phone number validation
//       if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
//         toast.error("⚠️ Please enter a valid phone number!", {
//           duration: 4000,
//           position: "top-center",
//           style: { background: "#f6ad55", color: "#fff" },
//         });
//         return;
//       }

//       setIsLoading(true);

//       // Generate OTP
//       const newOTP = generateOTP();
//       setGeneratedOTP(newOTP);
//       console.log("Generated OTP:", newOTP);

//       // 2Factor API se OTP bhejo
//       const otpResponse = await fetch(
//         `https://2factor.in/API/V1/863e3f5d-dc99-11ef-8b17-0200cd936042/SMS/${formData.phone}/${newOTP}/OTP1`
//       );
//       const otpData = await otpResponse.json();

//       if (otpData.Status === "Success") {
//         setOtpSent(true);
//         toast.success("📩 OTP sent to your phone!", {
//           duration: 4000,
//           position: "top-center",
//           style: { background: "#3182ce", color: "#fff" },
//         });
//       } else {
//         toast.error("⚠️ Failed to send OTP. Please try again.", {
//           duration: 4000,
//           position: "top-center",
//           style: { background: "#f56565", color: "#fff" },
//         });
//       }
//     } catch (error) {
//       toast.error("❌ Something went wrong. Please try again.", {
//         duration: 4000,
//         position: "top-center",
//         style: { background: "#e53e3e", color: "#fff" },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePhoneLogin = async (e) => {
//     e.preventDefault();

//     if (formData.otp.length !== 6) {
//       toast.error("⚠️ Please enter a valid 6-digit OTP!", {
//         duration: 4000,
//         position: "top-center",
//         style: { background: "#f6ad55", color: "#fff" },
//       });
//       return;
//     }

//     setIsLoading(true);

//     // Verify OTP locally
//     if (formData.otp === generatedOTP) {
//       const token = await generateToken(userExists, "mySecretKey123");
//       console.log(token, "This is a token");
//       localStorage.setItem("token", token);
//       navigate("/");
//       window.location.reload();
//       toast.success("🎉 Login successful!", {
//         duration: 4000,
//         position: "top-center",
//         style: { background: "#48bb78", color: "#fff" },
//       });
//     } else {
//       toast.error("❌ Invalid OTP. Please try again.", {
//         duration: 4000,
//         position: "top-center",
//         style: { background: "#e53e3e", color: "#fff" },
//       });
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Panel */}
//       <div className="flex-1 bg-gradient-to-r from-[#CD4735] to-[#F9AC40] text-white flex flex-col justify-center items-center text-center p-10">
//         <h1 className="text-4xl font-semibold mb-6">Welcome back!</h1>
//         <p className="mb-6">Manage your finances with ease</p>
//         <Link to="/signup">
//           <button className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg">
//             Sign Up
//           </button>
//         </Link>
//       </div>

//       {/* Right Panel */}
//       <div className="flex-1 bg-white flex flex-col justify-center items-center p-10">
//         <h1 className="text-4xl text-[#F15338] font-semibold mb-6">
//           Sign In to Your Account
//         </h1>

//         <div className="flex flex-col gap-4 w-full max-w-[300px] mb-6">
//           <div className="relative">
//             <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//               disabled={otpSent}
//             />
//           </div>

//           {otpSent && (
//             <div className="relative">
//               <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit OTP"
//                 className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
//                 maxLength={6}
//                 value={formData.otp}
//                 onChange={(e) =>
//                   setFormData({ ...formData, otp: e.target.value })
//                 }
//               />
//             </div>
//           )}

//           <button
//             className={`bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg flex items-center justify-center ${
//               isLoading ? "cursor-not-allowed" : ""
//             }`}
//             onClick={otpSent ? handlePhoneLogin : handleCheckPhone}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <FaSpinner className="animate-spin mr-2" />
//             ) : otpSent ? (
//               "Verify & Login"
//             ) : (
//               "Send OTP"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { FaPhoneAlt, FaLock, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../Redux/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { serviceUrl } from "../Services/url";
import db from "../config/dbConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  });
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleCheckPhone = async (e) => {
    e.preventDefault();

    // Check internet connection
    if (!navigator.onLine) {
      toast.error("Please enable your internet connection.");
      return;
    }

    // Validate phone number
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    // Use login API to verify phone number
    dispatch(login({ phone: formData.phone }))
      .unwrap()
      .then(async (response) => {
        const existingDoc = await db.get(formData.phone);
        console.log(response, "This is the User");

        // Check if users is an array, convert to object if needed
        if (Array.isArray(existingDoc.users)) {
          existingDoc.users = {}; // Convert array to an empty object
        }

        existingDoc.users = response.user; // Assign response.user

        await db.put({...existingDoc});
        setGeneratedOTP("123456"); // Static OTP for testing
        setOtpSent(true); // Simulate OTP sent success
        toast.success("OTP verification bypassed for testing.");
      })
      .catch((error) => {
        console.log(error, "This is error");
        toast.error(
          error.data?.message ||
            "Phone number is not registered with us. Please sign up first."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();

    // Check internet connection before verifying OTP
    if (!navigator.onLine) {
      toast.error("Please enable your internet connection.");
      return;
    }

    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    // Verify OTP locally (bypassed, using static OTP)
    if (formData.otp === "123456") {
      try {
        const response = await axios.get(
          `${serviceUrl}/backup/getPaperBillData`,
          {
            params: { phoneNumber: formData.phone },
          }
        );

        try {
          // Get existing document
          let existingDoc;
          try {
            existingDoc = await db.get(formData.phone);
          } catch (getError) {
            if (getError.name === "not_found") {
              // Document doesn't exist yet, create a new one
              const newDoc = {
                _id: formData.phone,
                ...response.data.data,
                isSyncEnabled: true,
              };

              await db.put(newDoc);

              toast.success("Login successful!");
              navigate("/");
              window.location.reload();
              setIsLoading(false);
              return;
            } else {
              throw getError;
            }
          }

          // Create a new document with merged data
          const updatedDoc = { ...existingDoc };

          // Process banks - check by bankName
          if (
            response.data.data.banks &&
            Array.isArray(response.data.data.banks)
          ) {
            if (!updatedDoc.banks) updatedDoc.banks = [];

            response.data.data.banks.forEach((newBank) => {
              const bankExists = updatedDoc.banks.some(
                (existingBank) => existingBank.bankName === newBank.bankName
              );

              if (!bankExists) {
                updatedDoc.banks.push(newBank);
              }
            });
          }

          // Process bills - check by invoiceNumber
          if (
            response.data.data.bills &&
            Array.isArray(response.data.data.bills)
          ) {
            if (!updatedDoc.bills) updatedDoc.bills = [];

            response.data.data.bills.forEach((newBill) => {
              const billExists = updatedDoc.bills.some(
                (existingBill) =>
                  existingBill.invoiceNumber === newBill.invoiceNumber
              );

              if (!billExists) {
                updatedDoc.bills.push(newBill);
              }
            });
          }

          // Process cards - use full object comparison as fallback
          if (
            response.data.data.cards &&
            Array.isArray(response.data.data.cards)
          ) {
            if (!updatedDoc.cards) updatedDoc.cards = [];

            response.data.data.cards.forEach((newCard) => {
              const cardExists = updatedDoc.cards.some(
                (existingCard) =>
                  JSON.stringify(existingCard) === JSON.stringify(newCard)
              );

              if (!cardExists) {
                updatedDoc.cards.push(newCard);
              }
            });
          }

          // Process categories - check exact string match
          if (
            response.data.data.categories &&
            Array.isArray(response.data.data.categories)
          ) {
            if (!updatedDoc.categories) updatedDoc.categories = [];

            response.data.data.categories.forEach((newCategory) => {
              if (!updatedDoc.categories.includes(newCategory)) {
                updatedDoc.categories.push(newCategory);
              }
            });
          }

          // Process conversations
          if (
            response.data.data.conversations &&
            Array.isArray(response.data.data.conversations)
          ) {
            if (!updatedDoc.conversations) updatedDoc.conversations = [];

            response.data.data.conversations.forEach((newConversation) => {
              const conversationExists = updatedDoc.conversations.some(
                (existingConversation) =>
                  JSON.stringify(existingConversation) ===
                  JSON.stringify(newConversation)
              );

              if (!conversationExists) {
                updatedDoc.conversations.push(newConversation);
              }
            });
          }

          // Process expensecategories - check by categoryId
          if (
            response.data.data.expensecategories &&
            Array.isArray(response.data.data.expensecategories)
          ) {
            if (!updatedDoc.expensecategories)
              updatedDoc.expensecategories = [];

            response.data.data.expensecategories.forEach((newCategory) => {
              const categoryExists = updatedDoc.expensecategories.some(
                (existingCategory) =>
                  existingCategory.categoryId === newCategory.categoryId
              );

              if (!categoryExists) {
                updatedDoc.expensecategories.push(newCategory);
              }
            });
          }

          // Process expenseitems - check by name
          if (
            response.data.data.expenseitems &&
            Array.isArray(response.data.data.expenseitems)
          ) {
            if (!updatedDoc.expenseitems) updatedDoc.expenseitems = [];

            response.data.data.expenseitems.forEach((newItem) => {
              const itemExists = updatedDoc.expenseitems.some(
                (existingItem) => existingItem.name === newItem.name
              );

              if (!itemExists) {
                updatedDoc.expenseitems.push(newItem);
              }
            });
          }

          // Process expenses - check by item
          if (
            response.data.data.expenses &&
            Array.isArray(response.data.data.expenses)
          ) {
            if (!updatedDoc.expenses) updatedDoc.expenses = [];

            response.data.data.expenses.forEach((newExpense) => {
              const expenseExists = updatedDoc.expenses.some(
                (existingExpense) => existingExpense.item === newExpense.item
              );

              if (!expenseExists) {
                updatedDoc.expenses.push(newExpense);
              }
            });
          }

          // Process items - check by itemName
          if (
            response.data.data.items &&
            Array.isArray(response.data.data.items)
          ) {
            if (!updatedDoc.items) updatedDoc.items = [];

            response.data.data.items.forEach((newItem) => {
              const itemExists = updatedDoc.items.some(
                (existingItem) => existingItem.itemName === newItem.itemName
              );

              if (!itemExists) {
                updatedDoc.items.push(newItem);
              }
            });
          }

          // Process journalentries - check by referenceNumber
          if (
            response.data.data.journalentries &&
            Array.isArray(response.data.data.journalentries)
          ) {
            if (!updatedDoc.journalentries) updatedDoc.journalentries = [];

            response.data.data.journalentries.forEach((newEntry) => {
              const entryExists = updatedDoc.journalentries.some(
                (existingEntry) =>
                  existingEntry.referenceNumber === newEntry.referenceNumber
              );

              if (!entryExists) {
                updatedDoc.journalentries.push(newEntry);
              }
            });
          }

          // Process orders - check by orderId
          if (
            response.data.data.orders &&
            Array.isArray(response.data.data.orders)
          ) {
            if (!updatedDoc.orders) updatedDoc.orders = [];

            response.data.data.orders.forEach((newOrder) => {
              const orderExists = updatedDoc.orders.some(
                (existingOrder) => existingOrder.orderId === newOrder.orderId
              );

              if (!orderExists) {
                updatedDoc.orders.push(newOrder);
              }
            });
          }

          // Process parties - check by partyId
          if (
            response.data.data.parties &&
            Array.isArray(response.data.data.parties)
          ) {
            if (!updatedDoc.parties) updatedDoc.parties = [];

            response.data.data.parties.forEach((newParty) => {
              const partyExists = updatedDoc.parties.some(
                (existingParty) => existingParty.partyId === newParty.partyId
              );

              if (!partyExists) {
                updatedDoc.parties.push(newParty);
              }
            });
          }

          // Process payments - check by receiptNo
          if (
            response.data.data.payments &&
            Array.isArray(response.data.data.payments)
          ) {
            if (!updatedDoc.payments) updatedDoc.payments = [];

            response.data.data.payments.forEach((newPayment) => {
              const paymentExists = updatedDoc.payments.some(
                (existingPayment) =>
                  existingPayment.receiptNo === newPayment.receiptNo
              );

              if (!paymentExists) {
                updatedDoc.payments.push(newPayment);
              }
            });
          }

          // Process remaining fields with generic duplicate check
          const remainingFields = [
            "products",
            "scheduleddeliveries",
            "settings",
            "transactions",
            // "users",
          ];

          remainingFields.forEach((field) => {
            if (
              response.data.data[field] &&
              Array.isArray(response.data.data[field])
            ) {
              if (!updatedDoc[field]) updatedDoc[field] = [];

              response.data.data[field].forEach((newItem) => {
                const itemExists = updatedDoc[field].some(
                  (existingItem) =>
                    JSON.stringify(existingItem) === JSON.stringify(newItem)
                );

                if (!itemExists) {
                  updatedDoc[field].push(newItem);
                }
              });
            }
          });

          
          try {
            await db.put(updatedDoc);
            toast.success("Data synced successfully!");
            navigate("/");
            window.location.reload();
          } catch (putError) {
            if (putError.name === "conflict") {
              // Handle conflict by getting the latest version and retrying
              try {
                const latestDoc = await db.get(formData.phone);
                const retryDoc = { ...latestDoc };

                // Re-apply all the same merging logic to the latest doc
                // Process banks
                if (
                  response.data.data.banks &&
                  Array.isArray(response.data.data.banks)
                ) {
                  if (!retryDoc.banks) retryDoc.banks = [];

                  response.data.data.banks.forEach((newBank) => {
                    const bankExists = retryDoc.banks.some(
                      (existingBank) =>
                        existingBank.bankName === newBank.bankName
                    );

                    if (!bankExists) {
                      retryDoc.banks.push(newBank);
                    }
                  });
                }

                // Process bills
                if (
                  response.data.data.bills &&
                  Array.isArray(response.data.data.bills)
                ) {
                  if (!retryDoc.bills) retryDoc.bills = [];

                  response.data.data.bills.forEach((newBill) => {
                    const billExists = retryDoc.bills.some(
                      (existingBill) =>
                        existingBill.invoiceNumber === newBill.invoiceNumber
                    );

                    if (!billExists) {
                      retryDoc.bills.push(newBill);
                    }
                  });
                }

                // Process cards
                if (
                  response.data.data.cards &&
                  Array.isArray(response.data.data.cards)
                ) {
                  if (!retryDoc.cards) retryDoc.cards = [];

                  response.data.data.cards.forEach((newCard) => {
                    const cardExists = retryDoc.cards.some(
                      (existingCard) =>
                        JSON.stringify(existingCard) === JSON.stringify(newCard)
                    );

                    if (!cardExists) {
                      retryDoc.cards.push(newCard);
                    }
                  });
                }

                // Process categories
                if (
                  response.data.data.categories &&
                  Array.isArray(response.data.data.categories)
                ) {
                  if (!retryDoc.categories) retryDoc.categories = [];

                  response.data.data.categories.forEach((newCategory) => {
                    if (!retryDoc.categories.includes(newCategory)) {
                      retryDoc.categories.push(newCategory);
                    }
                  });
                }

                // Process conversations
                if (
                  response.data.data.conversations &&
                  Array.isArray(response.data.data.conversations)
                ) {
                  if (!retryDoc.conversations) retryDoc.conversations = [];

                  response.data.data.conversations.forEach(
                    (newConversation) => {
                      const conversationExists = retryDoc.conversations.some(
                        (existingConversation) =>
                          JSON.stringify(existingConversation) ===
                          JSON.stringify(newConversation)
                      );

                      if (!conversationExists) {
                        retryDoc.conversations.push(newConversation);
                      }
                    }
                  );
                }

                // Process expensecategories
                if (
                  response.data.data.expensecategories &&
                  Array.isArray(response.data.data.expensecategories)
                ) {
                  if (!retryDoc.expensecategories)
                    retryDoc.expensecategories = [];

                  response.data.data.expensecategories.forEach(
                    (newCategory) => {
                      const categoryExists = retryDoc.expensecategories.some(
                        (existingCategory) =>
                          existingCategory.categoryId === newCategory.categoryId
                      );

                      if (!categoryExists) {
                        retryDoc.expensecategories.push(newCategory);
                      }
                    }
                  );
                }

                // Process expenseitems
                if (
                  response.data.data.expenseitems &&
                  Array.isArray(response.data.data.expenseitems)
                ) {
                  if (!retryDoc.expenseitems) retryDoc.expenseitems = [];

                  response.data.data.expenseitems.forEach((newItem) => {
                    const itemExists = retryDoc.expenseitems.some(
                      (existingItem) => existingItem.name === newItem.name
                    );

                    if (!itemExists) {
                      retryDoc.expenseitems.push(newItem);
                    }
                  });
                }

                // Process expenses
                if (
                  response.data.data.expenses &&
                  Array.isArray(response.data.data.expenses)
                ) {
                  if (!retryDoc.expenses) retryDoc.expenses = [];

                  response.data.data.expenses.forEach((newExpense) => {
                    const expenseExists = retryDoc.expenses.some(
                      (existingExpense) =>
                        existingExpense.item === newExpense.item
                    );

                    if (!expenseExists) {
                      retryDoc.expenses.push(newExpense);
                    }
                  });
                }

                // Process items
                if (
                  response.data.data.items &&
                  Array.isArray(response.data.data.items)
                ) {
                  if (!retryDoc.items) retryDoc.items = [];

                  response.data.data.items.forEach((newItem) => {
                    const itemExists = retryDoc.items.some(
                      (existingItem) =>
                        existingItem.itemName === newItem.itemName
                    );

                    if (!itemExists) {
                      retryDoc.items.push(newItem);
                    }
                  });
                }

                // Process journalentries
                if (
                  response.data.data.journalentries &&
                  Array.isArray(response.data.data.journalentries)
                ) {
                  if (!retryDoc.journalentries) retryDoc.journalentries = [];

                  response.data.data.journalentries.forEach((newEntry) => {
                    const entryExists = retryDoc.journalentries.some(
                      (existingEntry) =>
                        existingEntry.referenceNumber ===
                        newEntry.referenceNumber
                    );

                    if (!entryExists) {
                      retryDoc.journalentries.push(newEntry);
                    }
                  });
                }

                // Process orders
                if (
                  response.data.data.orders &&
                  Array.isArray(response.data.data.orders)
                ) {
                  if (!retryDoc.orders) retryDoc.orders = [];

                  response.data.data.orders.forEach((newOrder) => {
                    const orderExists = retryDoc.orders.some(
                      (existingOrder) =>
                        existingOrder.orderId === newOrder.orderId
                    );

                    if (!orderExists) {
                      retryDoc.orders.push(newOrder);
                    }
                  });
                }

                // Process parties
                if (
                  response.data.data.parties &&
                  Array.isArray(response.data.data.parties)
                ) {
                  if (!retryDoc.parties) retryDoc.parties = [];

                  response.data.data.parties.forEach((newParty) => {
                    const partyExists = retryDoc.parties.some(
                      (existingParty) =>
                        existingParty.partyId === newParty.partyId
                    );

                    if (!partyExists) {
                      retryDoc.parties.push(newParty);
                    }
                  });
                }

                // Process payments
                if (
                  response.data.data.payments &&
                  Array.isArray(response.data.data.payments)
                ) {
                  if (!retryDoc.payments) retryDoc.payments = [];

                  response.data.data.payments.forEach((newPayment) => {
                    const paymentExists = retryDoc.payments.some(
                      (existingPayment) =>
                        existingPayment.receiptNo === newPayment.receiptNo
                    );

                    if (!paymentExists) {
                      retryDoc.payments.push(newPayment);
                    }
                  });
                }

                // Process remaining fields
                const retryRemainingFields = [
                  "products",
                  "scheduleddeliveries",
                  "settings",
                  "transactions",
                  // "users",
                ];

                retryRemainingFields.forEach((field) => {
                  if (
                    response.data.data[field] &&
                    Array.isArray(response.data.data[field])
                  ) {
                    if (!retryDoc[field]) retryDoc[field] = [];

                    response.data.data[field].forEach((newItem) => {
                      const itemExists = retryDoc[field].some(
                        (existingItem) =>
                          JSON.stringify(existingItem) ===
                          JSON.stringify(newItem)
                      );

                      if (!itemExists) {
                        retryDoc[field].push(newItem);
                      }
                    });
                  }
                });

                // Try to save again with latest version
                await db.put(retryDoc);
                toast.success("Data synced successfully!");
                navigate("/");
                window.location.reload();
              } catch (retryError) {
                toast.error(
                  "Unable to update data after multiple attempts. Please try again later."
                );
                console.error("Retry error:", retryError);
              }
            } else {
              toast.error("Error saving user data. Please try again.");
              console.error("Error saving document:", putError);
            }
          }
        } catch (docError) {
          console.log(docError, "This is the Doc Error");
          if (docError.name === "not_found") {
            try {
              // First get the document to obtain its current revision
              const doc = await db.get("7224098370");

              // Then delete the document using its _id and _rev
              const result = await db.remove(doc);

              console.log("Document successfully deleted:", result);
              toast.success("Document successfully deleted");
              return result;
            } catch (error) {
              console.error("Error deleting document:", error);

              if (error.name === "not_found") {
                toast.error("Document not found");
              } else {
                toast.error("Error deleting document: " + error.message);
              }

              throw error;
            }
            try {
              const newDoc = {
                _id: formData.phone,
                ...response.data.data,
                isSyncEnabled: true,
              };
              console.log(newDoc);
              await db.put(newDoc);

              toast.success("Login successful!");
              navigate("/");
              window.location.reload();
            } catch (putError) {
              toast.error("Error saving user data. Please try again.");
              console.error("Error saving new document:", putError);
            }
          } else {
            toast.error("Error retrieving existing data. Please try again.");
            console.error("Error getting document:", docError);
          }
        }
      } catch (error) {
        toast.error("Error fetching user data. Please try again.");
        console.error("API error:", error);
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="flex-1 bg-gradient-to-r from-[#CD4735] to-[#F9AC40] text-white flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-4xl font-semibold mb-6">Welcome back!</h1>
        <p className="mb-6">Manage your finances with ease</p>
        <Link to="/signup">
          <button className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl text-[#F15338] font-semibold mb-6">
          Sign In to Your Account
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-[300px] mb-6">
          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
                maxLength={6}
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
              />
            </div>
          )}

          <button
            className={`bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg flex items-center justify-center ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
            onClick={otpSent ? handlePhoneLogin : handleCheckPhone}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : otpSent ? (
              "Verify & Login"
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
