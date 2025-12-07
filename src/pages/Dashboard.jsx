import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-blue-50">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 z-50`}
      >
        <h2 className="text-xl font-semibold p-4 border-b">Menu</h2>

        <ul className="p-4 space-y-4 text-lg">
          <li>
            <Link
              to="/upload-ticket"
              className="block hover:text-blue-600 cursor-pointer"
            >
              Upload Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/ticket-history"
              className="block hover:text-blue-600 cursor-pointer"
            >
              Ticket History
            </Link>
          </li>

          <li>
            <Link
              to="/get-ticket"
              className="block hover:text-blue-600 cursor-pointer"
            >
              Get Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/update-profile"
              className="block hover:text-blue-600 cursor-pointer"
            >
              Update Profile
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">

        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">

          {/* Left: Burger */}
          <button onClick={() => setOpen(true)}>
            <Menu size={28} className="cursor-pointer" />
          </button>

          {/* Center Title */}
          <h1 className="text-3xl font-bold text-gray-800">TicketMate</h1>

          {/* Placeholder for spacing (keeps title centered) */}
          <div className="w-7"></div>
        </div>

        {/* Cards Section */}
        <div className="p-10 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">

            <div className="bg-white shadow-xl p-10 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-2xl font-semibold">Active Users</h3>
              <p className="text-6xl font-bold text-blue-600 mt-6">128</p>
            </div>

            <div className="bg-white shadow-xl p-10 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-2xl font-semibold">Tickets Uploaded</h3>
              <p className="text-6xl font-bold text-green-600 mt-6">342</p>
            </div>

            <div className="bg-white shadow-xl p-10 rounded-2xl text-center hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-2xl font-semibold">Tickets Replaced</h3>
              <p className="text-6xl font-bold text-purple-600 mt-6">56</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
