import React, { useState, useEffect } from "react";
import CalendarView from "./components/CalendarView";
import RoomManager from "./components/RoomManager";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "https://your-backend-url.onrender.com";

function App() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const res = await axios.get(`${API_BASE}/api/rooms`);
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <h1>会議室予約システム</h1>
      <RoomManager rooms={rooms} refresh={fetchRooms} apiBase={API_BASE} />
      <CalendarView rooms={rooms} apiBase={API_BASE} />
    </div>
  );
}

export default App;