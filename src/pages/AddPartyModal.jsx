import React, { useEffect, useState } from "react";
import { Settings2, X, Plus } from "lucide-react";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

const TabPanel = ({ children, value, index }) => (
  <div
    hidden={value !== index}
    className="h-[calc(100vh-280px)] overflow-y-auto px-4"
  >
    {value === index && children}
  </div>
);

const AddPartyModal = ({
  isOpen,
  handleParty,
  isEdit,
  handleClose,
  currentParty,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    partyName: "",
    partyPhone: "",
    partyGSTIN: "",
    gstType: "UnRegistered/Consumer",
    partyState: "",
    partyEmail: "",
    billingAddress: "",
    shippingAddress: "",
    shippingEnabled: false,
    openingBalance: "",
    balanceType: "to-receive",
    creditLimit: "no-limit",
    customLimit: "",
    partyGroup: "",
    asOfDate: new Date().toISOString().split("T")[0],
    partyType: "Customer",
    partyImage: null,
    additionalFields: [
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
        type: "text",
      },
      {
        enabled: false,
        fieldName: "",
        showInPrint: false,
        type: "date",
      },
    ],
  });

  const [allPartySettings, setAllPartySettings] = useState({});
  const [phone, setPhone] = useState(null);
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
    const fetchPartySettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newPartySettings = existingDoc?.settings?.filter(
          (setting) => setting.name === "partySettings"
        )[0]?.data;
        setAllPartySettings(newPartySettings);
      }
    };
    fetchPartySettings();
  }, [phone]);

  // Populate form data when editing
  useEffect(() => {
    console.log(
      isEdit,
      currentParty,
      "This is the new party settings for the new party"
    );
    if (isEdit && currentParty) {
      // Ensure additionalFields has the correct structure
      const formattedAdditionalFields = Array.isArray(
        currentParty.additionalFields
      )
        ? currentParty.additionalFields
        : formData.additionalFields;

      setFormData({
        ...formData,
        ...currentParty,
        additionalFields: formattedAdditionalFields.map((field, index) => ({
          enabled: field.enabled || false,
          fieldName: field.fieldName || "",
          showInPrint: field.showInPrint || false,
          type: field.type || (index === 3 ? "date" : "text"),
        })),
        // Ensure all required fields have default values if not present in currentParty
        partyGroup: currentParty.partyGroup || "",
        gstType: currentParty.gstType || "UnRegistered/Consumer",
        balanceType: currentParty.balanceType || "to-receive",
        creditLimit: currentParty.creditLimit || "no-limit",
        partyType: currentParty.partyType || "Customer",
        asOfDate:
          currentParty.asOfDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        partyName: "",
        partyPhone: "",
        partyGSTIN: "",
        gstType: "UnRegistered/Consumer",
        partyState: "",
        partyEmail: "",
        billingAddress: "",
        shippingAddress: "",
        shippingEnabled: false,
        openingBalance: "",
        balanceType: "to-receive",
        creditLimit: "no-limit",
        customLimit: "",
        partyGroup: "",
        asOfDate: new Date().toISOString().split("T")[0],
        partyType: "Customer",
        partyImage: null,
        additionalFields: [
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "date" },
        ],
      });
    }
  }, [isOpen, isEdit, currentParty]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({
      ...prev,
      partyImage: files[0],
    }));
  };

  const handleAdditionalFieldChange = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: prev.additionalFields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      partyName: formData.partyName,
      partyId:
        currentParty?.partyId ||
        `#${Math.floor(100000 + Math.random() * 900000)}`, // Unique ID
      partyPhone: formData.partyPhone,
      partyGSTIN: formData.partyGSTIN,
      gstType: formData.gstType,
      partyState: formData.partyState,
      partyEmail: formData.partyEmail,
      billingAddress: formData.billingAddress,
      shippingAddress: formData.shippingAddress,
      shippingEnabled: formData.shippingEnabled,
      openingBalance: formData.openingBalance,
      balanceType: formData.balanceType,
      creditLimit: formData.creditLimit,
      customLimit: formData.customLimit,
      partyGroup: formData.partyGroup,
      asOfDate: formData.asOfDate,
      partyType: formData.partyType,
      partyImage: formData.partyImage,
      additionalFields: formData.additionalFields || [],
      transactions: [
        {
          type:
            formData.balanceType === "to-receive"
              ? "Receivable Opening Balance"
              : "Returnable Opening Balance",
          number: "",
          date: new Date().toLocaleDateString("en-GB"),
          total: formData.openingBalance,
          balance: formData.openingBalance,
          paid: 0,
        },
      ],
    };

    try {
      let existingDoc = await db.get(phone).catch(() => null);

      if (existingDoc) {
        // Remove duplicate parties with same name (optional, but keeping it for safety)
        let updatedParties = existingDoc.parties.filter(
          (party) => party.partyName !== formData.partyName
        );

        if (isEdit) {
          // Party ko `partyId` ke basis par dhundho aur usko update karo
          updatedParties = existingDoc.parties.map((party) =>
            party.partyId === currentParty.partyId
              ? { ...party, ...dataToSend }
              : party
          );
        } else {
          // Ensure the party is not already present
          const isDuplicate = existingDoc.parties.some(
            (party) => party.partyName === formData.partyName
          );

          if (!isDuplicate) {
            updatedParties.push(dataToSend);
          }
        }

        // Update the database with modified parties array
        await db.put({
          ...existingDoc,
          parties: updatedParties,
        });
      } else {
        // If no document exists, create a new one
        await db.put({
          _id: phone,
          parties: [dataToSend],
        });
      }

      // Form Reset
      setFormData({
        partyName: "",
        partyPhone: "",
        partyGSTIN: "",
        gstType: "UnRegistered/Consumer",
        partyState: "",
        partyEmail: "",
        billingAddress: "",
        shippingAddress: "",
        shippingEnabled: false,
        openingBalance: "",
        balanceType: "to-receive",
        creditLimit: "no-limit",
        customLimit: "",
        partyGroup: "",
        asOfDate: new Date().toISOString().split("T")[0],
        partyType: "Customer",
        partyImage: null,
        additionalFields: [
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "text" },
          { enabled: false, fieldName: "", showInPrint: false, type: "date" },
        ],
      });

      handleClose();
      console.log("Party successfully saved to PouchDB:", dataToSend);
    } catch (error) {
      console.error("Error saving party to PouchDB:", error);
    }
  };

  // State for groups
  const [groups, setGroups] = useState(["General"]);
  const [newGroup, setNewGroup] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartyNameUnique, setIsPartyNameUnique] = useState(true);

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (newGroup.trim()) {
      setGroups((prev) => [...prev, newGroup.trim()]);
      setFormData((prev) => ({
        ...prev,
        partyGroup: newGroup.trim(),
      }));
      setNewGroup("");
      setIsModalOpen(false);
    }
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

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ${
        isOpen || isEdit ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden shadow-xl">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center gap-2">
            {isEdit ? "Edit Party" : "Add Party"}
            <button className="text-gray-500">
              <Settings2 size={18} />
            </button>
          </div>
          <button onClick={handleClose} className="text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handleInputChange}
                onBlur={() => handleVerifyPartyName(formData.partyName)}
                placeholder="Party Name *"
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Show error message if isUnique is false */}
              {!isPartyNameUnique && (
                <span className="text-red-500 text-xs mt-1 block">
                  Party name already exists
                </span>
              )}
            </div>
            <input
              type="text"
              name="partyGSTIN"
              value={formData.partyGSTIN}
              onChange={handleInputChange}
              placeholder="GSTIN"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="partyPhone"
              value={formData.partyPhone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="partyType"
              value={formData.partyType}
              onChange={handleInputChange}
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>

            {allPartySettings?.partyGrouping && (
              <div className="relative">
                <div
                  className="w-full border p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex justify-between items-center">
                    <span>{formData.partyGroup || "Select Party Group"}</span>
                    <Plus
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                    <div
                      className="p-2 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <span className="text-gray-500 hover:text-gray-700">
                        + Add New Group
                      </span>
                    </div>
                    {groups.map((group, index) => (
                      <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            partyGroup: group,
                          }));
                          setIsDropdownOpen(false);
                        }}
                      >
                        {group}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal for adding new group */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Group</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddGroup}>
                <input
                  type="text"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full border p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab(0)}
              className={`py-2 px-4 ${
                activeTab === 0 ? "border-b-2 border-blue-500" : ""
              }`}
            >
              GST & Address
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`py-2 px-4 ${
                activeTab === 1 ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Credit & Balance
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`py-2 px-4 ${
                activeTab === 2 ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Additional Fields
            </button>
          </div>
        </div>

        <div className="p-0">
          <TabPanel value={activeTab} index={0}>
            <div className="space-y-4">
              <select
                name="gstType"
                value={formData.gstType}
                onChange={handleInputChange}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UnRegistered/Consumer">
                  Unregistered/Consumer
                </option>
                <option value="Regular">Registered Business - Regular</option>
                <option value="Composition">
                  Unregistered Business - Composition
                </option>
              </select>

              <select
                name="partyState"
                value={formData.partyState}
                onChange={handleInputChange}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="gujarat">Gujarat</option>
                <option value="karnataka">Karnataka</option>
              </select>

              <input
                type="email"
                name="partyEmail"
                value={formData.partyEmail}
                onChange={handleInputChange}
                placeholder="Email ID"
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                placeholder="Billing Address"
                rows="4"
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              {allPartySettings?.shippingAddress && (
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Shipping Address"
                  rows="4"
                  className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              )}
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div className="space-y-4">
              <input
                type="text"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleInputChange}
                placeholder="Opening Balance"
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="balanceType"
                    value="to-pay"
                    checked={formData.balanceType === "to-pay"}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <label className="text-sm">To Pay</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="balanceType"
                    value="to-receive"
                    checked={formData.balanceType === "to-receive"}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <label className="text-sm">To Receive</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Credit Limit</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.creditLimit === "no-limit"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        creditLimit:
                          prev.creditLimit === "no-limit"
                            ? "custom"
                            : "no-limit",
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <span>No Limit</span>
                </div>
                {formData.creditLimit !== "no-limit" && (
                  <input
                    type="number"
                    name="customLimit"
                    value={formData.customLimit}
                    onChange={handleInputChange}
                    placeholder="Enter custom limit"
                    className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <input
                type="date"
                name="asOfDate"
                value={formData.asOfDate}
                onChange={handleInputChange}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <h2 className="text-lg font-semibold">Additional Fields</h2>
              </div>

              <div className="space-y-6">
                {formData.additionalFields.map((field, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={field.enabled}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "enabled",
                            e.target.checked
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder={`Additional Field ${index + 1}`}
                        className={`flex-1 px-3 py-2 border rounded text-sm ${
                          !field.enabled
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white"
                        }`}
                        value={field.fieldName}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "fieldName",
                            e.target.value
                          )
                        }
                        disabled={!field.enabled}
                      />
                      {field.type === "date" && (
                        <button
                          className={`px-3 py-2 border rounded text-sm flex items-center space-x-1 ${
                            !field.enabled
                              ? "bg-gray-100 text-gray-400"
                              : "text-gray-600"
                          }`}
                          disabled={!field.enabled}
                        >
                          <span>dd/mm/yy</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-8">
                      <button
                        className={`relative w-11 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          field.showInPrint ? "bg-blue-500" : "bg-gray-200"
                        } ${
                          !field.enabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() =>
                          field.enabled &&
                          handleAdditionalFieldChange(
                            index,
                            "showInPrint",
                            !field.showInPrint
                          )
                        }
                        disabled={!field.enabled}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${
                            field.showInPrint
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-sm ${
                          !field.enabled ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Show In Print
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            disabled={!isPartyNameUnique}
            className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPartyModal;
