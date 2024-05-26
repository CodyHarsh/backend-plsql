const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString
});

// Log successful connection
pool.on('connect', () => {
    console.log('Connected to Neon database!');
});

// Log errors in the pool
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Function to establish database connection
async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Connected to the database!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(-1);
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    connectToDatabase
};
