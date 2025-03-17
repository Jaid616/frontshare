import React, { useState } from "react";
import ThermalTheme1 from "../../assets/ThermalTheme1.png";

const ThermalPrinter = ({
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
  isEditable
}) => {
  return (
    <div className="w-full bg-white">
      <div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Thermal Printer Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Layout Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Change Layout</h2>
            <div className="grid grid-cols-4 gap-4">
              <button
                // onClick={() => setSelectedTheme(`theme-${i + 1}`)}
                className={`relative aspect-[3/4] border-2 rounded-lg overflow-hidden hover:border-blue-600 transition-colors ${
                  selectedTheme === `theme-1`
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={ThermalTheme1}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Page Size & Printing Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="page-size"
                  className="block text-sm font-medium text-gray-700"
                >
                  Page Size
                </label>
                <select
                  id="page-size"
                  value={printerSettings.pageSize}
                  onChange={(e) =>
                    handlePrinterSettingsChange("pageSize", e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="2-inch">2 Inch (58mm)</option>
                  <option value="3-inch">3 Inch (80mm)</option>
                  <option value="4-inch">4 Inch (112mm)</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="colors"
                  className="block text-sm font-medium text-gray-700"
                >
                  Colors
                </label>
                <select
                  id="colors"
                  value={printerSettings.colors}
                  onChange={(e) =>
                    handlePrinterSettingsChange("colors", e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="make-default"
                  checked={printerSettings.makeDefault}
                  onChange={(e) =>
                    handlePrinterSettingsChange("makeDefault", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="make-default"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make Thermal Printer Default
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="text-styling"
                  checked={printerSettings.useTextStyling}
                  onChange={(e) =>
                    handlePrinterSettingsChange(
                      "useTextStyling",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="text-styling"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Use Text Styling (Bold)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-cut"
                  checked={printerSettings.autoCutPaper}
                  onChange={(e) =>
                    handlePrinterSettingsChange(
                      "autoCutPaper",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="auto-cut"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Auto Cut Paper After Printing
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="open-drawer"
                  checked={printerSettings.openCashDrawer}
                  onChange={(e) =>
                    handlePrinterSettingsChange(
                      "openCashDrawer",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="open-drawer"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Open Cash Drawer After Printing
                </label>
              </div>

              <div>
                <label
                  htmlFor="extra-lines"
                  className="block text-sm font-medium text-gray-700"
                >
                  Extra lines at the end
                </label>
                <input
                  type="number"
                  id="extra-lines"
                  value={printerSettings.extraLines}
                  onChange={(e) =>
                    handlePrinterSettingsChange(
                      "extraLines",
                      parseInt(e.target.value)
                    )
                  }
                  min="0"
                  className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Company Info Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">
              Print Company Info / Header
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company-name"
                  value={companyInfo.companyName}
                  onChange={(e) =>
                    handleCompanyInfoChange("companyName", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-logo"
                  checked={companyInfo.includeLogo}
                  onChange={(e) =>
                    handleCompanyInfoChange("includeLogo", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="include-logo"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Company Logo
                </label>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={companyInfo.address}
                  onChange={(e) =>
                    handleCompanyInfoChange("address", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={companyInfo.email}
                  onChange={(e) =>
                    handleCompanyInfoChange("email", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) =>
                    handleCompanyInfoChange("phone", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="gstin"
                  className="block text-sm font-medium text-gray-700"
                >
                  GSTIN on Sale
                </label>
                <input
                  type="text"
                  id="gstin"
                  value={companyInfo.gstin}
                  onChange={(e) =>
                    handleCompanyInfoChange("gstin", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter GSTIN"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Item Table Settings */}
          <div>
            <h2 className="text-lg font-medium mb-4">Item Table Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* Previous checkboxes remain the same */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-mrp"
                    checked={itemTableSettings.showMRP}
                    onChange={(e) =>
                      handleItemTableSettingsChange("showMRP", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="show-mrp"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    MRP
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-description"
                    checked={itemTableSettings.showDescription}
                    onChange={(e) =>
                      handleItemTableSettingsChange(
                        "showDescription",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="show-description"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Description
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-batch"
                    checked={itemTableSettings.showBatch}
                    onChange={(e) =>
                      handleItemTableSettingsChange(
                        "showBatch",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="show-batch"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Batch No.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-expiry"
                    checked={itemTableSettings.showExpiry}
                    onChange={(e) =>
                      handleItemTableSettingsChange(
                        "showExpiry",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="show-expiry"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Exp. Date
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-mfg"
                    checked={itemTableSettings.showMfg}
                    onChange={(e) =>
                      handleItemTableSettingsChange("showMfg", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="show-mfg"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Mfg. Date
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Totals & Taxes Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Totals & Taxes</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-total-quantity"
                  checked={totalsAndTaxes.showTotalQuantity}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showTotalQuantity",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-total-quantity"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Total Item Quantity
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-amount-decimal"
                  checked={totalsAndTaxes.showAmountDecimal}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showAmountDecimal",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-amount-decimal"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Amount with Decimal
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-received-amount"
                  checked={totalsAndTaxes.showReceivedAmount}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showReceivedAmount",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-received-amount"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Received Amount
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-balance"
                  checked={totalsAndTaxes.showBalance}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange("showBalance", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-balance"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Balance Amount
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-current-balance"
                  checked={totalsAndTaxes.showCurrentBalance}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showCurrentBalance",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-current-balance"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Current Balance of Party
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-tax-details"
                  checked={totalsAndTaxes.showTaxDetails}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showTaxDetails",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-tax-details"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Tax Details
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-you-saved"
                  checked={totalsAndTaxes.showYouSaved}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange("showYouSaved", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-you-saved"
                  className="ml-2 block text-sm text-gray-700"
                >
                  You Saved
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-amount-grouping"
                  checked={totalsAndTaxes.showAmountGrouping}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange(
                      "showAmountGrouping",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-amount-grouping"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Print Amount with Grouping
                </label>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="amount-language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount in Words
                </label>
                <select
                  id="amount-language"
                  value={totalsAndTaxes.amountLanguage}
                  onChange={(e) =>
                    handleTotalsAndTaxesChange("amountLanguage", e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="indian">Indian</option>
                  <option value="english">English</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Footer Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Footer</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-print-description"
                  checked={footerSettings.showPrintDescription}
                  onChange={(e) =>
                    handleFooterSettingsChange(
                      "showPrintDescription",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="show-print-description"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Print Description
                </label>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Terms and Conditions &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalPrinter;
