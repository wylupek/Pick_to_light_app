const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Middleware
app.use(cors())
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./data/database.db');
const MAX_SIZE = 50;

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.listen(8080, '192.168.1.100', () => {
      console.log('server listening on port 8080')
})

app.post('/api/productsBySupplierId', (req, res) => {
      const supplierId = req.body.id;

      if (!supplierId) {
            return res.status(400).json({ error: 'Supplier ID is required' });
      }

      db.all('SELECT id, ean, product_name FROM products WHERE supp_id = ?',
          [supplierId], (err, rows) => {
                if (err) {
                      console.error(err);
                      res.status(500).json({ error: 'Database query failed' });
                } else if (rows.length === 0) {
                      res.status(404).json({ error: 'Supplier not found' });
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

app.post('/api/displaySector', (req, res) => {
      const { productId, sector } = req.body.json;
      if (!sector || !productId) {
            return res.status(400).json({ error: 'Product ID and Sector is required' });
      }

      db.all('SELECT value FROM product_values WHERE product_id = ?',
          [productId], (err, rows) => {
                if (err) {
                      console.error(err);
                      return res.status(500).json({ error: 'Database query failed' });
                } else if (rows.length === 0) {
                      return res.status(404).json({ error: 'Values not found' });
                }
                const values = rows.map(row => row.value).join(' ');

                const valuesToOutput = new Array(MAX_SIZE).fill(0);
                values.split(' ').forEach(pair => {
                      const [position, value] = pair.split('-').map(Number);
                      if (position > 0 && position <= MAX_SIZE) {
                            valuesToOutput[position - 1] = value;
                      }
                });

                const filePath = path.join(__dirname, '/data/sectors', sector.toString() + '.txt');
                fs.writeFile(filePath, valuesToOutput.join(' '), (err) => {
                      if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Failed to write file' });
                      }
                      res.status(200).json({ message: 'File created successfully' });
                });
          });
});