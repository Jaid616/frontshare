import React from "react";
import { Link } from "react-router-dom";

const EnterOtp = () => {
  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="flex-1 bg-gradient-to-r from-[#CD4735] to-[#F9AC40] text-white flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-4xl font-semibold mb-6">Enter OTP to Verify</h1>
        <p className="mb-6">Secure your account with quick verification.</p>
        <Link to="/login">
          <button className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg">
            Log In
          </button>
        </Link>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Verify OTP</h1>
        <p className="mb-6 text-gray-600">
          Please enter the 6-digit OTP sent to your registered email or phone.
        </p>
        <input
          type="text"
          maxLength="6"
          className="w-3/4 p-3 mb-6 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#F8A83F]"
          placeholder="Enter OTP"
        />
        <button className="bg-gradient-to-r from-[#F8A83F] to-[#CA3F33] text-white py-3 px-8 rounded-lg cursor-pointer text-lg">
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default EnterOtp;
