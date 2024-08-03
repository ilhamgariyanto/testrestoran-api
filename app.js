const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'data', // tolong ubah sesaui data sql
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

// POST /orders
app.post('/orders', (req, res) => {
  const { table_id, items } = req.body;

  if (!table_id || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  // Masukkan data ke tabel orders
  items.forEach((item) => {
    const { item_id, quantity } = item;
    const sql = 'INSERT INTO orders (table_id, item_id, quantity) VALUES (?, ?, ?)';
    db.query(sql, [table_id, item_id, quantity], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });
  });

  // Distribusi printer berdasarkan kategori item
  const printers = {
    A: [], // Printer Kasir
    B: [], // Printer Dapur
    C: [], // Printer Bar
  };

  // Masukkan item untuk printer
  const queries = items.map((item) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT category, name FROM products WHERE id = ?';
      db.query(sql, [item.item_id], (err, results) => {
        if (err) return reject(err);
        const category = results[0].category;
        const itemName = results[0].name;
        if (category === 'Makanan') {
          printers['B'].push({ itemName, quantity: item.quantity });
        } else if (category === 'Minuman') {
          printers['C'].push({ itemName, quantity: item.quantity });
        }
        resolve();
      });
    });
  });

  // Tunggu semua query selesai
  Promise.all(queries)
    .then(() => {
      res.json({ message: 'Order received', printers });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// GET /bill/:table_id
app.get('/bill/:table_id', (req, res) => {
  const table_id = req.params.table_id;

  const sql = `
    SELECT p.name, o.quantity, p.price
    FROM orders o
    JOIN products p ON o.item_id = p.id
    WHERE o.table_id = ?
  `;
  db.query(sql, [table_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const items = results.map((row) => ({
      name: row.name,
      quantity: row.quantity,
      price: row.price,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ table_id, items, total });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
