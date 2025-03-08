const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ Improved CORS for both local & deployed frontend
app.use(cors({
  origin: ["http://localhost:3000", "https://my-app.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Ensure MONGO_URI is set before connecting
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set. Check your environment variables.");
  process.exit(1);
}

// ✅ Improved MongoDB connection with debugging
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ Could not connect to MongoDB:', err);
  process.exit(1);
});

// ✅ Debug MongoDB Connection Route
app.get('/debug-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send('✅ MongoDB is connected!');
  } catch (err) {
    console.error('Database connection issue:', err);
    res.status(500).send('❌ MongoDB connection failed');
  }
});

// ✅ Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// ✅ Auth Routes (Register & Login)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Register User
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password are required');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).send('Error registering user');
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password are required');

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(400).send('Error logging in');
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
