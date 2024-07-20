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
    // Drop the table products if it exists
    db.run(`DROP TABLE IF EXISTS products`, (err) => {
        if (err) {
            console.error('Error dropping table "products"', err);
        } else {
            console.log('Table "products" dropped successfully');
        }
    });

    // Drop the table values if it exists
    db.run(`DROP TABLE IF EXISTS product_values`, (err) => {
        if (err) {
            console.error('Error dropping table "product_values"', err);
        } else {
            console.log('Table "product_values" dropped successfully');
        }
    });

    // Create the table for static columns
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supp_id TEXT,
        supp_name TEXT,
        ean TEXT,
        product_name TEXT,
        total_products INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating table "products"', err);
        } else {
            console.log('Table "products" created successfully');
        }
    });

   // Create the table for dynamic columns
    db.run(`CREATE TABLE IF NOT EXISTS product_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        value TEXT,
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating table "product_values"', err);
        } else {
            console.log('Table "product_values" created successfully');
        }
    });
    
    // Prepare statements
    const insertProductStmt = db.prepare("INSERT INTO products (supp_id, supp_name, ean, product_name, total_products) VALUES (?, ?, ?, ?, ?)");
    const insertProductValueStmt = db.prepare("INSERT INTO product_values (product_id, value) VALUES (?, ?)");

    // Start a transaction
    db.run('BEGIN TRANSACTION');

    // Read and process data
    const dataPath = path.join(__dirname, path_to_data);
    const data = fs.readFileSync(dataPath, 'utf8');
    const rows = data.split('\r\n'); // For Windows newlines

    // Function to handle insertion of product values
    const insertDynamicValues = (productId, dynamicValues) => {
        return new Promise((resolve, reject) => {
            let count = 0;
            dynamicValues.forEach(value => {
                if (value) { // Skip empty values
                    insertProductValueStmt.run(productId, value, (err) => {
                        if (err) {
                            console.error(`Error inserting value: ${err.message}`);
                            reject(err);
                        } else {
                            count++;
                        }
                        // Resolve once all values are processed
                        if (count === dynamicValues.length) {
                            resolve();
                        }
                    });
                }
            });
            if (dynamicValues.length === 0) resolve(); // Handle case where there are no dynamic values
        });
    };

    // Process each row
    const processRows = async () => {
        for (const row of rows) {
            if (row.trim()) { // Skip empty lines
                const columns = row.split(';');
                if (columns.length >= 5) { // Ensure there are at least 6 columns
                    const supp_id = columns[0].trim();
                    const supp_name = columns[1].trim();
                    const ean = columns[2].trim();
                    const product_name = columns[3].trim();
                    const total_products = parseInt(columns[4].trim(), 10);

                    if (!isNaN(total_products)) { // Check if total_products is a valid number
                        try {
                            await new Promise((resolve, reject) => {
                                insertProductStmt.run(supp_id, supp_name, ean, product_name, total_products, function(err) {
                                    if (err) {
                                        console.error(`Error inserting product: ${err.message}`);
                                        reject(err);
                                    } else {
                                        const productId = this.lastID;
                                        const dynamicValues = columns.slice(5).map(v => v.trim());
                                        insertDynamicValues(productId, dynamicValues).then(resolve).catch(reject);
                                    }
                                });
                            });
                        } catch (err) {
                            console.error(`Error processing row: ${err.message}`);
                        }
                    } else {
                        console.warn(`Skipping invalid total_products value: ${row}`);
                    }
                } else {
                    console.warn(`Skipping invalid row format: ${row}`);
                }
            }
        }
    };

    // Execute row processing and handle finalization
    processRows().then(() => {
        // Commit transaction
        db.run('COMMIT');
        // Finalize statements
        insertProductStmt.finalize();
        insertProductValueStmt.finalize();
        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }).catch(err => {
        console.error('Error processing rows:', err);
        db.run('ROLLBACK');
        insertProductStmt.finalize();
        insertProductValueStmt.finalize();
        db.close((err) => {
            if (err) {
                console.error('Error closing database', err);
            } else {
                console.log('Database connection closed');
            }
        });
    });
});