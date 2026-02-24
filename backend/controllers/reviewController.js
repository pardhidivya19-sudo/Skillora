const pool = require("../config/db");

const addReview = async (req, res) => {
  try {
    const { booking_id, rating, review_comment } = req.body;

    const booking = await pool.query(
      `SELECT * FROM bookings 
       WHERE booking_id = $1 
       AND booking_status = 'confirmed'`,
      [booking_id]
    );

    if (booking.rows.length === 0) {
      return res.status(400).json({
        message: "Booking not confirmed or does not exist"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO reviews
      (booking_id, user_id, provider_id, rating, review_comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        booking_id,
        req.user.id,
        booking.rows[0].provider_id,
        rating,
        review_comment
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReview };
