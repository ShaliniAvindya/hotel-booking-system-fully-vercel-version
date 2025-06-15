const express = require('express');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, contact_number } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      contact_number,
      isAdmin: false,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// Update user info
router.put('/:id', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User updated successfully', user: { id: user.id, name: user.name } }); 
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Update admin status
router.patch('/:id/admin', async (req, res) => {
  const { isAdmin } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ message: 'Admin status updated successfully', user: { id: user.id, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({ message: 'Error updating admin status', error });
  }
});

module.exports = router;
