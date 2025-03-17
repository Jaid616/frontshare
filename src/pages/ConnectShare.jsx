import React, { useState, useEffect } from "react";
import { Crown, Wifi, WifiOff, X, Loader } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import db from "../config/dbConfig";
import axios from "axios"; // Import axios for API calls
import { serviceUrl } from "../Services/url";

const ConnectShare = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currentStatus, setCurrentStatus] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPhoneNumber(decoded.phone);
        setEmail(decoded.email); // Extract email from token
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        let doc = await db.get("paper_bill1");
        setCurrentStatus(doc.isSyncEnabled);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        // Create doc if it doesn't exist
        try {
          await db.put({
            _id: "paper_bill1",
            isSyncEnabled: false,
          });
          setCurrentStatus(false);
        } catch (putError) {
          console.error("Error creating initial document:", putError.message);
        }
      }
    };

    fetchDbStatus();
  }, []);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners to update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkInternetConnection = () => {
    // Return the current online status
    return navigator.onLine;
  };

  const getAllDataFromPouchDB = async () => {
    try {
      const docsData = await db.get(phoneNumber);
      console.log(docsData, "This is the Docs Data");

      // Create a new object with the same structure as docsData
      const offlineData = {
        banks: [],
        bills: [],
        carts: [],
        categories: [],
        conversions: [],
        expenseitems: [],
        expensecategories: [],
        expenses: [],
        isSyncEnabled: docsData.isSyncEnabled || false,
        items: [],
        journalentries: [],
        orders: [],
        parties: [],
        payments: [],
        products: [],
        scheduleddeliveries: [],
        settings: [],
        transactions: [],
        units: {},
        users: [],
      };

      // Process each array in docsData and add phoneNumber to each object
      for (const key in docsData) {
        // Skip non-array properties and [[Prototype]]
        if (!Array.isArray(docsData[key]) || key === "[[Prototype]]") {
          continue;
        }

        // For each array, add phoneNumber to each object
        offlineData[key] = docsData[key].map((item) => {
          return { ...item, phoneNumber };
        });
      }

      return offlineData;
    } catch (error) {
      console.error("Error getting all data from PouchDB:", error);
      throw error;
    }
  };

  const syncDataWithServer = async () => {
    try {
      setSyncError(null);

      if (!phoneNumber || !email) {
        throw new Error("User information is missing. Please log in again.");
      }

      const offlineData = await getAllDataFromPouchDB();
      console.log(offlineData, "This is the Offline Data Collection");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await axios.post(`${serviceUrl}/backup/sync-share`, 
        {
          phoneNumber,
          email,
          offlineData,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const doc = await db.get(phoneNumber);
        const updatedDoc = {
          ...doc,
          isSyncEnabled: true,
        };
        await db.put(updatedDoc);
        setCurrentStatus(true);

        console.log("Sync successful:", response.data.message);
        console.log("Synced items count:", response.data.counts);
        return true;
      } else {
        throw new Error(
          response.data.error || "Unknown error occurred during sync"
        );
      }
    } catch (error) {
      console.error("Error syncing data with server:", error);
      setSyncError(error.message);
      return false;
    }
  };

  const changeStatus = async () => {
    // First check internet connectivity
    const internetAvailable = checkInternetConnection();

    if (!internetAvailable) {
      setShowDialog(true);
      return;
    }

    // Set syncing state to true to show the loading spinner
    setIsSyncing(true);

    try {
      // If already synced, disable sync
      if (currentStatus) {
        const doc = await db.get("paper_bill1");
        const updatedDoc = {
          ...doc,
          isSyncEnabled: false,
        };
        await db.put(updatedDoc);
        setCurrentStatus(false);
        setIsSyncing(false);
      } else {
        // Sync with server
        const success = await syncDataWithServer();

        if (!success) {
          // Show error message to user
          console.error("Sync failed. Please try again later.");
        }

        setIsSyncing(false);
      }
    } catch (error) {
      console.error("Error during sync process:", error.message);
      setSyncError(error.message);
      setIsSyncing(false);
    }
  };

  const checkAgain = () => {
    // Set checking state to true to show the loading spinner
    setIsChecking(true);

    // Add a small delay to simulate checking the connection
    setTimeout(() => {
      const internetAvailable = checkInternetConnection();

      setIsChecking(false);

      if (internetAvailable) {
        setShowDialog(false);
        // If internet is now available, proceed with the sync
        changeStatus();
      }
    }, 2000); // 2 second delay for checking animation
  };

  const slides = [
    {
      title: "Connect Multiple Devices",
      description:
        "Use your company in multiple devices and on the go by syncing it.",
      image: (
        <div className="relative w-64 h-64">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
                <div className="w-12 h-20 border-2 border-gray-700 rounded-xl bg-white">
                  <div className="flex space-x-1 justify-end p-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-32">
                <div className="w-48 h-32 border-2 border-gray-700 rounded-lg bg-white">
                  <div className="flex space-x-1 justify-end p-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="w-48 h-32 border-2 border-gray-700 rounded-lg bg-white">
                  <div className="flex space-x-1 justify-end p-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Give Access To Your Staff",
      description:
        "Share your company with your staff in a secure manner by assigning roles.",
      image: (
        <div className="w-64 h-64 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center">
              <div className="w-48 h-48 border-2 border-gray-700 rounded-lg bg-white p-4">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full mb-2"></div>
                    <div className="w-12 h-2 bg-gray-300 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
              <div className="ml-4 space-y-4">
                <div className="w-24 h-12 border-2 border-gray-700 rounded-lg bg-white">
                  <div className="flex items-center p-2 space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="w-12 h-2 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-12 border-2 border-gray-700 rounded-lg bg-white">
                  <div className="flex items-center p-2 space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-2 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-12 border-2 border-gray-700 rounded-lg bg-white">
                  <div className="flex items-center p-2 space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-2 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-8">
        <h1 className="text-xl font-semibold">Sync & Share</h1>
        <Crown className="w-5 h-5" />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="relative min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            {slides[currentSlide].image}

            <h2 className="text-2xl font-semibold mt-8 mb-2">
              {slides[currentSlide].title}
            </h2>

            <p className="text-gray-500 text-center mb-8">
              {slides[currentSlide].description}
            </p>

            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
              >
                ←
              </button>

              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-gray-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {syncError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {syncError}
          </div>
        )}

        <button
          className={`w-full ${
            currentStatus ? "bg-green-500" : "bg-red-500"
          } text-white rounded-lg py-3 mt-8 flex items-center justify-center`}
          onClick={changeStatus}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Syncing...
            </>
          ) : currentStatus ? (
            "Synced"
          ) : (
            "Sync"
          )}
        </button>

        <p className="text-gray-500 text-sm text-center mt-4">
          *You're logged in with {phoneNumber || "Unknown Number"}{" "}
          {email ? `(${email})` : ""}
        </p>
      </div>

      {/* Internet Connection Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  No Internet Connection
                </h3>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <WifiOff size={32} className="text-red-500" />
                </div>
                <p className="text-gray-600 text-center">
                  Your device is not connected to the internet. Please check
                  your connection and try again.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={checkAgain}
                  className="flex items-center justify-center bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-colors"
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Wifi size={18} className="mr-2" />
                      Check Again
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3">
              <p className="text-gray-500 text-sm text-center">
                Syncing requires an active internet connection
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectShare;
