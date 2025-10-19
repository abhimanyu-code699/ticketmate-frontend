import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { backend_url } from '../../utils/urlConfing';

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup({ show: false, type: '', message: '' });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/register`, {
        email: formData.email,
        password: formData.password
      });

      setLoading(false);
      setPopup({
        show: true,
        type: 'success',
        message: response.data.message || 'Account created successfully!'
      });

      setTimeout(() => {
        setPopup({ show: false, type: '', message: '' });
        navigate('/verify');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setPopup({
        show: true,
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to connect to the server. Please try again later.'
      });
      setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
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

      {/* Signup Card */}
      <div className="relative z-20 bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] w-full max-w-md p-8 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Login
          </h2>
          <p className="text-gray-600 text-sm">Join us today and get started</p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
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
                className={`w-full px-4 py-3 border-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="group relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow-md`}
              />
              <div
                className="absolute right-4 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* ✅ Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-105 animate-fade-in ${
              popup.type === 'success' ? 'border-green-400' : 'border-red-400'
            } border-2`}
          >
            <h3
              className={`text-xl font-semibold mb-2 ${
                popup.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {popup.type === 'success' ? '✅ Success' : '❌ Error'}
            </h3>
            <p className="text-gray-700">{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
