import React from "react";
import { useNavigate } from "react-router-dom";

const CreateStore = () => {
    const navigate = useNavigate()
  return (
    <div className="font-sans h-screen overflow-y-auto no-scrollbar py-10">
      {/* Header */}
      <div className="text-center py-8 bg-red-50">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
          BHARAT KA MARKETPLACE
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          "Empowering Small Businesses Online"
        </p>
      </div>

      {/* Main Section */}
      <div className="bg-red-100 py-12 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Apna Business Online Karein!
        </h2>
        <p className="text-gray-600 mb-6">
          Ab India Karega Business Online.
        </p>
        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
        onClick={() => navigate('/register-business')}>
          Create Your Store
        </button>
      </div>

      {/* Features Section */}
      <div className="flex flex-wrap justify-center gap-6 py-8 px-4">
        {/* Feature 1 */}
        <div className="flex flex-col items-center w-full md:w-1/3 bg-white shadow-md rounded-md p-4 text-center">
          <span className="text-red-500 text-3xl">📈</span>
          <h3 className="font-bold mt-2 text-gray-800">Grow Income 10x</h3>
          <p className="text-sm text-gray-600">Badhao apni kamaai das guna!</p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center w-full md:w-1/3 bg-white shadow-md rounded-md p-4 text-center">
          <span className="text-red-500 text-3xl">👥</span>
          <h3 className="font-bold mt-2 text-gray-800">Get New Customers Online</h3>
          <p className="text-sm text-gray-600">
            Naye grahak jodo, business badhao!
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center w-full md:w-1/3 bg-white shadow-md rounded-md p-4 text-center">
          <span className="text-red-500 text-3xl">🛒</span>
          <h3 className="font-bold mt-2 text-gray-800">Get More Orders</h3>
          <p className="text-sm text-gray-600">Zyada orders, zyada munafa!</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-8 px-4">
        <h2 className="font-bold text-xl md:text-2xl text-gray-800 mb-6">
          What Our Users Say
        </h2>
        {/* Testimonial 1 */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <p className="text-gray-600">
            "Mera dhanda online jaane ke baad 40% zyada bikri hui!" -{" "}
            <span className="font-bold text-gray-800">Amit Sharma</span>
          </p>
        </div>
        {/* Testimonial 2 */}
        <div className="bg-white shadow-md rounded-md p-4">
          <p className="text-gray-600">
            "Business online karne se mujhe naye customers mile!" -{" "}
            <span className="font-bold text-gray-800">Priya Gupta</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateStore;
