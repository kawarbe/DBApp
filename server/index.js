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
  const { name } = req.body;
  const query = 'INSERT INTO game (name) VALUES (?)';
  connection.query(query, [name], (error, results) => {
    if (error) { 
      res.status(500).json({ success: false, error: error.message });
      return;
    }
    res.json({ success: true, message: 'Game added successfully' });
  });
});


app.get('/data', (req, res) => {
  connection.query("SELECT * FROM game", (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});




