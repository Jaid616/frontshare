import React, { useState, useEffect } from "react";
import { serviceUrl } from "../../../Services/url";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getTransactionSettings } from "../../../Redux/settingsSlice";
import db from "../../../config/dbConfig";
import { decodeToken } from "../../../DecodeToken";

const TransportationDetails = ({
  transportDetails,
  setTransportDetails,
  setTransactionSettings,
}) => {
  const [fields, setFields] = useState({
    transportName: { value: "", error: "", enable: false, index: 0 },
    vehicleNumber: { value: "", error: "", enable: false, index: 1 },
    deliveryDate: { value: "", error: "", enable: false, index: 2 },
    deliveryLocation: { value: "", error: "", enable: false, index: 3 },
    field5: { value: "", error: "", enable: false, index: 4 },
    field6: { value: "", error: "", enable: false, index: 5 },
  });

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
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

  

  useEffect(() => {
    const fetchTransactionSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newTransactionSettings = existingDoc?.settings?.filter(
          (setting) => setting.name === "transactionSettings"
        )[0];
        console.log(newTransactionSettings, "transportationDetails")
        if (newTransactionSettings?.data) {
          setAllTransactionSettings(newTransactionSettings?.data);
          
          setFields(newTransactionSettings?.data?.transportationDetails)
        }
      }
    };
    fetchTransactionSettings();
  }, [phone]);
  useEffect(() => {
    const hasEnabledFieldWithValue = Object.values(fields).some(
      (field) => field.enable && field.value.trim() !== ""
    );
    setIsSubmitEnabled(hasEnabledFieldWithValue);
  }, [fields]);

  const handleInputChange = (fieldName, value) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: value.trim() === "" ? "This field is required" : "",
      },
    }));
  };

  useEffect(() => {
    if (allTransactionSettings?.transportationDetails) {
      console.log(allTransactionSettings, "This is s");
      setFields((prevFields) => {
        const updatedFields = { ...prevFields };

        allTransactionSettings.transportationDetails.forEach((field) => {
          const fieldIndex = field.index; // Ensure index is present in API response
          const fieldKey = Object.keys(prevFields).find(
            (key) => prevFields[key].index == fieldIndex
          );
          console.log(fieldKey, fieldIndex, prevFields, "This is field key");
          if (fieldKey) {
            updatedFields[fieldKey] = {
              ...prevFields[fieldKey],
              value: field.value || "",
              error: field.error || "",
              enable: field.enable ?? false, // Keep existing enable status
            };
          }
        });

        return updatedFields;
      });
    }
  }, [allTransactionSettings]);

  const handleCheckboxChange = (fieldName) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        enable: !prev[fieldName].enable,
        value: !prev[fieldName].enable ? prev[fieldName].value : "",
        error: !prev[fieldName].enable ? prev[fieldName].error : "",
      },
    }));
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newFields = { ...fields };

    Object.keys(fields).forEach((key) => {
      if (fields[key].enable && fields[key].value.trim() === "") {
        newFields[key] = { ...fields[key], error: "This field is required" };
        hasError = true;
      }
    });

    if (hasError) {
      setFields(newFields);
      return;
    }

    // Create array of objects with field properties for enable fields
    // Step 1: Sort fields by index
    const sortedFields = Object.values(fields).sort(
      (a, b) => a.index - b.index
    );

    // Step 2: Create an array with only values
    const valuesArray = sortedFields.map((field) => field);
    console.log(valuesArray);
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
    if (
      !transactionSettings.data ||
      typeof transactionSettings.data !== "object"
    ) {
      transactionSettings.data = {};
    }

    transactionSettings.data = {
      ...transactionSettings.data,
      transportationDetails: valuesArray,
    };
    setTransactionSettings((prev) => ({
      ...prev,
      transportationDetails: valuesArray,
    }));
    console.log(transactionSettings.data, "This is sisisisisisisisisisis");
    await db.put({ ...existingDoc });
    setTransportDetails(!transportDetails);
  };

  const handleCancel = () => {
    setTransportDetails(!transportDetails);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="bg-gray-100 px-4 py-3 rounded-t-lg border-b">
          <h2 className="text-lg font-medium text-gray-700">
            Transportation Details
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {Object.keys(fields).map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm">
                  Field {fields[key].index + 1}{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={fields[key].enable}
                  onChange={() => handleCheckboxChange(key)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <input
                  type="text"
                  // placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                  value={fields[key].value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  disabled={!fields[key].enable}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !fields[key].enable ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
                <div className="w-6 h-6 flex items-center">
                  {fields[key].error && (
                    <span className="text-red-500 text-xl">×</span>
                  )}
                </div>
              </div>
              {fields[key].error && (
                <p className="text-red-500 text-xs mt-1">{fields[key].error}</p>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={handleCancel} // Define this function to handle cancel behavior
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitEnabled
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportationDetails;
