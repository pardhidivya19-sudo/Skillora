const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpStore = require("../utils/otpStore");

// ==================== SEND OTP ====================
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter valid email id" });
    }

    // ✅ CHECK IF ALREADY REGISTERED
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔥 OTP GENERATE
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ STORE OTP WITH EXPIRY (5 min)
    otpStore[email] = {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ==================== VERIFY OTP ====================
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (
    otpStore[email] &&
    otpStore[email].code == otp &&
    otpStore[email].expires > Date.now()
  ) {
    otpStore[email] = "verified";
    return res.json({ message: "OTP verified" });
  }

  res.status(400).json({ message: "Invalid or expired OTP" });
};


// ==================== FINAL REGISTER ====================
const registerAfterOTP = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // ✅ OTP CHECK
    if (otpStore[email] !== "verified") {
      return res.status(400).json({ message: "OTP not verified" });
    }

    // ================= VALIDATION =================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    // ✅ NAME
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    // ✅ EMAIL
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ PHONE
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // ✅ PASSWORD
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and min 8 characters"
      });
    }

    // ================= DUPLICATE CHECK =================
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPhone = await pool.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );

    if (existingPhone.rows.length > 0) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, name, email, role`,
      [name, email, phone, hashedPassword, role]
    );

    // 🔥 CLEAN OTP
    delete otpStore[email];

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].user_id,
        name: user.rows[0].name,
        role: user.rows[0].role,
        approval_status: user.rows[0].approval_status,
        rejection_reason: user.rows[0].rejection_reason
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      approval_status: user.rows[0].approval_status,
      rejection_reason: user.rows[0].rejection_reason
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  registerAfterOTP,
  login
};