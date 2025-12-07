import React, { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FileUp,
  History,
  Tickets,
  Users,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 via-white to-indigo-50">

      {/* Background Image */}
      <div
         className="fixed inset-0 bg-cover bg-center bg-no-repeat  opacity-70"
        style={{
          backgroundImage: `url('../assets/bg-dashboard.jpg')`,
        }}
      ></div>
      {/* Overlay to make text readable */}
       <div className="fixed inset-0"></div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64
        bg-white/80 backdrop-blur-xl
        border-r border-indigo-100 shadow-xl
        transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 z-50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-700">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-indigo-100 transition"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-2 text-md">
          <li>
            <Link
              to="/upload-ticket"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-indigo-600 hover:text-white transition-all "
            >
              <FileUp size={20} />
              Upload Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/ticket-history"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-indigo-600 hover:text-white transition-all "
            >
              <History size={20} />
              Ticket History
            </Link>
          </li>

          <li>
            <Link
              to="/get-ticket"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-indigo-600 hover:text-white transition-all "
            >
              <Tickets size={20} /> Get Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/update-profile"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-indigo-600 hover:text-white transition-all "
            >
              <Users size={20} /> Update Profile
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4  backdrop-blur-xl shadow-sm border-b border-gray-100 rounded-b-2xl">
          {/* Left: Burger */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={32} className="text-gray-700" />
          </button>

          {/* Center Title */}
          <h1 className="relative text-3xl font-extrabold bg-gradient-to-r from-indigo-700 via-blue-500 to-indigo-700 text-transparent bg-clip-text tracking-tight leading-none">
            TicketMate
            <span className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg blur-sm"></span>
          </h1>

          {/* Placeholder for spacing */}
          <div className="w-10"></div>
        </div>
        {/* Cards Section */}
        <div className="px-6 py-12 flex justify-center">
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl w-full ml-auto">
            {/* Card 1 */}
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Shine Effect */}
              <div className="absolute -inset-20 bg-gradient-to-r from-indigo-300/10 to-blue-300/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Glow Border */}
              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-300/40 transition-all duration-300"></div>

              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md group-hover:scale-110 transition-transform duration-300"><Users size={32} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold mt-6 text-gray-800">
                Active Users
              </h3>
              <p className="text-6xl font-extrabold mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text tracking-tight animate-pulse">
                128
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute -inset-20 bg-gradient-to-r from-emerald-300/10 to-green-300/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-emerald-300/40 transition-all duration-300"></div>

              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Tickets size={32} />
              </div>

              <h3 className="text-xl font-semibold mt-6 text-gray-800">
                Tickets Uploaded
              </h3>
              <p className="text-6xl font-extrabold mt-4 bg-gradient-to-r from-emerald-600 to-green-600 text-transparent bg-clip-text tracking-tight animate-bounce">
                342
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute -inset-20 bg-gradient-to-r from-pink-300/10 to-purple-300/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-pink-300/40 transition-all duration-300"></div>

              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <RefreshCcw size={32} />
              </div>

              <h3 className="text-xl font-semibold mt-6 text-gray-800">
                Tickets Replaced
              </h3>
              <p className="text-6xl font-extrabold mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text tracking-tight animate-pulse">
                56
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
