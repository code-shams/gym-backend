const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//? Health check route
app.get('/', (req, res) => res.send('Gym API Running'));

module.exports = app;
