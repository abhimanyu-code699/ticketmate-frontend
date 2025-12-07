import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Menu,
  X,
  LayoutDashboard,
  FileUp,
  History,
  Tickets,
  Users,
  PlaneLanding,
  MapPinCheck,
  Calendar1,
  Sofa,
} from "lucide-react";
import { Link } from "react-router-dom";

import { backend_url } from "../../utils/urlConfing";

const GetTicket = () => {
  const [open, setOpen] = useState(false);

  // Autocomplete States
  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState("");
  const [boardingSuggestions, setBoardingSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Form States
  const [date, setDate] = useState("");
  const [travelClass, setTravelClass] = useState("");

  const fetchStations = (query, type) => {
    if (!query.trim()) {
      type === "boarding"
        ? setBoardingSuggestions([])
        : setDestinationSuggestions([]);
      return;
    }

    clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${backend_url}/api/get-station-codes?q=${query}`
        );
        const stations = await res.json();
        if (type === "boarding") setBoardingSuggestions(stations);
        else setDestinationSuggestions(stations);
      } catch (err) {
        console.error("Station fetch error:", err);
      }
    }, 300);

    setDebounceTimer(timer);
  };

  const handleBoardingChange = (e) => {
    setBoarding(e.target.value);
    fetchStations(e.target.value, "boarding");
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchStations(e.target.value, "destination");
  };

  const selectBoarding = (station) => {
    setBoarding(`${station.stationName} (${station.stationCode})`);
    setBoardingSuggestions([]);
  };

  const selectDestination = (station) => {
    setDestination(`${station.stationName} (${station.stationCode})`);
    setDestinationSuggestions([]);
  };

  // ⭐ SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("authToken");

    const payload = {
      boarding_station: boarding,
      destination_station: destination,
      departure_date: date,
      travel_class: travelClass,
    };

    try {
      const res = await fetch(`${backend_url}/api/getTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ⭐ Always show the actual backend message
      if (data.message) {
        alert(data.message);
      } else {
        alert("Unexpected response");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      // ⭐ ALWAYS CLEAR INPUTS — SUCCESS OR FAIL
      setBoarding("");
      setDestination("");
      setDate("");
      setTravelClass("");

      // ⭐ CLEAR AUTOCOMPLETE LISTS
      setBoardingSuggestions([]);
      setDestinationSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64
            bg-gradient-to-b from-indigo-50 via-white to-indigo-50
            border-r border-indigo-100
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
            transform ${
              open ? "translate-x-0" : "-translate-x-full"
            } transition-all duration-300 z-50`}
      >
        <div className="flex items-center justify-between p-5 border-b border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-indigo-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="p-4 space-y-2 text-md">
          <li>
            <Link
              to="/upload-ticket"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 font-medium hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/upload-ticket"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 font-medium hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200"
            >
              <FileUp size={20} />
              Upload Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/ticket-history"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 font-medium hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200"
            >
              <History size={20} />
              Ticket History
            </Link>
          </li>

          <li>
            <Link
              to="/get-ticket"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 font-medium hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200"
            >
              <Tickets size={20} /> Get Ticket
            </Link>
          </li>

          <li>
            <Link
              to="/update-profile"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 font-medium hover:bg-indigo-200 hover:text-indigo-700 transition-all duration-200"
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div
          className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between
              bg-white/80 backdrop-blur-xl
              border-b border-indigo-100
              shadow-sm
            "
        >
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-indigo-100 transition"
          >
            <Menu size={32} className="text-indigo-700" />
          </button>

          <h1
            className="text-3xl font-extrabold
                bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700
                text-transparent bg-clip-text tracking-tight
              "
          >
            TicketMate
          </h1>
          <div className="w-8"></div>
        </div>
        {/* Page Header */}
        <div className="flex items-center justify-center gap-4 mt-14">
          {/* Icon Badge */}
          <div
            className="w-12 h-12 flex items-center justify-center rounded-2xl
    bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
          >
            <Tickets size={32} />
          </div>

          {/* Title + Subtitle */}
          <div className="text-left">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-transparent bg-clip-text tracking-tight">
              Request a Ticket
            </h2>
            <p className="text-gray-500 text-sm">
              Find unused tickets shared by travellers
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex justify-center mt-14 px-4 pb-24">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-xl border border-indigo-100
      rounded-3xl shadow-xl w-full max-w-3xl p-10 space-y-8"
          >
            {/* Boarding Station */}
            <div className="space-y-2">
              <label className="block text-md font-semibold text-gray-800">
                <span className="inline-block mr-2">
                  <PlaneLanding size={25} />
                </span>
                Boarding Station
              </label>

              <input
                type="text"
                value={boarding}
                onChange={handleBoardingChange}
                placeholder="Search station..."
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white
          focus:outline-none focus:border-indigo-500"
                required
              />

              {boardingSuggestions.length > 0 && (
                <ul className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {boardingSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="p-3 cursor-pointer hover:bg-indigo-100 text-gray-700"
                      onClick={() => selectBoarding(s)}
                    >
                      {s.stationName} ({s.stationCode})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination Station */}
            <div className="space-y-2">
              <label className="block text-md font-semibold text-gray-800">
                <span className="inline-block mr-2">
                  <MapPinCheck size={25} />
                </span>
                Destination Station
              </label>

              <input
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Search station..."
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white
          focus:outline-none focus:border-indigo-500"
                required
              />

              {destinationSuggestions.length > 0 && (
                <ul className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="p-3 cursor-pointer hover:bg-indigo-100 text-gray-700"
                      onClick={() => selectDestination(s)}
                    >
                      {s.stationName} ({s.stationCode})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-md font-semibold text-gray-800">
                <span className="inline-block mr-2">
                  <Calendar1 size={25} />
                </span>
                Travel Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white
          focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <label className="block text-md font-semibold text-gray-800">
                <span className="inline-block mr-2">
                  <Sofa size={25} />
                </span>
                Class
              </label>

              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl bg-white
          focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select Class</option>
                <option>General</option>
                <option>Sleeper</option>
                <option>AC Chair Car</option>
                <option>AC 3 Tier</option>
                <option>AC 2 Tier</option>
                <option>First Class</option>
              </select>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white
          px-10 py-4 rounded-2xl text-lg font-semibold shadow-md
          hover:bg-indigo-700"
              >
                Request Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetTicket;
