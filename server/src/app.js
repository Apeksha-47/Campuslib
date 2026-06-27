const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/books',       require('./routes/books'));
app.use('/api/members',     require('./routes/members'));
app.use('/api/circulation', require('./routes/circulation'));
app.use('/api/fines',       require('./routes/fines'));
app.use('/api/reports',     require('./routes/reports'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
