const pool = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { provider_id, skill_id, booking_date, start_time, end_time, total_amount } = req.body;

    // 1️⃣ Check slot conflict
    const conflict = await pool.query(
      `
      SELECT * FROM bookings
      WHERE provider_id = $1
      AND booking_date = $2
      AND (start_time, end_time) OVERLAPS ($3::time, $4::time)
      `,
      [provider_id, booking_date, start_time, end_time]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    // 2️⃣ Insert booking (status pending)
    const result = await pool.query(
      `
      INSERT INTO bookings
      (user_id, provider_id, skill_id, booking_date, start_time, end_time, total_amount, booking_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
      `,
      [req.user.id, provider_id, skill_id, booking_date, start_time, end_time, total_amount]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 1️⃣ Customer booking history
const getCustomerBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM bookings
      WHERE user_id = $1
      ORDER BY booking_date DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 2️⃣ Provider booking history
const getProviderBookings = async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id = $1`,
      [req.user.id]
    );

    if (provider.rows.length === 0) {
      return res.status(400).json({ message: "Provider profile not found" });
    }

    const provider_id = provider.rows[0].provider_id;

    const result = await pool.query(
      `
      SELECT * FROM bookings
      WHERE provider_id = $1
      ORDER BY booking_date DESC
      `,
      [provider_id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createBooking,
  getCustomerBookings,
  getProviderBookings
};
