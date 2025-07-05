
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// Replace this with your own MongoDB Atlas connection string
//const mongoose = require("mongoose");

// ✅ Replace with your actual connection string from MongoDB Atlas
const MONGO_URI = "mongodb+srv://akhithesh:tiger@cluster0.lgjetqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// 👇 Now call connect with the correct value
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Connection error:", err));


  // ✅ CORRECT



// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashed });
    res.status(201).json({ message: "User registered" });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.json({ message: "Login successful" });
  } else {
    res.status(400).json({ error: "Invalid password" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
