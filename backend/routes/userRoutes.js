const express = require("express");
const router = express.Router();
const User = require("../model/user");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id); 
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
