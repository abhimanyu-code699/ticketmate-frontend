import axios from 'axios';
import React, { useState } from 'react';
import { backend_url } from '../../utils/urlConfing';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${backend_url}/api/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);

      // ✔ SHOW ONLY BACKEND MESSAGE
      setPopup({
        show: true,
        type: "success",
        message: response.data.message || ""
      });

      // Redirect to verify page
      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
        navigate('/verify');
      }, 1500);

    } catch (error) {
      setLoading(false);

      // ✔ SHOW ONLY BACKEND ERROR MESSAGE
      setPopup({
        show: true,
        type: "error",
        message: error.response?.data?.message || ""
      });

      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/50 to-purple-900/50 backdrop-blur-sm"></div>
      </div>

      {/* POPUP MESSAGE */}
      {popup.show && (
        <div
          className={`fixed top-5 px-6 py-3 text-white rounded-lg shadow-lg z-50 transition-all ${
            popup.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup.message}
        </div>
      )}

      {/* SIGNUP CARD */}
      <div className="bg-white rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] w-full max-w-md p-8 z-10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create account into TicketMate
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-3"></div>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* Full Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              focus:outline-none focus:border-blue-500 focus:ring-4 
              focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              focus:outline-none focus:border-blue-500 focus:ring-4 
              focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Phone */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="98765 43210"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              focus:outline-none focus:border-blue-500 focus:ring-4 
              focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
              focus:outline-none focus:border-blue-500 focus:ring-4 
              focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700 text-white font-bold 
            py-3.5 rounded-xl shadow-lg hover:shadow-2xl transform 
            hover:-translate-y-0.5 transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
