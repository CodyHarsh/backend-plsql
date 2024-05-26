const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const createTables = require('./create_tables');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/submissions', submissionRoutes);

//If you are creating the tables for the first time, uncomment the line below
//createTables();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
