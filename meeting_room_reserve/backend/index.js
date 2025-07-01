const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./db.sqlite');

app.use(cors());
app.use(express.json());

// テーブル作成
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    title TEXT,
    start TEXT,
    end TEXT,
    note TEXT,
    FOREIGN KEY(room_id) REFERENCES rooms(id)
  )`);
});

// 会議室CRUD
app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', [], (err, rows) => res.json(rows));
});
app.post('/api/rooms', (req, res) => {
  db.run('INSERT INTO rooms (name) VALUES (?)', [req.body.name], function(err) {
    res.json({ id: this.lastID });
  });
});
app.delete('/api/rooms/:id', (req, res) => {
  db.run('DELETE FROM rooms WHERE id=?', [req.params.id], function(err) {
    res.json({ deleted: this.changes });
  });
});

// 予約CRUD
app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', [], (err, rows) => res.json(rows));
});
app.post('/api/reservations', (req, res) => {
  const { room_id, title, start, end, note } = req.body;
  db.run(
    'INSERT INTO reservations (room_id, title, start, end, note) VALUES (?, ?, ?, ?, ?)',
    [room_id, title, start, end, note],
    function(err) {
      res.json({ id: this.lastID });
    }
  );
});
app.put('/api/reservations/:id', (req, res) => {
  const { room_id, title, start, end, note } = req.body;
  db.run(
    'UPDATE reservations SET room_id=?, title=?, start=?, end=?, note=? WHERE id=?',
    [room_id, title, start, end, note, req.params.id],
    function(err) {
      res.json({ updated: this.changes });
    }
  );
});
app.delete('/api/reservations/:id', (req, res) => {
  db.run('DELETE FROM reservations WHERE id=?', [req.params.id], function(err) {
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));