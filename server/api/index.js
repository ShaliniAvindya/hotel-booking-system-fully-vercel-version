const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('../passport');
const roomRoutes = require('../routes/roomRoutes');
const userRoutes = require('../routes/userRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const bodyParser = require('body-parser');
const contactRoutes = require('../routes/contactRoutes');
const bookRoutes = require('../routes/bookingRoutes');
const serverless = require('serverless-http');

const app = express();
app.use(bodyParser.json());
app.use('/api/contact', contactRoutes);

// Use CORS for cross-origin requests
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));

// Middleware to parse JSON data
app.use(express.json());

// Enable session for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is up and running' });
});

// Connect to MongoDB (runs on cold start)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://harithmadu:myhoteldb@cluster0.klue1z8.mongodb.net/hotel-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected successfully'))
.catch((err) => console.error('DB connection error:', err));

module.exports = app;
module.exports.handler = serverless(app);
