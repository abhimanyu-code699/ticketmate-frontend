import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../utils/urlConfing";

const Documents = () => {
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhar, setAadhar] = useState(null);

  const [popup, setPopup] = useState({ message: "", type: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const showPopupMessage = (message, type) => {
    setPopup({ message, type });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePhoto || !aadhar) {
      showPopupMessage("Please upload both Profile Photo and Aadhaar Card", "error");
      return;
    }

    const token = Cookies.get("authToken");
    if (!token) {
      showPopupMessage("User token not found. Please login again.", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);
      formData.append("aadhar", aadhar);

      console.log("Sending token:", token); // Debug token

      const response = await axios.post(
        `${backend_url}/api/upload-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          },
        }
      );

      const backendMessage = response.data.message || "Uploaded Successfully!";
      showPopupMessage(backendMessage, "success");

      // Clear fields
      setProfilePhoto(null);
      setAadhar(null);

      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);

      const backendMessage =
        error.response?.data?.message || "Upload failed. Try again.";
      showPopupMessage(backendMessage, "error");
    } finally {
      setLoading(false);
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

      {/* Popup */}
      {showPopup && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
            popup.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popup.message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Upload Your Documents
        </h2>

        {/* Profile Photo */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2 text-sm">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {profilePhoto && (
            <img
              src={URL.createObjectURL(profilePhoto)}
              alt="preview"
              className="h-20 w-20 rounded-full mt-3 border"
            />
          )}
        </div>

        {/* Aadhaar */}
        <div className="mb-6">
          <label className="block text-gray-200 mb-2 text-sm">Aadhaar Card</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setAadhar(e.target.files[0])}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {aadhar && (
            <p className="text-gray-300 text-sm mt-2">{aadhar.name}</p>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="cursor-pointer w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
        >
          {loading ? "Uploading..." : "Upload Documents"}
        </button>
      </form>
    </div>
  );
};

export default Documents;
