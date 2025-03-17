import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

const PartySettings = ({ settings, onSettingsChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handlePartySettingChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  const handleAdditionalFieldChange = (index, field, value) => {
    const updatedFields = [...settings.additionalFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    
    onSettingsChange({
      ...settings,
      additionalFields: updatedFields
    });
  };

  const handleReminderMessageChange = (message) => {
    onSettingsChange({
      ...settings,
      reminderMessage: {
        ...settings.reminderMessage,
        additionalMessage: message
      }
    });
  };

  const resetReminderMessage = () => {
    onSettingsChange({
      ...settings,
      reminderMessage: {
        ...settings.reminderMessage,
        additionalMessage: ""
      }
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="grid grid-cols-3 gap-8">
        {/* Party Settings Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Party Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={settings?.partyGrouping}
                onChange={(e) => handlePartySettingChange('partyGrouping', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Party Grouping</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={settings?.shippingAddress}
                onChange={(e) => handlePartySettingChange('shippingAddress', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Shipping Address</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={settings?.enablePaymentReminder}
                onChange={(e) => handlePartySettingChange('enablePaymentReminder', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Enable Payment Reminder</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>

            {settings?.enablePaymentReminder && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Remind me for payment due in</span>
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={settings?.paymentReminderDays}
                      onChange={(e) => handlePartySettingChange('paymentReminderDays', Number(e.target.value))}
                      className="w-16 h-8 px-2 border rounded text-sm"
                      min="1"
                    />
                    <span className="text-sm text-gray-600">(days)</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Reminder Message {">"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-lg font-semibold">Additional Fields</h2>
            <Info className="h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-6">
            {settings?.additionalFields.map((field, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={field.enabled}
                    onChange={(e) => handleAdditionalFieldChange(index, 'enabled', e.target.checked)}
                  />
                  <input
                    type="text"
                    placeholder={`Additional Field ${index + 1}`}
                    className={`flex-1 px-3 py-2 border rounded text-sm ${
                      !field.enabled ? 'bg-gray-100 text-gray-400' : 'bg-white'
                    }`}
                    value={field.fieldName}
                    onChange={(e) => handleAdditionalFieldChange(index, 'fieldName', e.target.value)}
                    disabled={!field.enabled}
                  />
                  {field.type === 'date' && (
                    <button 
                      className={`px-3 py-2 border rounded text-sm flex items-center space-x-1 ${
                        !field.enabled ? 'bg-gray-100 text-gray-400' : 'text-gray-600'
                      }`}
                      disabled={!field.enabled}
                    >
                      <span>dd/mm/yy</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-8">
                  <button
                    className={`relative w-11 h-6 transition-colors duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      field.showInPrint ? 'bg-blue-500' : 'bg-gray-200'
                    } ${!field.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => field.enabled && handleAdditionalFieldChange(index, 'showInPrint', !field.showInPrint)}
                    disabled={!field.enabled}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${
                        field.showInPrint ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${!field.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                    Show In Print
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Point Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-lg font-semibold">Enable Loyalty Point</h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={settings?.loyaltyPoints?.enabled}
              onChange={(e) => handlePartySettingChange('loyaltyPoints', { enabled: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Enable Loyalty Point</span>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Reminder Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add/Edit Reminder Message</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">Dear [Party Name]</p>
              <p className="text-gray-600">
                Your payment of [Amount] is pending with [Business Name]
              </p>

              <textarea
                value={settings?.reminderMessage?.additionalMessage}
                onChange={(e) => handleReminderMessageChange(e.target.value)}
                placeholder="Type additional message"
                className="w-full px-3 py-2 border rounded h-24 text-sm"
              />

              <p className="text-gray-600 text-sm">
                {settings?.reminderMessage?.defaultMessage}
              </p>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
                >
                  CANCEL
                </button>
                <button
                  onClick={resetReminderMessage}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
                >
                  RESET DEFAULT
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartySettings;