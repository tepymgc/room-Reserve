const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// 初回のみ：テーブル作成
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS reservations (id INTEGER PRIMARY KEY AUTOINCREMENT, roomId INTEGER, title TEXT, start TEXT, end TEXT)'
  );
});

// 会議室一覧取得
app.get('/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', (err, rows) => {
    res.json(rows);
  });
});

// 会議室追加
app.post('/rooms', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO rooms (name) VALUES (?)', [name], function (err) {
    res.json({ id: this.lastID, name });
  });
});

// 会議室削除
app.delete('/rooms/:id', (req, res) => {
  db.run('DELETE FROM rooms WHERE id=?', [req.params.id], function (err) {
    res.json({ success: true });
  });
});

// 予約一覧取得
app.get('/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', (err, rows) => {
    res.json(rows);
  });
});

// 予約追加
app.post('/reservations', (req, res) => {
  const { roomId, title, start, end } = req.body;
  db.run(
    'INSERT INTO reservations (roomId, title, start, end) VALUES (?, ?, ?, ?)',
    [roomId, title, start, end],
    function (err) {
      res.json({ id: this.lastID, roomId, title, start, end });
    }
  );
});

// 予約削除
app.delete('/reservations/:id', (req, res) => {
  db.run('DELETE FROM reservations WHERE id=?', [req.params.id], function (err) {
    res.json({ success: true });
  });
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});