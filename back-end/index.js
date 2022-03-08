const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
// const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

// Connect DB
connectDB();

// ROUTES
app.use("/api/auth", require('./routes/auth'));
app.use("/api/auction", require('./routes/auction'));
app.use("/api/myarts", require('./routes/arts'));

app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}`);
})