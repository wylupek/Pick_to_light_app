const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Config
const config = require('./config');
const SECTOR_LENGTH = config.constants.SECTOR_LENGTH;
const SERVER_IP = config.server.ip;
const SERVER_PORT = config.server.port;
const SERVER_URL = config.server.url;
const db = new sqlite3.Database('./data/database.db');

app.listen(SERVER_PORT, SERVER_IP, () => {
    console.log(`server listening on ${SERVER_URL}`);
});

app.use('/data', express.static(path.join(__dirname, 'data/sectors')));

app.get('/', (req, res) => {
    res.send('Hello from server!');
});

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

app.post('/api/productByEan', (req, res) => {
    const { ean } = req.body;  // Extract the EAN from the request body

    db.all('SELECT supp_id, supp_name, ean, product_name FROM products WHERE ean = ?', [ean], (err, rows) => {
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
      return res.status(400).json({error: 'Product ID and Sector are required'});
    }

    db.all('SELECT client_id, value FROM product_values WHERE product_id = ? AND client_id between ? and ?',
        [productId, (sector - 1) * SECTOR_LENGTH + 1, sector * SECTOR_LENGTH],
        (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        } else if (rows.length === 0) {
            return res.status(404).json({ error: 'Values not found' });
        }

        const valuesToOutput = new Array(SECTOR_LENGTH).fill(0);
        rows.forEach(row => {
            const position = row.client_id - (sector - 1) * SECTOR_LENGTH;
            const value = row.value;
            if (position > 0 && position <= SECTOR_LENGTH) {
                valuesToOutput[position - 1] = value;
            }
        });

        const filePath = path.join(__dirname, '/data/sectors/sector' + sector.toString() + '.txt');
        fs.writeFile(filePath, valuesToOutput.join(' '), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write file' });
            }
            res.status(200).json({ message: 'File created successfully' });
        });
    });
});

app.post('/api/deleteById', (req, res) => {
    const { id } = req.body;

    db.serialize(() => {
        db.run('DELETE FROM product_values WHERE product_id = ?', [id], function(err) {
            if (err) {
                console.error('Failed to delete product values:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
        });

        db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Failed to delete product:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product successfully deleted' });
        });
    });
});