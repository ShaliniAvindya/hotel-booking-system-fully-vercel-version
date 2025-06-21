const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const contactRoutes = require('../routes/contactRoutes');
const roomRoutes = require('../routes/roomRoutes');
const userRoutes = require('../routes/userRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const bookRoutes = require('../routes/bookingRoutes');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/notifications', notificationRoutes);

// Root and health check
app.get('/', (req, res) => {
  res.send('API is running. Try /api/health');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Hardcoded MongoDB connection string
const MONGO_URI = 'mongodb+srv://harithmadu:myhoteldb@cluster0.klue1z8.mongodb.net/hotel-booking?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
module.exports.handler = serverless(app);
