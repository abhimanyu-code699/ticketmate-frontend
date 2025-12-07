import React, { useState } from "react";
import Cookies from "js-cookie";
import { Menu } from "lucide-react";
import { backend_url } from "../../utils/urlConfing";

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
    <div className="min-h-screen flex bg-gradient-to-b from-white to-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <h2 className="text-xl font-semibold p-4 border-b">Menu</h2>
        <ul className="p-4 space-y-4 text-lg">
          <li>
            <a href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/upload-ticket" className="hover:text-blue-600">
              Upload Ticket
            </a>
          </li>
          <li>
            <a href="/ticket-history" className="hover:text-blue-600">
              Ticket History
            </a>
          </li>
          <li>
            <a href="/get-ticket" className="hover:text-blue-600">
              Get Ticket
            </a>
          </li>
          <li>
            <a href="/update-profile" className="hover:text-blue-600">
              Update Profile
            </a>
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
        {/* Navbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
          <button onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">TicketMate</h1>
          <div className="w-7"></div>
        </div>

        {/* Page Heading */}
        <div className="text-center mt-10">
          <h2 className="text-4xl font-bold text-gray-700">Upload Ticket</h2>
        </div>

        {/* Form */}
        <div className="flex justify-center mt-10 px-4 pb-20">
          <form
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Boarding Station */}
            <div className="relative">
              <label className="block text-lg font-medium mb-2">
                Boarding Station
              </label>
              <input
                type="text"
                value={boarding}
                onChange={handleBoardingChange}
                placeholder="Search station..."
                className="w-full p-3 border rounded-xl"
                required
              />
              {boardingSuggestions.length > 0 && (
                <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {boardingSuggestions.map((station, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => selectBoarding(station)}
                    >
                      {station.stationName} ({station.stationCode})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination Station */}
            <div className="relative">
              <label className="block text-lg font-medium mb-2">
                Destination Station
              </label>
              <input
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Search station..."
                className="w-full p-3 border rounded-xl"
                required
              />
              {destinationSuggestions.length > 0 && (
                <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((station, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => selectDestination(station)}
                    >
                      {station.stationName} ({station.stationCode})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-lg font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-xl"
                required
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-lg font-medium mb-2">Class</label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full p-3 border rounded-xl"
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
            <div>
              <label className="block text-lg font-medium mb-2">
                Upload Ticket
              </label>
              <input
                type="file"
                className="w-full p-3 border rounded-xl bg-gray-50"
                onChange={(e) => setTicketFile(e.target.files[0])}
                required
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button className="bg-blue-600 text-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700">
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
