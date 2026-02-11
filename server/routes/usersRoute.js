const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new User(req.body);
    await user.save();
    res.send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!passwordCorrect) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      data: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-logged-in-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    user.password = undefined;

    res.send({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset - WorkZen",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your WorkZen account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.send({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.body.token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
