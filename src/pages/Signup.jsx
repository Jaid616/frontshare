import React, { useState } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaEnvelope,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../Redux/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import axios from "axios";
import { serviceUrl } from "../Services/url";
import { COUNTRIES_DATA } from "./countryData";
import db from "../config/dbConfig";
import * as jose from "jose";

// Define VAT countries
const VAT_COUNTRIES = [
  "UAE",
  "OMAN",
  "BAHRAIN",
  "SAUDI ARABIA",
  "KUWAIT",
  "QATAR",
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    otp: "",
    role: "Customer",
    generatedOTP: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();
  async function generateToken(payload, secret) {
    const secretEncoder = new TextEncoder().encode(secret);
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secretEncoder);
    return jwt;
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const { name, phone, email } = formData;

    if (!name.trim()) {
      toast.error("Please enter your business name");
      return;
    }
    if (!phone.trim() || !/^\+?\d{10,}$/.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if internet is enabled
    if (!navigator.onLine) {
      toast.error(
        "Internet connection is required to send OTP. Please enable your internet connection and try again."
      );
      return;
    }

    setIsLoading(true);
    try {
      const generatedOTP = generateOTP();
      setFormData({ ...formData, generatedOTP });
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(
        signup({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
        })
      ).unwrap();

      let existingDoc;
      try {
        existingDoc = await db.get(formData.phone);
      } catch (err) {
        if (err.status === 404) {
          existingDoc = null; // Document doesn't exist
        } else {
          throw err; // Other errors should be handled separately
        }
      }

      if (!existingDoc) {
        // Create a new document with empty arrays for each collection
        const newDoc = {
          _id: formData.phone,
          users: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            role: formData.role,
            country: "", // Will be updated later
            currency: "",
            currencyCode: "",
            currencySymbol: "",
            hasVAT: false,
            taxRates: [],
          },
        };

        // Initialize empty arrays for collections
        const collections = [
          "banks",
          "bills",
          "carts",
          "categories",
          "conversions",
          "expenseCategories",
          "expenseItems",
          "expenses",
          "items",
          "journalEntries",
          "orders",
          "parties",
          "payments",
          "products",
          "schedules",
          "settings",
        ];

        collections.forEach((collection) => {
          newDoc[collection] = [];
        });

        await db.put(newDoc); // Save document in database
      }

      setShowCountryModal(true);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid OTP. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const countryData = COUNTRIES_DATA.find((c) => c.name === countryName);
    setSelectedCountry(countryName);
    setSelectedCountryData(countryData);
  };

  const handleCountrySelection = async () => {
    if (!selectedCountryData) {
      toast.error("Please select a country.");
      return;
    }

    try {
      // 📌 Fetch user document from PouchDB
      const userData = await db.get(formData.phone);

      // 📌 India's complete tax structure including 0% and Exempted
      const indiaTaxRates = [
        { id: 1, name: "GST (CGST)", rate: "9%" },
        { id: 2, name: "GST (SGST)", rate: "9%" },
        { id: 3, name: "GST (IGST)", rate: "18%" },
        { id: 4, name: "GST (UTGST)", rate: "9%" },
        { id: 5, name: "GST (5%)", rate: "5%" },
        { id: 6, name: "GST (12%)", rate: "12%" },
        { id: 7, name: "GST (18%)", rate: "18%" },
        { id: 8, name: "GST (28%)", rate: "28%" },
        { id: 9, name: "GST (0%)", rate: "0%" },
        { id: 10, name: "GST (Exempted)", rate: "0%" },
      ];

      // 📌 VAT Tax Rates for Gulf Countries
      const vatRates = {
        UAE: [{ id: 11, name: "VAT", rate: "5%" }],
        Oman: [{ id: 12, name: "VAT", rate: "5%" }],
        Bahrain: [{ id: 13, name: "VAT", rate: "10%" }],
        "Saudi Arabia": [{ id: 14, name: "VAT", rate: "15%" }],
        Kuwait: [{ id: 15, name: "VAT", rate: "0%" }], // NIL VAT
        Qatar: [{ id: 16, name: "VAT", rate: "0%" }], // NIL VAT
      };

      // 📌 Set tax rates based on selected country
      let selectedTaxRates = [];
      let hasVAT = false;

      if (selectedCountryData.name === "India") {
        selectedTaxRates = indiaTaxRates;
      } else if (vatRates[selectedCountryData.name]) {
        selectedTaxRates = vatRates[selectedCountryData.name];
        hasVAT = true;
      }

      // 📌 Update users object with country data
      userData.users = {
        ...userData.users,
        country: selectedCountryData.name,
        currency: selectedCountryData.currency,
        currencyCode: selectedCountryData.currencyCode,
        currencySymbol: selectedCountryData.symbol,
        hasVAT: hasVAT,
        taxRates: selectedTaxRates,
      };

      // 📌 Find the taxSettings in settings array
      const taxSettingsIndex = userData.settings.findIndex(
        (setting) => setting.name === "taxSettings"
      );

      // 📌 Create taxSettings object
      const newTaxSettings = {
        name: "taxSettings",
        taxRates: selectedTaxRates,
        taxGroups: [],
        gstEnabled: selectedCountryData.name === "India",
        hsnEnabled: selectedCountryData.name === "India",
        additionalCess: false,
        reverseCharge: false,
        placeOfSupply: false,
        compositeScheme: false,
        tcsEnabled: false,
        tdsEnabled: false,
      };

      await axios.post(`${serviceUrl}/auth/saveUserDetails`, {phone: formData.phone, country: selectedCountryData.name,
        currency: selectedCountryData.currency,
        currencyCode: selectedCountryData.currencyCode,
        currencySymbol: selectedCountryData.symbol,
        hasVAT: hasVAT,
        taxRates: selectedTaxRates})
      if (taxSettingsIndex !== -1) {
        userData.settings[taxSettingsIndex] = newTaxSettings;
      } else {
        userData.settings.push(newTaxSettings);
      }

      // 📌 Save updated user data to PouchDB
      await db.put(userData);

      toast.success("Country data saved successfully!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error saving country data:", error);
      toast.error("Failed to save country data. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gradient-to-r from-[#CD4735] to-[#F9AC40] text-white flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-4xl font-semibold mb-6">Get started today!</h1>
        <p className="mb-6">
          Simplify your accounting, billing, and business growth today!
        </p>
        <Link to="/login">
          <button className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg">
            Log In
          </button>
        </Link>
      </div>

      <div className="flex-1 bg-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl text-[#F15338] font-semibold mb-6">
          Create Your Account
        </h1>
        <p className="mb-6">Enter your details for verification</p>

        <div className="flex flex-col gap-4 w-full max-w-[300px] mb-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Business Name"
              className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={otpSent}
            />
          </div>

          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              placeholder="Phone Number (+1234567890)"
              className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={otpSent}
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              className="p-3 pl-10 rounded-lg bg-gray-200 text-lg w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
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
                value={formData.generatedOTP}
              />
            </div>
          )}

          <button
            className={`bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg flex items-center justify-center ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
            onClick={otpSent ? handlePhoneSignup : handleSendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : otpSent ? (
              "Verify & Sign Up"
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </div>

      <Modal
        isOpen={showCountryModal}
        onRequestClose={() => setShowCountryModal(false)}
        className="bg-white shadow-md rounded-lg w-full max-w-md mx-auto p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">Select Your Country</h2>
        <div className="mb-4">
          <label htmlFor="country" className="text-gray-700 font-medium mb-2">
            Country
          </label>
          <select
            id="country"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
            value={selectedCountry || ""}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            {COUNTRIES_DATA.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name} ({country.currency} - {country.symbol})
              </option>
            ))}
          </select>
          {selectedCountryData && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Currency: {selectedCountryData.currency} (
                {selectedCountryData.symbol})
              </p>
              <p className="text-sm text-gray-600">
                Tax Type: {selectedCountryData.tax.type}
              </p>
              <p className="text-sm text-gray-600">
                Tax Rate: {selectedCountryData.tax.rate}%
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-2 px-6 rounded-lg cursor-pointer"
            onClick={handleCountrySelection}
          >
            Proceed
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SignUp;
