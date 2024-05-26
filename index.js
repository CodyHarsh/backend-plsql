const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const createTables = require('./create_tables');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

app.get('/',(req, res) => {
    res.json({message: 'Welcome to the Backend'}); // Changed send.json to json
})
app.use('/auth', authRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/submissions', submissionRoutes);

//If you are creating the tables for the first time, uncomment the line below
//createTables();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
