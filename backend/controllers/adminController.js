const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const ExcelJS = require("exceljs");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const admin = user.rows[0];

  if (admin.role !== "admin") {
    return res.status(403).json({ message: "Not an admin" });
  }

  if (admin.is_blocked) {
  return res.status(403).json({ message: "Account blocked by super admin" });
}

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin.user_id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: admin.user_id,
      email: admin.email,
      role: admin.role
    }
  });
};

// ==========================
// DASHBOARD STATS
// ==========================
exports.dashboardStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");

    const bookings = await pool.query("SELECT COUNT(*) FROM bookings");

    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) FROM bookings"
    );

    res.json({
      totalUsers: Number(users.rows[0].count),
      totalBookings: Number(bookings.rows[0].count),
      totalRevenue: Number(revenue.rows[0].coalesce)
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

// ==========================
// // USER MANAGEMENT
// // ==========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT user_id, name, email, role, is_blocked 
       FROM users 
       WHERE role = 'customer'
       ORDER BY user_id`
    );

    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE users SET is_blocked = NOT is_blocked WHERE user_id = $1 RETURNING is_blocked",
      [id]
    );

    res.json({
      message: "User status updated",
      is_blocked: result.rows[0].is_blocked
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
};

/* ==========================
   PROVIDER MANAGEMENT
========================== */

// GET ALL PROVIDERS (Exclude Deleted)
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await pool.query(
      `SELECT user_id,
              name,
              email,
              phone,
              created_at,
              is_blocked,
              approval_status, 
              is_deleted
       FROM users
       WHERE role = 'provider'
       AND is_deleted = false
       ORDER BY created_at DESC`
    );

    res.json(providers.rows);
  } catch (err) {
    console.error("Get Providers Error:", err);
    res.status(500).json({ message: "Error fetching providers" });
  }
};


// APPROVE PROVIDER
exports.approveProvider = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE users SET approval_status = 'approved' WHERE user_id = $1",
      [id]
    );

    res.json({ message: "Provider approved" });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ message: "Error approving provider" });
  }
};


// REJECT PROVIDER
exports.rejectProvider = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE users SET approval_status = 'rejected' WHERE user_id = $1",
      [id]
    );

    res.json({ message: "Provider rejected" });
  } catch (err) {
    console.error("Reject Error:", err);
    res.status(500).json({ message: "Error rejecting provider" });
  }
};


// BLOCK / UNBLOCK PROVIDER
exports.blockProvider = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users
       SET is_blocked = NOT is_blocked
       WHERE user_id = $1
       RETURNING is_blocked`,
      [id]
    );

    res.json({
      message: "Block status updated",
      is_blocked: result.rows[0].is_blocked
    });

  } catch (err) {
    console.error("Block Error:", err);
    res.status(500).json({ message: "Error updating block status" });
  }
};


// SOFT DELETE PROVIDER
exports.deleteProvider = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE users SET is_deleted = true WHERE user_id = $1",
      [id]
    );

    res.json({ message: "Provider deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting provider" });
  }
};


