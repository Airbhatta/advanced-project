import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/login.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    // Validate role
    const validRoles = ['customer', 'pharmacy', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role specified" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
    });

    // Don't send password back
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      phone: newUser.phone,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Don't send password back
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

export const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await User.find(
      { role: "pharmacy" },
      'name email address phone'
    );
    res.status(200).json({ 
      success: true, 
      count: pharmacies.length,
      pharmacies 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};