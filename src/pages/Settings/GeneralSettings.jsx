import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const GeneralSettings = ({ generalSettings, setGeneralSettings }) => {
  const handleEnablePasscode = () => {
    setGeneralSettings((prev) => ({
      ...prev,
      enablePasscode: !prev.enablePasscode,
      showPasscodeDialog: true,
    }));
  };

  const handleSavePasscode = () => {
    if (generalSettings?.passcode === generalSettings?.confirmPasscode) {
      setGeneralSettings((prev) => ({
        ...prev,
        showPasscodeDialog: false,
      }));
    } else {
      alert("Passcode and confirm passcode do not match.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setGeneralSettings((prev) => ({
          ...prev,
          email: decoded.email,
        }));
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  return (
    <div className="h-[97vh] flex flex-col font-sans">
      <div className="flex justify-between">
        <div className="p-4 w-[340px]">
          <h2 className="text-lg font-bold border-b py-4">Application</h2>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.enablePasscode}
              onChange={handleEnablePasscode}
            />
            Enable Passcode
          </label>
          {generalSettings?.showPasscodeDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Set Passcode</h3>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Passcode</label>
                  <input
                    type="password"
                    className="border rounded px-2 py-1 w-full"
                    value={generalSettings?.passcode}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        passcode: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Confirm Passcode
                  </label>
                  <input
                    type="password"
                    className="border rounded px-2 py-1 w-full"
                    value={generalSettings?.confirmPasscode}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        confirmPasscode: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                    onClick={handleSavePasscode}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
                    onClick={() =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        showPasscodeDialog: false,
                      }))
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center mb-2">
            <span className="mr-2">Business Currency</span>
            <select
              className="border rounded px-2 py-1 w-24"
              value={generalSettings?.businessCurrency}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  businessCurrency: e.target.value,
                }))
              }
            >
              <option value="USD">USD - $</option> {/* US Dollar */}
              <option value="EUR">EUR - €</option> {/* Euro */}
              <option value="GBP">GBP - £</option> {/* British Pound */}
              <option value="AUD">AUD - A$</option> {/* Australian Dollar */}
              <option value="CAD">CAD - C$</option> {/* Canadian Dollar */}
              <option value="CHF">CHF - CHF</option> {/* Swiss Franc */}
              <option value="CNY">CNY - ¥</option> {/* Chinese Yuan */}
              <option value="JPY">JPY - ¥</option> {/* Japanese Yen */}
              <option value="INR">INR - ₹</option> {/* Indian Rupee */}
              <option value="MXN">MXN - $</option> {/* Mexican Peso */}
              <option value="BRL">BRL - R$</option> {/* Brazilian Real */}
              <option value="ZAR">ZAR - R</option> {/* South African Rand */}
              <option value="HKD">HKD - $</option> {/* Hong Kong Dollar */}
              <option value="SGD">SGD - S$</option> {/* Singapore Dollar */}
              <option value="KRW">KRW - ₩</option> {/* South Korean Won */}
              <option value="MYR">MYR - RM</option> {/* Malaysian Ringgit */}
              <option value="THB">THB - ฿</option> {/* Thai Baht */}
              <option value="SEK">SEK - kr</option> {/* Swedish Krona */}
              <option value="NOK">NOK - kr</option> {/* Norwegian Krone */}
              <option value="DKK">DKK - kr</option> {/* Danish Krone */}
              <option value="ILS">ILS - ₪</option> {/* Israeli New Shekel */}
              <option value="PLN">PLN - zł</option> {/* Polish Zloty */}
              <option value="PHP">PHP - ₱</option> {/* Philippine Peso */}
              <option value="TRY">TRY - ₺</option> {/* Turkish Lira */}
              <option value="RUB">RUB - ₽</option> {/* Russian Ruble */}
              <option value="EGP">EGP - ج.م</option> {/* Egyptian Pound */}
              <option value="PKR">PKR - ₨</option> {/* Pakistani Rupee */}
              <option value="VND">VND - ₫</option> {/* Vietnamese Dong */}
              <option value="AR$">AR$ - $</option> {/* Argentine Peso */}
              <option value="CLP">CLP - $</option> {/* Chilean Peso */}
              <option value="COP">COP - $</option> {/* Colombian Peso */}
              <option value="NGN">NGN - ₦</option> {/* Nigerian Naira */}
              <option value="RON">RON - lei</option> {/* Romanian Leu */}
            </select>
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">Amount</span>
            <input
              type="text"
              className="border rounded px-2 py-1 w-24"
              value={generalSettings?.amount}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            />
          </div>
          <label className="flex items-center mb-2 mt-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.gstnumber}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  gstnumber: e.target.checked,
                }))
              }
            />
            GSTIN Number
          </label>
        </div>
        <div className="p-4 w-[340px]">
          <div>
            <label className="flex font-bold items-center mb-2 border-b py-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={generalSettings?.multiFirm}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    multiFirm: e.target.checked,
                  }))
                }
              />
              Multi Firm
            </label>
            <div className="flex items-center mb-2">
              <span className="mr-2">My Company</span>
              <div className="flex-1 relative">
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={generalSettings?.company}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                >
                  <option>DEFAULT</option>
                </select>
                <div className="absolute top-0 right-0 h-full flex items-center pr-2 cursor-pointer">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="p-4 w-[340px]">
          <h2 className="text-lg font-bold border-b py-4">Backup & History</h2>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings.autoBackup}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  autoBackup: e.target.checked,
                }))
              }
            />
            Auto Backup
          </label>
          <p className="text-sm text-gray-500">
            Last Backup 08/01/2025 | 01:01 PM
          </p>
          <p className="text-sm text-gray-500">Auto Backup every 2 days</p>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings.auditTrail}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  auditTrail: e.target.checked,
                }))
              }
            />
            Audit Trail
          </label>
        </div> */}
      </div>
      <div className="flex justify-between">
        <div className="p-4 w-[340px]">
          <h2 className="text-lg font-bold border-b py-4">More Transactions</h2>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.estimateQuotation}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  estimateQuotation: e.target.checked,
                }))
              }
            />
            Estimate/Quotation
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.salePurchaseOrder}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  salePurchaseOrder: e.target.checked,
                }))
              }
            />
            Sale/Purchase Order
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.otherIncome}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  otherIncome: e.target.checked,
                }))
              }
            />
            Other Income
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.fixedAssets}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  fixedAssets: e.target.checked,
                }))
              }
            />
            Fixed Assets (FA)
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.deliveryChallan}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  deliveryChallan: e.target.checked,
                }))
              }
            />
            Delivery Challan
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.goodsReturnOnDeliveryChallan}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  goodsReturnOnDeliveryChallan: e.target.checked,
                }))
              }
            />
            Goods return on Delivery Challan
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.printAmountInDeliveryChallan}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  printAmountInDeliveryChallan: e.target.checked,
                }))
              }
            />
            Print amount in Delivery Challan
          </div>
        </div>
        <div className="p-4 w-[340px]">
          <h2 className="text-lg font-bold border-b py-4">
            Stock Transfer Between Godowns
          </h2>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={generalSettings?.godownManagement}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  godownManagement: e.target.checked,
                }))
              }
            />
            Godown management & Stock transfer
          </div>
        </div>
        <div className="p-4 w-[340px]">
          <h2 className="text-lg font-bold border-b py-4">
            Customize Your View
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Choose Your Screen Zoom/Scale
          </p>
          <div className="flex items-center">
            <input
              type="range"
              min="70"
              max="130"
              step="5"
              value={generalSettings?.screenZoom}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  screenZoom: parseInt(e.target.value),
                }))
              }
              className="flex-1"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
