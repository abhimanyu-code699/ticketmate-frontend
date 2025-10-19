import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../utils/urlConfing";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "" }); // success or error popup
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backend_url}/api/verify`, { email, code });
      const data = res.data;

      // ✅ Success popup
      setPopup({ message: data.message || "Account verified successfully!", type: "success" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // auto hide after 3s
      setEmail("");
      setCode("");
    } catch (error) {
      console.error(error);

      // ❌ Error popup
      const errorMsg =
        error.response?.data?.message || "Invalid OTP or email. Please try again!";
      setPopup({ message: errorMsg, type: "error" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setEmail("");
      setCode("");

       if (errorMsg === "Verification code expired, register again") {
        setTimeout(() => navigate("/"), 1500); // redirect after 1.5s
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-purple-900/60 z-0"></div>

      {/* Popup Message */}
      {showPopup && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
            popup.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {popup.message}
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Verify Your Account
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* OTP Field */}
        <div className="mb-6">
          <label className="block text-gray-200 mb-2 text-sm">Verification Code</label>
          <input
            type="text"
            placeholder="Enter Code"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
        >
          Verify Account
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
