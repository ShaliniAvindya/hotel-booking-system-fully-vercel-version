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

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/notifications', notificationRoutes);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Wrapper handler that connects DB first
const handler = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

module.exports = handler;
