const pool = require("../config/db");

const processPayment = async (req, res) => {
  try {
    const { booking_id, payment_method, transaction_id, payment_status } = req.body;

    // 1️⃣ Insert payment record
    await pool.query(
      `
      INSERT INTO payments
      (booking_id, payment_method, transaction_id, payment_status)
      VALUES ($1, $2, $3, $4)
      `,
      [booking_id, payment_method, transaction_id, payment_status]
    );

    // 2️⃣ Update booking status
    if (payment_status === "success") {
      await pool.query(
        `UPDATE bookings SET booking_status = 'confirmed' WHERE booking_id = $1`,
        [booking_id]
      );
    } else {
      await pool.query(
        `UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = $1`,
        [booking_id]
      );
    }

    res.json({ message: "Payment processed successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processPayment };
