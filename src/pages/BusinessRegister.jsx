import React from 'react';
import { FaUser, FaPhone, FaStore, FaUpload, FaBuilding, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';

const BusinessRegister = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 min-h-screen h-screen overflow-y-auto no-scrollbar py-10">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center md:text-left">
        Ready to grow your business? Let's get started!
      </h1>
      <p className="text-gray-600 mb-6 md:mb-8 text-center md:text-left">
        Register your business and connect your store to a bustling marketplace in just a few clicks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Business Registration */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-center md:text-left">Business Registration</h2>
          <form className="bg-white shadow-md rounded px-6 md:px-8 pt-6 pb-8 mb-4">
            {/* Business Name */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="business-name">
                Business Name
              </label>
              <div className="flex items-center">
                <FaBuilding className="absolute left-3 text-gray-400" />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="business-name"
                  type="text"
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="contact-info">
                Contact Information
              </label>
              <div className="flex items-center">
                <FaPhone className="absolute left-3 text-gray-400" />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contact-info"
                  type="text"
                  placeholder="Enter your contact info"
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="business-type">
                Business Type
              </label>
              <div className="flex items-center">
                <FaStore className="absolute left-3 text-gray-400" />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="business-type"
                  type="text"
                  placeholder="Enter your business type"
                />
              </div>
            </div>

            {/* Business Logo Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="business-logo">
                Business Logo Upload
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-40 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <FaUpload className="text-gray-400 mb-2 md:mb-3 w-6 h-6 md:w-10 md:h-10" />
                  <p className="mb-1 md:mb-2 text-xs md:text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center md:justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="button"
              >
                <FaCheckCircle className="mr-2" />
                Register Business
              </button>
            </div>
          </form>
        </div>

        {/* Marketplace Integration */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-center md:text-left">Marketplace Integration</h2>
          <div className="bg-white shadow-md rounded px-6 md:px-8 pt-6 pb-8 mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="store-platform">
              Select Store Platform
            </label>
            <div className="relative">
              <FaShoppingCart className="absolute left-3 top-3 text-gray-400" />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="store-platform"
                type="text"
                placeholder="Enter your store platform"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full flex items-center justify-center"
            >
              <FaCheckCircle className="mr-2" />
              Add to Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-lg font-bold mb-4 text-center md:text-left">Progress Tracker</h2>
        <div className="bg-white shadow-md rounded px-6 md:px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center mb-2 justify-center md:justify-start">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>Business Registered</span>
          </div>
          <div className="flex items-center justify-center md:justify-start">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>Store Connected</span>
          </div>
        </div>
        <p className="text-gray-600 text-center md:text-left">
          Track your store's performance once integrated!
        </p>
      </div>
    </div>
  );
};

export default BusinessRegister;