import React, { useState } from "react";
import {
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleField, updateCustomFields } from "../../Redux/itemSlice";
import { useDispatch, useSelector } from "react-redux";
const ItemSettings = () => {
  const { enabledFields, customFields } = useSelector((state) => state.item);
  const [activeTab, setActiveTab] = useState("itemSettings");
  const dispatch = useDispatch();
  const [isCustomFieldsDialogOpen, setIsCustomFieldsDialogOpen] =
    useState(false);

  const handleFieldToggle = (fieldId) => {
    dispatch(toggleField(fieldId));
  };

  const handleAdditionalFieldToggle = (fieldId) => {
    dispatch(toggleField(fieldId));
  };

  const sidebarItems = [
    { id: "general", label: "GENERAL" },
    { id: "transaction", label: "TRANSACTION" },
    { id: "print", label: "PRINT" },
    { id: "taxes", label: "TAXES & GST" },
    { id: "transactionMessage", label: "TRANSACTION MESSAGE" },
    { id: "party", label: "PARTY" },
    { id: "item", label: "ITEM" },
    { id: "serviceReminders", label: "SERVICE REMINDERS" },
  ];

  const tabs = [
    { id: "itemSettings", label: "Item Settings" },
    { id: "additionalFields", label: "Additional Item Fields" },
    { id: "customFields2", label: "Item Custom Fields" },
  ];

  const [customFields2, setCustomFields2] = useState([
    { id: 1, name: "Colosdfur", showInPrint: true },
    { id: 2, name: "Material", showInPrint: true },
    { id: 3, name: "Mfg. Date", showInPrint: true },
    { id: 4, name: "E.g: Exp. Date", showInPrint: false },
    { id: 5, name: "E.g: Size", showInPrint: false },
    { id: 6, name: "E.g: Brand", showInPrint: false },
  ]);
  return (
    <div className="flex-1 p-8">
      <div className="flex space-x-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-4 px-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "customFields2" && (
              <Info className="inline-block ml-2" size={16} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {/* Item Settings Content */}
        {activeTab === "itemSettings" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableItem"
                className="h-4 w-4"
                onChange={() => handleFieldToggle("enableItem")}
                checked={enabledFields.enableItem}
              />
              <span>Enable Item</span>
              <Info className="text-gray-400" size={16} />
            </div>

            <div>
              <label className="block mb-2">
                What do you sell?
                <Info className="inline-block ml-2 text-gray-400" size={16} />
              </label>
              <select
                id="sellType"
                className="w-full p-2 border rounded"
                onChange={(e) => handleFieldToggle("sellType")}
              >
                <option>Product/Service</option>
                <option>Product</option>
                <option>Service</option>
              </select>
            </div>

            <div className="space-y-4">
              {[
                { id: "barcode", label: "Barcode Scan" },
                { id: "mrp", label: "MRP" },
                { id: "serialNo", label: "Serial No." },
                { id: "batchNo", label: "Batch No." },
                { id: "expDate", label: "Exp. Date" },
                { id: "mfgDate", label: "Mfg. Date" },
                { id: "modelNo", label: "Model No." },
                { id: "size", label: "Size" },
                { id: "stock", label: "Stock" },
                { id: "description", label: "Description" },
              ].map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={field.id}
                    className="h-4 w-4"
                    checked={enabledFields[field.id]}
                    onChange={() => handleFieldToggle(field.id)}
                  />
                  <span>{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Fields Content */}
        {activeTab === "additionalFields" && (
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="mb-4 font-medium">MRP/Price</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mrpEnabled"
                  className="h-4 w-4"
                  onChange={() => handleAdditionalFieldToggle("mrpEnabled")}
                  checked={enabledFields.mrpEnabled}
                />
                <span>MRP</span>
                <Info className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                placeholder="MRP"
                id="mrpValue"
                onChange={() => handleAdditionalFieldToggle("mrpValue")}
                className="mt-2 w-48 p-2 border rounded"
              />
            </div>

            <div>
              <h3 className="mb-4 font-medium">Serial No. Tracking</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="serialNoEnabled"
                  className="h-4 w-4"
                  onChange={() =>
                    handleAdditionalFieldToggle("serialNoEnabled")
                  }
                  checked={enabledFields.serialNoEnabled}
                />
                <span>Serial No./ IMEI No. etc</span>
                <Info className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                id="serialNoValue"
                onChange={() => handleAdditionalFieldToggle("serialNoValue")}
                placeholder="Serial No."
                className="mt-2 w-48 p-2 border rounded"
              />
            </div>

            <div>
              <h3 className="mb-4 font-medium">Batch Tracking</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="batchNoEnabled"
                      className="h-4 w-4"
                      onChange={() =>
                        handleAdditionalFieldToggle("batchNoEnabled")
                      }
                      checked={enabledFields.batchNoEnabled}
                    />
                    <span>Batch No.</span>
                  </div>
                  <input
                    type="text"
                    id="batchNoValue"
                    placeholder="Batch No."
                    onChange={() => handleAdditionalFieldToggle("batchNoValue")}
                    className="mt-2 w-48 p-2 border rounded"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="expDateEnabled"
                      className="h-4 w-4"
                      onChange={() =>
                        handleAdditionalFieldToggle("expDateEnabled")
                      }
                      checked={enabledFields.expDateEnabled}
                    />
                    <span>Exp. Date</span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <select
                      id="expDateFormat"
                      className="p-2 border rounded"
                      onChange={() =>
                        handleAdditionalFieldToggle("expDateFormat")
                      }
                    >
                      <option>mm/yy</option>
                    </select>
                    <input
                      type="text"
                      id="expDateValue"
                      placeholder="Exp. Date"
                      onChange={() =>
                        handleAdditionalFieldToggle("expDateValue")
                      }
                      className="w-48 p-2 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mfgDateEnabled"
                      className="h-4 w-4"
                      onChange={() =>
                        handleAdditionalFieldToggle("mfgDateEnabled")
                      }
                      checked={enabledFields.mfgDateEnabled}
                    />
                    <span>Mfg. Date</span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <select
                      id="mfgDateFormat"
                      className="p-2 border rounded"
                      onChange={() =>
                        handleAdditionalFieldToggle("mfgDateFormat")
                      }
                    >
                      <option>dd/mm/yy</option>
                    </select>
                    <input
                      type="text"
                      id="mfgDateValue"
                      placeholder="Mfg. Date"
                      onChange={() =>
                        handleAdditionalFieldToggle("mfgDateValue")
                      }
                      className="w-48 p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Additional Fields</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="modelNoEnabled"
                      className="h-4 w-4"
                      onChange={() =>
                        handleAdditionalFieldToggle("modelNoEnabled")
                      }
                      checked={enabledFields.modelNoEnabled}
                    />
                    <span>Model No.</span>
                  </div>
                  <input
                    type="text"
                    id="modelNoValue"
                    placeholder="Model No."
                    onChange={() => handleAdditionalFieldToggle("modelNoValue")}
                    className="mt-2 w-48 p-2 border rounded"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sizeEnabled"
                      className="h-4 w-4"
                      onChange={() =>
                        handleAdditionalFieldToggle("sizeEnabled")
                      }
                      checked={enabledFields.sizeEnabled}
                    />
                    <span>Size</span>
                  </div>
                  <input
                    type="text"
                    id="sizeValue"
                    placeholder="Size"
                    onChange={() => handleAdditionalFieldToggle("sizeValue")}
                    className="mt-2 w-48 p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Fields Content */}
        {activeTab === "customFields2" && (
          <div className="mt-8">
            <button
              onClick={() => setIsCustomFieldsDialogOpen(true)}
              className="px-4 py-2 text-blue-500 hover:text-blue-600"
            >
              Add Custom Fields &gt;
            </button>
          </div>
        )}
      </div>

      {/* Custom Fields Dialog */}
      {isCustomFieldsDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Add Custom Fields</h2>
              <button onClick={() => setIsCustomFieldsDialogOpen(false)}>
                {/* <X size={20} /> */}
              </button>
            </div>

            <div className="space-y-6">
              {customFields2.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Custom Field {index + 1}
                    {index < 2 ? "*" : ""}
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id={`customField${field.id}Enabled`}
                      className="h-4 w-4"
                      checked={field.showInPrint}
                      onChange={(e) => {
                        const newFields = [...customFields2];
                        newFields[index].showInPrint = e.target.checked;
                        setCustomFields2(newFields);
                      }}
                    />
                    <input
                      type="text"
                      id={`customField${field.id}Name`}
                      className="flex-1 p-2 border rounded"
                      value={field.name}
                      onChange={(e) => {
                        const newFields = [...customFields2];
                        newFields[index].name = e.target.value;
                        setCustomFields2(newFields);
                        dispatch(updateCustomFields(newFields));
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`customField${field.id}Print`}
                        className="h-4 w-4"
                        checked={field.showInPrint}
                        onChange={(e) => {
                          const newFields = [...customFields2];
                          newFields[index].showInPrint = e.target.checked;
                          setCustomFields2(newFields);
                          dispatch(updateCustomFields(newFields));
                        }}
                      />
                      <span className="text-sm">Show in print</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsCustomFieldsDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(updateCustomFields(customFields2));
                  setIsCustomFieldsDialogOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSettings;
