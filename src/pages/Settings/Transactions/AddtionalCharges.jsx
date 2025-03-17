import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { serviceUrl } from "../../../Services/url";
import { getTransactionSettings } from "../../../Redux/settingsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { decodeToken } from "../../../DecodeToken";
import db from "../../../config/dbConfig";

const AdditionalCharges = ({ onClose }) => {
  // Default charges structure
  const defaultCharges = {
    shipping: {
      enabled: false,
      name: "Shipping",
      sac: "",
      tax: "NONE",
      enableTax: false,
    },
    packaging: {
      enabled: false,
      name: "Packaging",
      sac: "",
      tax: "NONE",
      enableTax: false,
    },
    adjustment: {
      enabled: false,
      name: "Adjustment",
      sac: "",
      tax: "NONE",
      enableTax: false,
    },
  };

  const [enabled, setEnabled] = useState(false);
  const [charges, setCharges] = useState(defaultCharges);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);
  const [allTransactionSettings, setAllTransactionSettings] = useState([]);

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

  const fetchTransactionSettings = async () => {
    if (phone) {
      const existingDoc = await db.get(phone);
      const newTransactionSettings = existingDoc?.settings?.filter(
        (setting) => setting.name === "transactionSettings"
      )[0]?.data;
      setAllTransactionSettings(newTransactionSettings);
    }
  };

  useEffect(() => {
    fetchTransactionSettings();
  }, [phone]);

  // Updated useEffect to handle both cases: with and without additionalCharges
  useEffect(() => {
    if (allTransactionSettings?.additionalCharges?.length > 0) {
      // Create a new charges object starting with default values
      const updatedCharges = { ...defaultCharges };

      // Get the mapping of our charge keys to their display names
      const chargeKeys = {
        shipping: "Additional Charge1*",
        packaging: "Additional Charge2*",
        adjustment: "Additional Charge3*",
      };

      // Update charges based on index position
      allTransactionSettings.additionalCharges.forEach((charge, index) => {
        // Get the corresponding key based on index
        const key = Object.keys(chargeKeys)[index];

        if (key && updatedCharges[key]) {
          updatedCharges[key] = {
            enabled: charge.enabled,
            name: charge.name,
            sac: charge.sac,
            tax: charge.tax,
            enableTax: charge.enableTax,
          };
        }
      });

      setCharges(updatedCharges);

      // Check if any charge is enabled to set the main toggle
      const hasEnabledCharge = Object.values(updatedCharges).some(
        (charge) => charge.enabled
      );
      setEnabled(hasEnabledCharge);
    } else {
      // If no additionalCharges, use default values
      setCharges(defaultCharges);
      setEnabled(false);
    }
  }, [allTransactionSettings]);

  const handleChargeChange = (key, field, value) => {
    setCharges({
      ...charges,
      [key]: {
        ...charges[key],
        [field]: value,
        enableTax:
          field === "enabled" && !value ? false : charges[key].enableTax,
      },
    });
  };

  const handleFieldClick = (key) => {
    if (enabled && charges[key].enabled) {
      handleChargeChange(key, "enableTax", true);
    }
  };

  const handleSaveDetails = async () => {
    const chargeValues = Object.values(charges);

    // Filter only enabled charges
    const filteredCharges = chargeValues
      .map((charge, index) => ({
        ...charge,
        index,
      }))
      .filter((charge) => charge.enabled);

    try {
      const response = await axios.post(
        `${serviceUrl}/settings/addAdditionalCharges`,
        {
          email: email,
          additionalCharges: filteredCharges,
        }
      );

      if (response.status === 200) {
        console.log("Details saved successfully", response.data);
        onClose;
      }
    } catch (error) {
      console.error("Error saving details", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-[0px]">
      <div className="bg-white w-full max-w-2xl shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b rounded-t-lg">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Additional Charges</h2>
            <button className="text-blue-600 rounded-full w-5 h-5 flex items-center justify-center border border-blue-600">
              <span className="sr-only">Info</span>ⓘ
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Main toggle */}
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <span className="text-sm">Enable Additional Charges</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => {
                  setEnabled(!enabled);
                  if (!enabled === false) {
                    setCharges((prevCharges) => {
                      const resetCharges = {};
                      Object.keys(prevCharges).forEach((key) => {
                        resetCharges[key] = {
                          ...prevCharges[key],
                          enabled: false,
                          enableTax: false,
                        };
                      });
                      return resetCharges;
                    });
                  }
                }}
                className="sr-only"
                id="toggle"
              />
              <label
                htmlFor="toggle"
                className={`block w-10 h-6 rounded-full transition-colors ${
                  enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 mt-1 ml-1 rounded-full bg-white transition-transform ${
                    enabled ? "transform translate-x-4" : ""
                  }`}
                />
              </label>
            </div>
          </div>

          {/* Charge inputs */}
          {Object.entries(charges).map(([key, charge], index) => (
            <div key={key} className="mb-6">
              <div
                className="grid grid-cols-12 gap-3 items-start"
                onClick={() => handleFieldClick(key)}
                style={{
                  cursor: enabled && charge.enabled ? "pointer" : "default",
                }}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={charge.enabled}
                    onChange={(e) =>
                      handleChargeChange(key, "enabled", e.target.checked)
                    }
                    disabled={!enabled}
                    className="w-4 h-4 border-gray-300"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs text-gray-600 mb-1">
                    Additional Charge{index + 1}*
                  </label>
                  <input
                    type="text"
                    value={charge.name}
                    onChange={(e) =>
                      handleChargeChange(key, "name", e.target.value)
                    }
                    disabled={!enabled || !charge.enabled}
                    className={`w-full px-2 py-1.5 border text-sm rounded-lg ${
                      !enabled || !charge.enabled
                        ? "bg-gray-50 border-gray-200"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter charge name"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs text-gray-600 mb-1">
                    Default SAC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={charge.sac}
                      onChange={(e) =>
                        handleChargeChange(key, "sac", e.target.value)
                      }
                      disabled={!enabled || !charge.enabled}
                      className={`w-full px-2 py-1.5 border text-sm pr-8 rounded-lg ${
                        !enabled || !charge.enabled
                          ? "bg-gray-50 border-gray-200"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter SAC"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                      disabled={!enabled || !charge.enabled}
                    >
                      🔍
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Can be changed during transaction
                  </p>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-600 mb-1">
                    Tax Rate
                  </label>
                  <select
                    value={charge.tax}
                    onChange={(e) =>
                      handleChargeChange(key, "tax", e.target.value)
                    }
                    disabled={!enabled || !charge.enabled}
                    className={`w-full px-2 py-1.5 border text-sm rounded-lg ${
                      !enabled || !charge.enabled
                        ? "bg-gray-50 border-gray-200"
                        : "border-gray-300"
                    }`}
                  >
                    <option>NONE</option>
                    <option>GST 18%</option>
                    <option>GST 12%</option>
                    <option>GST 5%</option>
                  </select>
                </div>
              </div>
              <div className="mt-1 ml-8">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={charge.enableTax}
                    onChange={(e) =>
                      handleChargeChange(key, "enableTax", e.target.checked)
                    }
                    disabled={!enabled || !charge.enabled}
                    className="w-4 h-4 border-gray-300"
                  />
                  <span className="text-xs">Enable tax for {charge.name}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button
            className={`py-2 text-sm transition-colors rounded-full w-[400px] flex justify-center m-auto ${
              enabled
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!enabled}
            onClick={handleSaveDetails}
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCharges;
