import React, { useState } from "react";
import Cookies from "js-cookie";
import { Menu,X,LayoutDashboard,FileUp,History,Tickets,Users  } from "lucide-react";
import { backend_url } from "../../utils/urlConfing";
import { Link } from "react-router-dom";

const UploadTicket = () => {
  const [open, setOpen] = useState(false);

  // Autocomplete States
  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState("");

  const [boardingSuggestions, setBoardingSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [debounceTimer, setDebounceTimer] = useState(null);

  // NEW STATES
  const [date, setDate] = useState("");
  const [travelClass, setTravelClass] = useState("");
  const [ticketFile, setTicketFile] = useState(null);

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
        const response = await fetch(
          `${backend_url}/api/get-station-codes?q=${query}`
        );
        const stations = await response.json();

        if (type === "boarding") {
          setBoardingSuggestions(stations);
        } else {
          setDestinationSuggestions(stations);
        }
      } catch (err) {
        console.error("Station fetch error:", err);
      }
    }, 300);

    setDebounceTimer(timer);
  };

  const handleBoardingChange = (e) => {
    const value = e.target.value;
    setBoarding(value);
    fetchStations(value, "boarding");
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    fetchStations(value, "destination");
  };

  const selectBoarding = (station) => {
    setBoarding(`${station.stationName} (${station.stationCode})`);
    setBoardingSuggestions([]);
  };

  const selectDestination = (station) => {
    setDestination(`${station.stationName} (${station.stationCode})`);
    setDestinationSuggestions([]);
  };

  // ⭐ NEW → FORM SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketFile) {
      alert("Please upload a ticket file");
      return;
    }

    const token = Cookies.get("authToken");

    const formData = new FormData();
    formData.append("boarding_station", boarding);
    formData.append("destination_station", destination);
    formData.append("departure_date", date);
    formData.append("travel_class", travelClass);
    formData.append("ticket", 1);
    formData.append("ticketFile", ticketFile);

    try {
      const response = await fetch(`${backend_url}/api/upload-ticket`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ticket uploaded successfully!");

        // ⭐ CLEAR INPUT FIELDS
        setBoarding("");
        setDestination("");
        setDate("");
        setTravelClass("");
        setTicketFile(null);

        // Clear file input
        document.getElementById("ticketInput").value = "";
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
  <div className="min-h-screen flex bg-gradient-to-br from-sky-50 via-white to-indigo-50">
    
    {/* Sidebar */}
    <div
      className={`fixed top-0 left-0 h-full w-64
        bg-white/80 backdrop-blur-xl
        border-r border-indigo-100 shadow-xl
        transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 z-50`}
    >
      <div className="flex items-center justify-between p-5 border-b border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-700">Menu</h2>
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-lg hover:bg-indigo-100 transition"
        >
          <X size={22} className="text-gray-600" />
        </button>
      </div>

      <ul className="p-4 space-y-1 text-md">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium
              hover:bg-indigo-600 hover:text-white transition-all"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/upload-ticket"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-indigo-600 font-semibold bg-indigo-100 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <FileUp size={20} /> Upload Ticket
          </Link>
        </li>
        <li>
          <Link
            to="/ticket-history"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium
              hover:bg-indigo-600 hover:text-white transition-all"
          >
            <History size={20} /> Ticket History
          </Link>
        </li>
        <li>
          <Link
            to="/get-ticket"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium 
              hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Tickets size={20} /> Get Ticket
          </Link>
        </li>
        <li>
          <Link
            to="/update-profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 font-medium
              hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Users size={20} /> Update Profile
          </Link>
        </li>
      </ul>
    </div>

    {open && (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setOpen(false)}
      />
    )}

    {/* Main Content */}
    <div className="flex-1 flex flex-col">

      {/* Navbar */}
      <div
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between
          bg-white/80 backdrop-blur-xl border-b border-indigo-100 shadow-sm"
      >
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-indigo-100 transition"
        >
          <Menu size={34} className="text-indigo-700" />
        </button>

        <h1
          className="text-3xl font-extrabold 
          bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700
          text-transparent bg-clip-text tracking-tight"
        >
          TicketMate
        </h1>

        <div className="w-8"></div>
      </div>

      {/* Page Heading */}
      <div className="text-center mt-14">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text tracking-tight">
          Upload Ticket
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Share your unused train tickets with others ✨
        </p>
      </div>

      {/* FORM SECTION */}
      <div className="flex justify-center mt-14 pb-24 px-6">
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-3xl p-10 space-y-8
            bg-white/70 backdrop-blur-2xl border border-indigo-100
            rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.05)]
            hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)]
            transition-all duration-500"
        >
          {/* Glow strip */}
          <div className="absolute -top-1 left-10 right-10 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>

          {/* Boarding Station */}
          <div className="relative animate-fadeIn">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Boarding Station
            </label>
            <input
              type="text"
              value={boarding}
              onChange={handleBoardingChange}
              placeholder="Search Station..."
              className="w-full p-4 text-gray-700 border border-gray-200 rounded-2xl
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                outline-none transition-all"
              required
            />

            {boardingSuggestions.length > 0 && (
              <ul className="absolute w-full bg-white border rounded-xl mt-2 shadow-xl z-50 max-h-64 overflow-y-auto animate-fadeIn">
                {boardingSuggestions.map((station, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-indigo-100 cursor-pointer text-gray-700
                      transition-all"
                    onClick={() => selectBoarding(station)}
                  >
                    {station.stationName} ({station.stationCode})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Station */}
          <div className="relative animate-fadeIn delay-150">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Destination Station
            </label>
            <input
              type="text"
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Search Station..."
              className="w-full p-4 text-gray-700 border border-gray-200 rounded-2xl
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                outline-none transition-all"
              required
            />

            {destinationSuggestions.length > 0 && (
              <ul className="absolute w-full bg-white border rounded-xl mt-2 shadow-xl z-50 max-h-64 overflow-y-auto animate-fadeIn">
                {destinationSuggestions.map((station, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-indigo-100 cursor-pointer text-gray-700
                      transition-all"
                    onClick={() => selectDestination(station)}
                  >
                    {station.stationName} ({station.stationCode})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date */}
          <div className="animate-fadeIn delay-200">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                outline-none transition-all"
              required
            />
          </div>

          {/* Class */}
          <div className="animate-fadeIn delay-300">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Class
            </label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                outline-none transition-all"
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

          {/* Upload */}
          <div className="animate-fadeIn delay-400">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Upload Ticket
            </label>
            <input
              id="ticketInput"
              type="file"
              onChange={(e) => setTicketFile(e.target.files[0])}
              className="w-full p-4 border border-gray-200 rounded-2xl
                bg-gray-50 focus:border-indigo-500 focus:ring-2
                focus:ring-indigo-200 outline-none transition-all"
              required
            />
          </div>

          {/* Submit */}
          <div className="text-center animate-fadeIn delay-500">
            <button
              className="bg-gradient-to-r from-indigo-600 to-blue-600 
                text-white px-14 py-4 rounded-2xl text-lg font-semibold
                hover:scale-110 transition-transform shadow-xl"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default UploadTicket;
