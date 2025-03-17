import React, { useState } from "react";
import ItemEntry from "./ItemEntry.jsx";
import { useNavigate } from "react-router-dom";
const ImportItems = () => {
  const [selectedMethod, setSelectedMethod] = useState("barcode");
  const [showItemEntry, setShowItemEntry] = useState(false);
  const navigate = useNavigate()

  const importMethods = [
    {
      id: "barcode",
      title: "Import From Barcode",
      description:
        "Import item details by scanning barcodes. Paper Bill uses a library of 100 Mn+ standard barcodes to fetch all details of your items in seconds.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-16 h-16 text-blue-400"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path
            d="M7 7h2v10H7V7zm3 0h1v10h-1V7zm2 0h3v10h-3V7zm4 0h1v10h-1V7zm2 0h2v10h-2V7z"
            fill="currentColor"
          />
        </svg>
      ),
      recommended: true,
    },
    {
      id: "excel",
      title: "Import From Excel",
      description: "Import item data from excel files in your system",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-16 h-16 text-blue-400"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path
            d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: "library",
      title: "Import From Paper Bill Library",
      description: "Import items from Paper Bill's database",
      icon: null,
    },
  ];

  const handleContinue = () => {
    if (selectedMethod === 'barcode') {
      navigate('/item-entry');
    }
    else if(selectedMethod === "excel"){
        navigate("/more-features/import-excel")
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Import Items</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {importMethods.slice(0, 2).map((method) => (
            <div
              key={method.id}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all
                  ${
                    selectedMethod === method.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              {method.recommended && (
                <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                  RECOMMENDED
                </span>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-blue-100 p-2">
                  {method.icon}
                </div>
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {selectedMethod === method.id && (
                    <div className="h-4 w-4 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>

              <h3 className="font-medium text-gray-800 mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>

        <div className="relative flex items-center gap-4 my-8">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div
          className={`border rounded-lg p-4 cursor-pointer
              ${
                selectedMethod === "library"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
          onClick={() => setSelectedMethod("library")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">
                {importMethods[2].title}
              </h3>
              <p className="text-sm text-gray-600">
                {importMethods[2].description}
              </p>
            </div>
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {selectedMethod === "library" && (
                <div className="h-4 w-4 rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end fixed w-full bottom-4 right-3">
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          disabled={!selectedMethod}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ImportItems;
