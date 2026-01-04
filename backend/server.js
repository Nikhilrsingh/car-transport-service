const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const authGoogle = require('./auth-google');

const app = express();

// CORS for frontend communication
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authGoogle);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
