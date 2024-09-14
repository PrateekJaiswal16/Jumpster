// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

//Register
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
      const newUser = new User({ username, password });
      await newUser.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    }
  });
  
  

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id } ,process.env.JWT_SECRET);
      res.json({ token, user: { username: user.username, highScore: user.highScore }});
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
