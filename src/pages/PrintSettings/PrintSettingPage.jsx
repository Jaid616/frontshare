import React, { useState } from "react";
import TaxInvoice from "./TaxInvoice.jsx";
import Theme1 from "../../assets/Theme1.png";
import Theme2 from "../../assets/Theme2.png";
import Theme3 from "../../assets/Theme3.png";
import Theme4 from "../../assets/Theme4.png";
import ThermalPrinter from "./ThermalPrinting.jsx";
import DefaultThermalTheme from "./DefaultThermalTheme.jsx";

const PrintSettingPage = ({
  invoiceData,
  // setActiveTab,
  setInvoiceData,
  selectedTheme,
  setSelectedTheme,
  printerSettings,
  handlePrinterSettingsChange,
  companyInfo,
  handleCompanyInfoChange,
  itemTableSettings,
  handleItemTableSettingsChange,
  totalsAndTaxes,
  handleTotalsAndTaxesChange,
  footerSettings,
  handleFooterSettingsChange,
}) => {
  const [regularPrinterTab, setRegularPrinterTab] = useState("change-layout");
  const [currentTheme, setCurrentTheme] = useState(1);
  // State to store form data
  const [formData, setFormData] = useState({
    companyName: invoiceData.companyName,
    address: "",
    phoneNumber: invoiceData.phone,
    email: "",
    trnOnSale: "",
    makeRegularPrinterDefault: false,
    customerSignatureTitle: invoiceData.customerSignatureTitle,
  });

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue =
      type === "checkbox"
        ? checked
        : value === "true"
        ? true
        : value === "false"
        ? false
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    setInvoiceData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: parsedValue,
      };

      // Ensure at least one field remains true
      const isAnyTrue =
        updatedData.printOriginalForRecipient ||
        updatedData.printDuplicate ||
        updatedData.printTriplicate;

      if (!isAnyTrue) {
        // Revert the change if none are true
        return prevData;
      }

      return updatedData;
    });
  };

  // Handler for form submission
  const handleSubmit = () => {
    console.log("Form Data Submitted: ", formData);
    // Add API call or logic to save data here
  };
  const setActiveTab = (printerType) => {
    setInvoiceData((prevState) => ({
      ...prevState,
      printer: printerType, // Set the printer field to the clicked tab
    }));
  };

  return (
    <div className="flex justify-center items-start w-full">
      <div className="flex">
        <div
          className="bg-white shadow-md rounded-lg p-6 w-2/5 mr-1 h-[99vh] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <div className="flex border-b">
            <div
              className={`px-4 py-3 text-sm font-medium cursor-pointer ${
                invoiceData.printer === "regular-printer"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("regular-printer")}
            >
              Regular Printer
            </div>
            <div
              className={`px-4 py-3 text-sm font-medium cursor-pointer ${
                invoiceData.printer === "thermal-printer"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("thermal-printer")}
            >
              Thermal Printer
            </div>
          </div>

          <div className="p-4">
            {invoiceData.printer === "regular-printer" && (
              <div>
                <div className="flex border-b mt-4">
                  <div
                    className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                      regularPrinterTab === "change-layout"
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setRegularPrinterTab("change-layout")}
                  >
                    Change Layout
                  </div>
                  <div
                    className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                      regularPrinterTab === "change-colors"
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setRegularPrinterTab("change-colors")}
                  >
                    Change Colors
                  </div>
                </div>

                <div className="mt-4">
                  {regularPrinterTab === "change-layout" && (
                    <div>
                      <div className="flex justify-center gap-2 mt-6">
                        {[Theme1, Theme2, Theme3, Theme4].map(
                          (theme, index) => (
                            <div
                              key={index}
                              name="currentTheme"
                              className={`px-2 py-1 rounded cursor-pointer ${
                                currentTheme === index + 1 ? "bg-gray-200" : ""
                              }`}
                              onClick={() => {
                                setCurrentTheme(index + 1);
                                setInvoiceData((prevData) => ({
                                  ...prevData,
                                  currentTheme: index + 1,
                                }));
                              }}
                            >
                              <img
                                src={theme}
                                className="w-[120px] h-[80px]"
                                alt={`Theme ${index + 1}`}
                              />
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-4 space-y-4">
                        {[
                          { label: "Company Name", name: "companyName" },
                          { label: "Address", name: "address" },
                          { label: "Phone Number", name: "phone" },
                          { label: "Email", name: "email" },
                          { label: "TRN on Sale", name: "trnOnSale" },
                        ].map((field, index) => (
                          <div key={index} className="space-y-2">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium"
                            >
                              {field.label}
                            </label>
                            <input
                              type="text"
                              id={field.name}
                              name={field.name}
                              value={invoiceData[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.label}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                        ))}
                        <div className="mt-4">
                          <input
                            type="checkbox"
                            id="makeRegularPrinterDefault"
                            name="makeRegularPrinterDefault"
                            checked={formData.makeRegularPrinterDefault}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label
                            htmlFor="makeRegularPrinterDefault"
                            className="text-sm font-medium"
                          >
                            Make Regular Printer Default
                          </label>
                        </div>

                        {/* Paper Size Dropdown */}
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-[43px]">
                            <label
                              htmlFor="paperSize"
                              className="text-sm font-medium"
                            >
                              Paper Size
                            </label>

                            <label
                              htmlFor="orientation"
                              className="text-sm font-medium"
                            >
                              Orientation
                            </label>

                            <label
                              htmlFor="companyNameTextSize"
                              className="text-sm font-medium"
                            >
                              Company Name Text Size
                            </label>
                            <label
                              htmlFor="invoiceTextSize"
                              className="text-sm font-medium"
                            >
                              Invoice Text Size
                            </label>
                          </div>
                          <div className="flex flex-col items-start space-y-4">
                            <select
                              id="paperSize"
                              name="paperSize"
                              value={formData.paperSize}
                              onChange={handleInputChange}
                              className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                            >
                              <option value="A4">A4</option>
                              <option value="A3">A3</option>
                              <option value="Letter">Letter</option>
                            </select>

                            <select
                              id="orientation"
                              name="orientation"
                              value={formData.orientation}
                              onChange={handleInputChange}
                              className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                            >
                              <option value="portrait">Portrait</option>
                              <option value="landscape">Landscape</option>
                            </select>

                            <select
                              id="companyNameTextSize"
                              name="companyNameTextSize"
                              value={formData.companyNameTextSize}
                              onChange={handleInputChange}
                              className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>

                            <select
                              id="invoiceTextSize"
                              name="invoiceTextSize"
                              value={formData.invoiceTextSize}
                              onChange={handleInputChange}
                              className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                            >
                              <option value="v-small">V. Small</option>
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <input
                            type="checkbox"
                            id="printOriginalDuplicate"
                            name="printOriginalDuplicate"
                            checked={invoiceData.printOriginalDuplicate}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <label
                            htmlFor="printOriginalDuplicate"
                            className="text-sm font-medium"
                          >
                            Print Original/Duplicate
                          </label>
                        </div>

                        {/* Dropdown Menus */}
                        {invoiceData.printOriginalDuplicate && (
                          <div className="flex justify-between">
                            {/* Editable Labels */}
                            <div className="flex flex-col gap-[43px]">
                              <input
                                type="text"
                                value={
                                  invoiceData.printOriginalForRecipientLabel ||
                                  "Print Original for Recipient"
                                }
                                onChange={(e) =>
                                  setInvoiceData((prev) => ({
                                    ...prev,
                                    printOriginalForRecipientLabel:
                                      e.target.value,
                                  }))
                                }
                                className="text-sm font-medium p-1 border border-gray-300 rounded w-full"
                                placeholder="Enter label"
                              />
                              <input
                                type="text"
                                value={
                                  invoiceData.printDuplicateLabel ||
                                  "Print Duplicate"
                                }
                                onChange={(e) =>
                                  setInvoiceData((prev) => ({
                                    ...prev,
                                    printDuplicateLabel: e.target.value,
                                  }))
                                }
                                className="text-sm font-medium p-1 border border-gray-300 rounded w-full"
                                placeholder="Enter label"
                              />
                              <input
                                type="text"
                                value={
                                  invoiceData.printTriplicateLabel ||
                                  "Print Triplicate"
                                }
                                onChange={(e) =>
                                  setInvoiceData((prev) => ({
                                    ...prev,
                                    printTriplicateLabel: e.target.value,
                                  }))
                                }
                                className="text-sm font-medium p-1 border border-gray-300 rounded w-full"
                                placeholder="Enter label"
                              />
                            </div>

                            {/* Select Options */}
                            <div className="flex flex-col items-start space-y-4">
                              <select
                                id="printOriginalForRecipient"
                                name="printOriginalForRecipient"
                                value={invoiceData.printOriginalForRecipient}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                                disabled={!invoiceData.printOriginalDuplicate}
                              >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </select>
                              <select
                                id="printDuplicate"
                                name="printDuplicate"
                                value={invoiceData.printDuplicate}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                                disabled={!invoiceData.printOriginalDuplicate}
                              >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </select>
                              <select
                                id="printTriplicate"
                                name="printTriplicate"
                                value={invoiceData.printTriplicate}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded block w-[112px] cursor-pointer"
                                disabled={!invoiceData.printOriginalDuplicate}
                              >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div>
                          <h1 className="text-sm font-bold border-b pb-2">
                            Total Taxes
                          </h1>

                          <div className="flex flex-col gap-6 mt-3">
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="totalItemQuantityChecked"
                                checked={formData.totalItemQuantityChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="totalItemQuantityChecked">
                                Total Item Quantity
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="amountWithDecimalChecked"
                                checked={formData.amountWithDecimalChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="amountWithDecimalChecked">
                                Amount with Decimal e.g. 0.00
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="receivedAmountChecked"
                                checked={formData.receivedAmountChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="receivedAmountChecked">
                                Received Amount
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="balanceAmountChecked"
                                checked={formData.balanceAmountChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="balanceAmountChecked">
                                Balance Amount
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="currentBalanceOfPartyChecked"
                                checked={formData.currentBalanceOfPartyChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="currentBalanceOfPartyChecked">
                                Current Balance of Party
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="taxDetailsChecked"
                                checked={formData.taxDetailsChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="taxDetailsChecked">
                                Tax Details
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="youSavedChecked"
                                checked={formData.youSavedChecked}
                                onChange={handleInputChange}
                              />
                              <label htmlFor="youSavedChecked">You Saved</label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="printAmountWithGroupingChecked"
                                checked={
                                  formData.printAmountWithGroupingChecked
                                }
                                onChange={handleInputChange}
                              />
                              <label htmlFor="printAmountWithGroupingChecked">
                                Print Amount with Grouping
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h1 className="text-sm font-bold border-b pb-2">
                            Footer
                          </h1>
                          <div className="flex flex-col gap-6 mt-3">
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="printDescription"
                                value={invoiceData.printDescription}
                                onChange={handleInputChange}
                                checked={invoiceData.printDescription}
                              />
                              <label htmlFor="description">
                                Print Description
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="customerSignature"
                                value={invoiceData.customerSignature}
                                onChange={handleInputChange}
                                checked={invoiceData.customerSignature}
                              />
                              <input
                                type="text"
                                // id={formData.customerSignatureTitle}
                                name="customerSignatureTitle"
                                value={formData.customerSignatureTitle}
                                onChange={handleInputChange}
                                placeholder={formData.customerSignatureTitle}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="paymentMode"
                                value={invoiceData.paymentMode}
                                onChange={handleInputChange}
                                checked={invoiceData.paymentMode}
                              />
                              <label htmlFor="acknowledgement">
                                Print Payment Mode
                              </label>
                            </div>
                            <div className="flex gap-[32px] items-center">
                              <input
                                type="checkbox"
                                name="printAcknowledgement"
                                value={invoiceData.printAcknowledgement}
                                onChange={handleInputChange}
                                checked={invoiceData.printAcknowledgement}
                              />
                              <label htmlFor="acknowledgement">
                                Print Acknowledgement
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={handleSubmit}
                          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {regularPrinterTab === "change-colors" && (
                    <div>
                      <label
                        htmlFor="color-options"
                        className="text-sm font-medium"
                      >
                        Select Color
                      </label>
                      <select
                        id="color-options"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-2"
                      >
                        <option value="default">Default</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {invoiceData.printer === "thermal-printer" && (
              <div>
                <ThermalPrinter
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
                  isEditable={false}
                />
              </div>
              // null
            )}
          </div>
        </div>
        <div
          className="bg-white shadow-md rounded-lg w-3/5 h-[99vh] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {invoiceData.printer === "regular-printer" ? (
            <TaxInvoice invoiceData={invoiceData} currentTheme={currentTheme} />
          ) : (
            <DefaultThermalTheme
              printerSettings={printerSettings}
              companyInfo={companyInfo}
              itemTableSettings={itemTableSettings}
              totalsAndTaxes={totalsAndTaxes}
              footerSettings={footerSettings}
              isEditable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintSettingPage;
