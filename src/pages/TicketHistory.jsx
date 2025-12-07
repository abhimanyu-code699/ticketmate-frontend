import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { backend_url } from "../../utils/urlConfing";
import { Menu } from "lucide-react";

const TicketHistory = () => {
  const [open, setOpen] = useState(false); // sidebar
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("uploaded"); // uploaded or get_ticket
  const [checkingTicket, setCheckingTicket] = useState({}); // store loading per ticket
  const [statusMessage, setStatusMessage] = useState({}); // store message per ticket

  const fetchHistory = async () => {
    try {
      const token = Cookies.get("authToken");

      const res = await fetch(`${backend_url}/api/ticketHistory`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setHistory(data.history || []);
      } else {
        alert(data.message || "Failed to load history");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching ticket history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredTickets = history.filter(item =>
    selectedType === "uploaded" ? item.type === "uploaded" : item.type === "get_ticket"
  );

  // Call ticketStatus API for a selected ticket
  const checkTicketStatus = async (ticket) => {
    const token = Cookies.get("authToken");
    setCheckingTicket(prev => ({ ...prev, [ticket.id]: true }));
    setStatusMessage(prev => ({ ...prev, [ticket.id]: "" }));

    try {
      const res = await fetch(`${backend_url}/api/ticketStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: ticket.id,
          ticket_type: ticket.type
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update ticket status locally
        setHistory(prev =>
          prev.map(t =>
            t.id === ticket.id ? { ...t, status: data.ticket?.status || t.status } : t
          )
        );

        setStatusMessage(prev => ({
          ...prev,
          [ticket.id]: data.message || "Ticket found"
        }));
      } else {
        setStatusMessage(prev => ({
          ...prev,
          [ticket.id]: data.message || "No matching ticket found"
        }));
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(prev => ({
        ...prev,
        [ticket.id]: "Error checking ticket"
      }));
    } finally {
      setCheckingTicket(prev => ({ ...prev, [ticket.id]: false }));
    }
  };

  if (loading) return <div className="text-center mt-10 font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <h2 className="text-xl font-semibold p-4 border-b">Menu</h2>
        <ul className="p-4 space-y-4 text-lg">
          <li><a href="/dashboard" className="hover:text-blue-600">Dashboard</a></li>
          <li><a href="/upload-ticket" className="hover:text-blue-600">Upload Ticket</a></li>
          <li><a href="/ticket-history" className="hover:text-blue-600">Ticket History</a></li>
          <li><a href="/get-ticket" className="hover:text-blue-600">Get Ticket</a></li>
          <li><a href="/update-profile" className="hover:text-blue-600">Update Profile</a></li>
        </ul>
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <div className="flex-1">
        <div className="flex items-center justify-between p-4 bg-white shadow-md mb-6">
          <button onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">TicketMate</h1>
          <div className="w-7"></div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Ticket History</h2>

        {/* Ticket Type Cards */}
        <div className="flex space-x-6 mb-6">
          <div
            className={`flex-1 p-6 rounded-xl shadow-lg cursor-pointer text-center transition-all ${
              selectedType === "uploaded" ? "bg-blue-600 text-white scale-105" : "bg-white text-gray-800 hover:scale-105"
            }`}
            onClick={() => setSelectedType("uploaded")}
          >
            <h3 className="text-xl font-semibold mb-2">Uploaded Tickets</h3>
            <p>{history.filter(h => h.type === "uploaded").length} Tickets</p>
          </div>

          <div
            className={`flex-1 p-6 rounded-xl shadow-lg cursor-pointer text-center transition-all ${
              selectedType === "get_ticket" ? "bg-blue-600 text-white scale-105" : "bg-white text-gray-800 hover:scale-105"
            }`}
            onClick={() => setSelectedType("get_ticket")}
          >
            <h3 className="text-xl font-semibold mb-2">Get Tickets</h3>
            <p>{history.filter(h => h.type === "get_ticket").length} Tickets</p>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 font-semibold">No {selectedType === "uploaded" ? "Uploaded" : "Get"} Tickets Found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
                onClick={() => selectedType === "uploaded" && checkTicketStatus(ticket)}
              >
                <p className="font-semibold text-gray-600 mb-1">Ticket ID: <span className="text-gray-800 font-bold">{`TKT-${ticket.id}`}</span></p>
                <p className="text-gray-600 mb-1">Boarding: <span className="text-gray-800">{ticket.boarding_station}</span></p>
                <p className="text-gray-600 mb-1">Destination: <span className="text-gray-800">{ticket.destination_station}</span></p>
                <p className="text-gray-600 mb-1">Departure: <span className="text-gray-800">{ticket.departure_date}</span></p>
                <p className="text-gray-600 mb-1">Class: <span className="text-gray-800">{ticket.travel_class}</span></p>
                <p className="text-gray-600 mb-1">Status: <span className="text-gray-800 capitalize">{ticket.status}</span></p>

                {/* API status message */}
                {checkingTicket[ticket.id] ? (
                  <p className="mt-2 text-blue-600 font-semibold">Checking ticket status...</p>
                ) : statusMessage[ticket.id] ? (
                  <p className="mt-2 text-green-600 font-semibold">{statusMessage[ticket.id]}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketHistory;
