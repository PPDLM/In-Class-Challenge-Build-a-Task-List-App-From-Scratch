require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
