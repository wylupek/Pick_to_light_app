const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const path_to_data = 'data/data.txt'


// Connect to the SQLite database
const db = new sqlite3.Database('./data/database.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

db.serialize(() => {
    // Drop the table if it exists
    db.run(`DROP TABLE IF EXISTS products`, (err) => {
        if (err) {
            console.error('Error dropping table', err);
        } else {
            console.log('Table dropped successfully');
        }
    });

    // Create the table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Table created successfully');
        }
    });

    // Read data from text file and insert into table
    const dataPath = path.join(__dirname, path_to_data);
    const data = fs.readFileSync(dataPath, 'utf8');

    // Split the data into rows and columns
    const rows = data.split('\r\n'); // For Windows newlines
    const stmt = db.prepare("INSERT INTO products (name, age) VALUES (?, ?)");
    rows.forEach(row => {
        if (row.trim()) { // Skip empty lines
            const columns = row.split(';');
            if (columns.length === 2) { // Ensure there are exactly two columns
                const name = columns[0].trim();
                const age = parseInt(columns[1].trim(), 10);
                if (!isNaN(age)) { // Check if age is a valid number
                    stmt.run(name, age);
                } else {
                    console.warn(`Skipping invalid age value: ${columns[1]}`);
                }
            } else {
                console.warn(`Skipping invalid row format: ${row}`);
            }
        }
    });
    stmt.finalize();
});

db.close((err) => {
    if (err) {
        console.error('Error closing database', err);
    } else {
        console.log('Database connection closed');
    }
});
