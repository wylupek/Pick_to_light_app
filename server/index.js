const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Middleware
app.use(cors())
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./data/database.db');


app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})

app.post('/api/values', (req, res) => {
      const productId = req.body.id; // Get the product ID from request body

      if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
      }

      db.all('SELECT value FROM product_values WHERE product_id = ?',
          [productId], (err, rows) => {
            if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database query failed' });
            } else if (rows.length === 0) {
                  res.status(404).json({ error: 'Product not found' });
            } else {
                  res.json(rows);
            }
      });
});

app.post('/api/products', (req, res) => {
      db.all('SELECT * FROM products',
          [], (err, rows) => {
            if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database query failed' });
            } else if (rows.length === 0) {
                  res.status(404).json({ error: 'Product not found' });
            } else {
                  res.json(rows);
            }
      });
});

app.post('/api/suppliers', (req, res) => {
      db.all('SELECT supp_id, supp_name FROM products GROUP BY supp_name',
          [], (err, rows) => {
            if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database query failed' });
            } else if (rows.length === 0) {
                  res.status(404).json({ error: 'Product not found' });
            } else {
                  res.json(rows);
            }
      });
});