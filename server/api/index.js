const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('../passport'); 
const roomRoutes = require('../routes/roomRoutes');
const userRoutes = require('../routes/userRoutes');
const notificationRoutes = require('../routes/notificationRoutes'); 
const bodyParser = require("body-parser");
const contactRoutes = require('../routes/contactRoutes'); 
const bookRoutes = require('../routes/bookingRoutes');
const serverlessExpress = require('@vendia/serverless-express');

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB connection (only once)
mongoose.connect(
  'mongodb+srv://harithmadu:myhoteldb@cluster0.klue1z8.mongodb.net/hotel-booking',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log('DB connect successful');
}).catch((err) => {
  console.error('DB connection error:', err);
});

// Export wrapped Express app for Vercel
module.exports = serverlessExpress({ app });
