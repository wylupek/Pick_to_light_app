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

app.get('/api/list', (req, res) => {
      res.send("Test");
})

app.post('/api/products', (req, res) => {
      const productId = req.body.id; // Get the product ID from request body

      if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
      }

      db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
            if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Database query failed' });
            } else if (!row) {
                  res.status(404).json({ error: 'Product not found' });
            } else {
                  res.json(row);
            }
      });
});