// PROVIDER DETAILS PAGE
exports.getProviderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // BASIC PROFILE + STATUS
    const profileQuery = await pool.query(
`SELECT u.user_id,
        u.name,
        u.email,
        u.phone,
        u.created_at,
        u.is_blocked,
        u.approval_status,
        u.is_deleted,
        p.experience,
        p.location,
        p.availability_status,
        p.verification_status,
        p.description
 FROM users u
 LEFT JOIN provider_profile p
 ON u.user_id = p.user_id
 WHERE u.user_id = $1
 ORDER BY p.created_at DESC
LIMIT 1`,
[id]
);

    // SKILLS
 const skillsQuery = await pool.query(
`SELECT s.skill_name,
        s.category,
        ps.price,
        ps.duration
 FROM provider_skills ps
 JOIN skills s
 ON ps.skill_id = s.skill_id
 WHERE ps.provider_id = (
        SELECT provider_id
        FROM provider_profile
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
 )
`,
[id]
);

    // REVIEWS
    const reviewsQuery = await pool.query(
      `SELECT rating,
              review_comment,
              review_date
       FROM reviews
       WHERE provider_id = $1
       ORDER BY review_date DESC`,
      [id]
    );

    // RATING SUMMARY
    const ratingSummaryQuery = await pool.query(
      `SELECT COALESCE(AVG(rating),0) as avg_rating,
              COUNT(*) as total_reviews
       FROM reviews
       WHERE provider_id = $1`,
      [id]
    );

    res.json({
      profile: profileQuery.rows[0] || {},
      skills: skillsQuery.rows || [],
      reviews: reviewsQuery.rows || [],
      ratingSummary: ratingSummaryQuery.rows[0] || {}
    });

  } catch (error) {
    console.error("Provider Details Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// ADMIN - GET ALL BOOKINGS
// ==========================
exports.getAllBookingsAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_amount,
        b.booking_status,
        u.name AS customer_name,
        p.name AS provider_name,
        s.skill_name
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN users p ON b.provider_id = p.user_id
      JOIN skills s ON b.skill_id = s.skill_id
    `;

    const values = [];

    if (status) {
      query += ` WHERE b.booking_status = $1`;
      values.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.error("Admin Booking Error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
exports.cancelBookingAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE bookings SET booking_status = 'Cancelled' WHERE booking_id = $1",
      [id]
    );

    res.json({ message: "Booking cancelled successfully" });

  } catch (err) {
    console.error("Cancel Booking Error:", err);
    res.status(500).json({ message: "Error cancelling booking" });
  }
};
// ==========================
// ADMIN - GET SINGLE BOOKING DETAILS
// ==========================
exports.getBookingDetailsAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_amount,
        b.booking_status,
        b.created_at,

        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        p.name AS provider_name,
        p.email AS provider_email,
        p.phone AS provider_phone,

        s.skill_name,

        pp.experience,
        pp.location,
        pp.description,

        pay.payment_id,
        pay.payment_status

      FROM bookings b

      JOIN users u ON b.user_id = u.user_id
      JOIN provider_profile pp ON b.provider_id = pp.provider_id
      JOIN users p ON pp.user_id = p.user_id
      JOIN skills s ON b.skill_id = s.skill_id
      LEFT JOIN payments pay ON b.booking_id = pay.booking_id

      WHERE b.booking_id = $1
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Booking Details Error:", err);
    res.status(500).json({ message: "Error fetching booking details" });
  }
};
// ==========================
// ADMIN - GET ALL PAYMENTS
// ==========================
exports.getAllPaymentsAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        p.payment_id,
        p.booking_id,
        b.total_amount,
        p.payment_method,
        p.transaction_id,
        p.payment_status,
        p.payment_date,
        p.refund_status,
        p.updated_at,
        u.name AS customer_name,
        pr.name AS provider_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN users u ON b.user_id = u.user_id
      JOIN users pr ON b.provider_id = pr.user_id
    `;

    const values = [];

    if (status) {
      query += ` WHERE p.payment_status = $1`;
      values.push(status);
    }

    query += ` ORDER BY p.payment_date DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};
exports.paymentSummaryAdmin = async (req, res) => {
  try {
    const revenue = await pool.query(
      `SELECT COALESCE(SUM(b.total_amount),0) 
       FROM bookings b
       JOIN payments p ON b.booking_id = p.booking_id
       WHERE LOWER(p.payment_status) = 'success'`
    );

    const totalPayments = await pool.query(
      `SELECT COUNT(*) FROM payments`
    );

    const refunded = await pool.query(
      `SELECT COUNT(*) 
       FROM payments 
       WHERE LOWER(refund_status) = 'refunded'`
    );

    res.json({
      totalRevenue: revenue.rows[0].coalesce,
      totalPayments: totalPayments.rows[0].count,
      totalRefunded: refunded.rows[0].count
    });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
exports.refundPaymentAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE payments
       SET refund_status = 'Refunded',
           updated_at = CURRENT_TIMESTAMP
       WHERE payment_id = $1`,
      [id]
    );

    res.json({ message: "Refund successful" });

  } catch (err) {
    res.status(500).json({ message: "Refund failed" });
  }
};
//DASHBARD MONTLY REVENUE

exports.monthlyRevenueAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'Mon') AS month,
        SUM(b.total_amount) AS revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      WHERE LOWER(p.payment_status) = 'success'
      GROUP BY month, DATE_PART('month', p.payment_date)
      ORDER BY DATE_PART('month', p.payment_date)
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly revenue" });
  }
};
//DASHBOARD MONTHLY BOOKING
exports.monthlyBookingsAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') AS month,
        COUNT(*) AS bookings
      FROM bookings
      GROUP BY month, DATE_PART('month', created_at)
      ORDER BY DATE_PART('month', created_at)
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly bookings" });
  }
};

//MONTHLY BOOKING STATUS
exports.bookingStatusStatsAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT booking_status, COUNT(*)::int AS count
      FROM bookings
      GROUP BY booking_status
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching status stats" });
  }
};

exports.topProvidersRevenueAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name,
      SUM(b.total_amount) AS revenue
      FROM bookings b
      JOIN users u ON b.provider_id = u.user_id
      GROUP BY u.name
      ORDER BY revenue DESC
      LIMIT 5
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Error fetching provider revenue" });
  }
};

exports.adminNotifications = async (req, res) => {
  try {

    const newProviders = await pool.query(`
      SELECT name, created_at
      FROM users
      WHERE role='provider'
      ORDER BY created_at DESC
      LIMIT 3
    `);

    const newBookings = await pool.query(`
      SELECT booking_id, created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 3
    `);

    const payments = await pool.query(`
      SELECT payment_id, payment_date
      FROM payments
      WHERE LOWER(payment_status)='success'
      ORDER BY payment_date DESC
      LIMIT 3
    `);

    res.json({
      providers: newProviders.rows,
      bookings: newBookings.rows,
      payments: payments.rows
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};


exports.exportBookingsExcel = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
      booking_id,
      booking_date,
      total_amount,
      booking_status
      FROM bookings
      ORDER BY booking_id DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bookings");

    worksheet.columns = [
      { header: "Booking ID", key: "booking_id", width: 15 },
      { header: "Booking Date", key: "booking_date", width: 20 },
      { header: "Amount", key: "total_amount", width: 15 },
      { header: "Status", key: "booking_status", width: 20 }
    ];

    result.rows.forEach(row => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bookings.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Excel export failed" });

  }

};