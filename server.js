const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Register User
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Send success response
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err); // Log the error
    res.status(400).send('Error registering user');
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Send the token in the response
    res.header('auth-token', token).send(token);
  } catch (err) {
    console.error('Error logging in:', err); // Log the error
    res.status(400).send('Error logging in');
  }
});

// Protected Route (Example)
app.get('/user', async (req, res) => {
  try {
    // Get the token from the header
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).send('Access denied');
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(verified._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the user data in the response
    res.send(user);
  } catch (err) {
    console.error('Error fetching user:', err); // Log the error
    res.status(400).send('Invalid token');
  }
});

// Test Database Connection
app.get('/test-db', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error('Database error:', err); // Log the error
    res.status(500).send('Database error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));