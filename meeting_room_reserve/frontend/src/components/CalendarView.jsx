import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CalendarView({ rooms, apiBase }) {
  const [reservations, setReservations] = useState([]);
  const [newRes, setNewRes] = useState({
    room_id: "",
    title: "",
    start: "",
    end: "",
    note: "",
  });

  const fetchReservations = async () => {
    const res = await axios.get(`${apiBase}/api/reservations`);
    setReservations(res.data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const addReservation = async () => {
    if (!newRes.room_id || !newRes.title || !newRes.start || !newRes.end) return;
    await axios.post(`${apiBase}/api/reservations`, newRes);
    setNewRes({ room_id: "", title: "", start: "", end: "", note: "" });
    fetchReservations();
  };

  const deleteReservation = async (id) => {
    await axios.delete(`${apiBase}/api/reservations/${id}`);
    fetchReservations();
  };

  // シンプルなテーブル表示
  return (
    <div>
      <h2>予約カレンダー（一覧）</h2>
      <table border="1">
        <thead>
          <tr>
            <th>会議室</th>
            <th>タイトル</th>
            <th>開始</th>
            <th>終了</th>
            <th>メモ</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{rooms.find((r) => r.id === res.room_id)?.name || ""}</td>
              <td>{res.title}</td>
              <td>{res.start}</td>
              <td>{res.end}</td>
              <td>{res.note}</td>
              <td>
                <button onClick={() => deleteReservation(res.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>新規予約</h3>
      <select
        value={newRes.room_id}
        onChange={(e) => setNewRes({ ...newRes, room_id: Number(e.target.value) })}
      >
        <option value="">会議室を選択</option>
        {rooms.map((room) => (
          <option value={room.id} key={room.id}>
            {room.name}
          </option>
        ))}
      </select>
      <input
        placeholder="タイトル"
        value={newRes.title}
        onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newRes.start}
        onChange={(e) => setNewRes({ ...newRes, start: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newRes.end}
        onChange={(e) => setNewRes({ ...newRes, end: e.target.value })}
      />
      <input
        placeholder="メモ"
        value={newRes.note}
        onChange={(e) => setNewRes({ ...newRes, note: e.target.value })}
      />
      <button onClick={addReservation}>予約追加</button>
    </div>
  );
}