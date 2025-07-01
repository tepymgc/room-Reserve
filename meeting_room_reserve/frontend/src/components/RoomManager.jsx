import React, { useState } from "react";
import axios from "axios";

export default function RoomManager({ rooms, refresh, apiBase }) {
  const [roomName, setRoomName] = useState("");

  const addRoom = async () => {
    if (!roomName) return;
    await axios.post(`${apiBase}/api/rooms`, { name: roomName });
    setRoomName("");
    refresh();
  };

  const deleteRoom = async (id) => {
    await axios.delete(`${apiBase}/api/rooms/${id}`);
    refresh();
  };

  return (
    <div>
      <h2>会議室一覧</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}
            <button onClick={() => deleteRoom(room.id)}>削除</button>
          </li>
        ))}
      </ul>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="新しい会議室名"
      />
      <button onClick={addRoom}>追加</button>
    </div>
  );
}