const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: `${process.env.DB_HOST}`, 
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`
});

const PORT =  5000; 
app.listen(PORT, () => {
  console.log(`サーバー動作中 ポート番号: ${PORT}`);
});


app.post('/add', (req, res) => {
  const { name, userId } = req.body;
  const query = 'INSERT INTO games (name, user_id) VALUES (?, ?)';
  connection.query(query, [name, userId], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }
    res.json({ success: true, message: 'Game added successfully' });
  });
});


app.get('/data/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM games WHERE user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});


app.post('/addUser', (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ success: false, error: 'ユーザー名がないです' });
    return;
  }
  const query = 'INSERT INTO users (username) VALUES (?)';
  connection.query(query, [username], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }
    res.json({ success: true, message: 'User added successfully' });
  });
});


app.get('/users', (req, res) => {

  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});


app.delete('/delete/:id', (req, res) => {
  const gameId = req.params.id;

  if (!gameId) {
    res.status(400).json({ success: false, error: 'Game ID is required' });
    return;
  }

  const query = 'DELETE FROM games WHERE id = ?';
  connection.query(query, [gameId], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }
    res.json({ success: true, message: 'Game deleted successfully' });
  });
});




