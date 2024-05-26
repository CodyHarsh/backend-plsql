const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a new pool instance to manage the database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Get the database URL from environment variables
});

// Read the SQL script file
const sqlScriptPath = path.join(__dirname, 'sql', 'create_tables.sql');
const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

// Export the function to create tables
module.exports = async function createTables() {
    try {
        // Execute the SQL script
        await pool.query(sqlScript);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error executing SQL script:', error);
    } finally {
        // Close the database connection
        pool.end();
    }
};
