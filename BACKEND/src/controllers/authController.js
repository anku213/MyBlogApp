const User = require("../models/userModel");
const { generateToken } = require("../utils/tokenUtils");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      status: 200,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
      }

    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: 200,
      message: "Logged in successfully.",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      token, 
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { registerUser, loginUser };