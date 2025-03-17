import React from "react";
import { XCircle } from "lucide-react";

const TransactionMessage = ({
  transactionMessageSettings,
  setTransactionMessageSettings,
}) => {
  // Function to update message template
  const handleTemplateChange = (key, value) => {
    setTransactionMessageSettings((prev) => ({
      ...prev,
      messageTemplate: {
        ...prev.messageTemplate,
        [key]: value,
      },
    }));
  };

  // Function to handle WhatsApp login
  const handleWhatsAppLogin = () => {
    setTransactionMessageSettings((prev) => ({
      ...prev,
      whatsappLoggedIn: !prev.whatsappLoggedIn,
    }));
  };

  // Function to replace variables in text
  const replaceVariables = (text) => {
    return text
      .replace(/\[Firm_Name\]/g, transactionMessageSettings?.variables?.firmName)
      .replace(
        /\[Transaction_Type\]/g,
        transactionMessageSettings?.variables?.transactionType
      )
      .replace(
        /\[Invoice_Amount\]/g,
        transactionMessageSettings?.variables?.invoiceAmount
      )
      .replace(
        /\[Transaction_Balance\]/g,
        transactionMessageSettings?.variables?.balance
      );
  };

  return (
    <div className="w-full p-6 bg-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Transaction Message
        </h1>
        <button className="text-gray-500 hover:text-gray-700">
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-between">
        {/* Message Type Selection */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 block mb-2">
            Select Message Type:
          </label>
          <div className="w-1/2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={transactionMessageSettings?.messageType}
              onChange={(e) =>
                setTransactionMessageSettings((prev) => ({
                  ...prev,
                  messageType: e.target.value,
                }))
              }
            />
          </div>

          {/* WhatsApp Integration */}
          <div className="mb-6">
            <div className="inline-flex items-center border border-gray-300 rounded">
              <div className="flex items-center px-4 py-2 bg-white border-r border-gray-300">
                <svg
                  className="w-5 h-5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                </svg>
                <span className="ml-2 text-sm">Send via Personal WhatsApp</span>
              </div>
              <button
                className="px-4 py-2 text-blue-600 text-sm hover:bg-blue-50"
                onClick={handleWhatsAppLogin}
              >
                {transactionMessageSettings?.whatsappLoggedIn
                  ? "Logout"
                  : "Login"}
              </button>
            </div>
          </div>

          {/* Message Recipient Settings */}
          <div className="mb-6">
            <h2 className="text-sm text-gray-600 mb-3">
              Message Recipient Settings:
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={transactionMessageSettings?.sendSMS}
                  onChange={(e) =>
                    setTransactionMessageSettings((prev) => ({
                      ...prev,
                      sendSMS: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Send SMS to Party</span>
                <span className="text-gray-400 text-sm">(i)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={transactionMessageSettings?.sendCopy}
                  onChange={(e) =>
                    setTransactionMessageSettings((prev) => ({
                      ...prev,
                      sendCopy: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Send SMS Copy to Self
                </span>
                <span className="text-gray-400 text-sm">(i)</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          {/* Transaction Type Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transaction Type :</span>
              <select
                className="p-2 border border-gray-300 rounded text-sm"
                value={transactionMessageSettings?.transactionType}
                onChange={(e) =>
                  setTransactionMessageSettings((prev) => ({
                    ...prev,
                    transactionType: e.target.value,
                  }))
                }
              >
                <option value="sales">Sales Transaction</option>
                <option value="purchase">Purchase Transaction</option>
                <option value="salesReturn">Sales Return Transaction</option>
                <option value="purchaseReturn">
                  Purchase Return Transaction
                </option>
                <option value="paymentIn">Payment In Transaction</option>
                <option value="paymentOut">Payment Out Transaction</option>
                <option value="saleOrder">Sale Order Transaction</option>
                <option value="purchaseOrder">
                  Purchase Order Transaction
                </option>
                <option value="estimate">Estimate Transaction</option>
                <option value="deliveryNote">Delivery Note Transaction</option>
                <option value="cancelledInvoice">
                  Cancelled Invoice Transaction
                </option>
              </select>
            </div>
          </div>

          {/* Edit Message Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-medium">Edit Message</h2>
            </div>
            <div className="border border-gray-300 w-[359px] rounded-lg p-4">
              <div className="prose prose-xs max-w-none space-y-2">
                {Object.entries(transactionMessageSettings?.messageTemplate || {}).map(
                  ([key, value]) => (
                    <textarea
                      key={key}
                      value={value}
                      onChange={(e) =>
                        handleTemplateChange(key, e.target.value)
                      }
                      className="w-full min-h-[24px] resize-none border-none focus:outline-none p-0 text-xs"
                    />
                  )
                )}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Insert ℹ symbol anywhere to include a variable.
              </div>
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <h2 className="text-xs font-medium mb-4">Message Preview</h2>
            <div className="bg-green-50 p-4 rounded-lg w-[359px]">
              <div className="flex items-center text-blue-600 mb-2 text-xs">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" />
                </svg>
                Transaction Image Attached
              </div>
              <div className="prose prose-xs max-w-none">
                {Object.entries(transactionMessageSettings?.messageTemplate || {}).map(
                  (line, index) => (
                    <p key={index} className="text-xs">
                      {replaceVariables(line)}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMessage;
