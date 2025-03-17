import React, { useState } from "react";

const OrderConfirmed = () => {
  const statuses = [
    "Order Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const [currentStep, setCurrentStep] = useState(2); // Example: 2 = Shipped

  // Tracking Updates Data
  const trackingUpdates = [
    {
      date: "29 Dec",
      time: "00:26",
      message:
        "Your parcel has been Intxjunded at the Icxsstics facility BO-DEX",
    },
    {
      date: "30 Dec",
      time: "01:26",
      message: "Your parcel has departed the logistics facility BD-DEX",
    },
    {
      date: "30 Dec",
      time: "02:26",
      message: "Your parcel has been inbounded at the facility BO-DEX.",
    },
    {
      date: "30 Dec",
      time: "02:56",
      message: "Your parcel has been Picked up by BD-DEX.",
    },
  ];

  // Simulated Functionality: Update the current step manually
  const updateStatus = (step) => {
    setCurrentStep(step);
  };

  const calculateProgress = () => {
    return ((currentStep - 1) / (statuses.length - 1)) * 100; // Static progress width based on currentStep
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 py-8 font-sans h-screen overflow-y-auto no-scrollbar">
      {/* Order Confirmed Section */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
          <span>✅</span>
          Woohoo! Your Order Is Confirmed.
        </h2>
      </div>

      {/* Progress Bar Section */}
      <div className="relative mb-8">
        {/* Status Labels */}
        <div className="flex justify-between text-gray-600 text-sm mb-1">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={`${
                currentStep > index ? "text-blue-500" : "text-gray-400"
              } text-center`}
            >
              {status}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1 rounded-full relative">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>

        {/* Tracking Progress */}
        <div className="mt-4 text-gray-700 text-sm">
          {currentStep >= 1 && <div>🟢 Order Confirmed on 29 Dec 2023</div>}
          {currentStep >= 2 && <div>📦 Shipped on 31 Dec 2023</div>}
          {currentStep >= 3 && <div>🚚 Out for Delivery on 2 Jan 2024</div>}
          {currentStep >= 4 && <div>🎉 Delivered on 4 Jan 2024</div>}
        </div>
      </div>

      {/* Tracking Details Section */}
      {currentStep === 2 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow mt-4 mb-10">
          <h3 className="text-md font-semibold mb-2 text-gray-800">
            Tracking Updates
          </h3>
          <div className="space-y-2">
            {trackingUpdates.map((update, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border-b pb-2 last:border-none last:pb-0"
              >
                <div className="text-xs text-gray-600 w-16">
                  <div className="font-bold">{update.date}</div>
                  <div>{update.time}</div>
                </div>
                <div className="text-gray-700 text-sm">{update.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <div>
            <span className="text-gray-600">Your order number is:</span>
            <span className="font-bold ml-1">20/B</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>3 Items</div>
            <div>Delivery: $6.99</div>
            <div className="font-semibold text-blue-500">Total: $716.99</div>
          </div>
        </div>

        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
          VIEW ORDER
        </button>

        <div className="mt-6">
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <div className="text-sm font-semibold">
                TikTok Mini Toy Gun 3D STL File 556
              </div>
              <div className="text-xs text-gray-500">By Pyik Toys</div>
            </div>
            <div className="text-right">
              <span className="text-blue-500 font-semibold">$50</span>
              <span className="line-through text-gray-400 text-xs ml-2">
                $80
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <div className="text-sm font-semibold">Toy Car</div>
              <div className="text-xs text-gray-500">By Pyik Toys</div>
            </div>
            <div className="text-right text-gray-700 font-semibold">$100</div>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <div className="text-sm font-semibold">2 Fold 40 Sumusung</div>
              <div className="text-xs text-gray-500">By Sumusung</div>
            </div>
            <div className="text-right text-gray-700 font-semibold">$600</div>
          </div>
        </div>
      </div>

      {/* Simulated Manual Step Update Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        {statuses.map((status, index) => (
          <button
            key={index}
            onClick={() => updateStatus(index + 1)}
            className={`px-4 py-2 rounded ${
              currentStep > index
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderConfirmed;
