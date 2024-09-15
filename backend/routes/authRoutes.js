const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// Sign up Route
// Sign up Route
router.post("/signup", async (req, res) => {
  console.log(req.body); // Log the request body
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, email, password, isNewUser: true });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error });
  }
});

// Login Route
// Login Route
// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    console.log('User before login:', user); // Add this log

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        console.log('Sending response:', { token, isNewUser: user.isNewUser }); // Add this log
        res.json({ token, isNewUser: user.isNewUser });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Error in login", error: error.message });
  }
});


router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const onboardingData = req.body;

    console.log('Received onboarding data:', onboardingData);
    console.log('User ID:', userId);

    const user = await User.findByIdAndUpdate(
      userId,
      { ...onboardingData, isNewUser: false },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updated user:', user);
    res.json({ message: 'Onboarding data saved successfully', user });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Error saving onboarding data', error: error.message });
  }
});





module.exports = router;
