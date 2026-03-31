const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { getVendorProfile } = require("../controllers/vendorController");


// ==========================
// CREATE PROVIDER PROFILE
// ==========================

router.post("/create-profile", verifyToken, upload.single("document"), async (req, res) => {

const {experience, location, availability_status, description, skill_id, price, duration} = req.body;
// delete old profile if exists (for Fill Form Again case)
const oldProfile = await pool.query(
  `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
  [req.user.id]
);

if (oldProfile.rows.length > 0) {

  const oldProviderId = oldProfile.rows[0].provider_id;

  // delete old skills
  await pool.query(
    `DELETE FROM provider_skills WHERE provider_id=$1`,
    [oldProviderId]
  );

  // delete old profile
  await pool.query(
    `DELETE FROM provider_profile WHERE user_id=$1`,
    [req.user.id]
  );

}
let document = null;
let document_name = null;

if (req.file) {
  const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

if (!allowedTypes.includes(req.file.mimetype)) {
  return res.status(400).json({
    message: "Only PDF or Word documents are allowed"
  });
}

const result = await cloudinary.uploader.upload(
  `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
  {
    folder: "skillora-documents",
    resource_type: "auto",
    use_filename: true,
    unique_filename: false
  }
);

document = result.secure_url;
document_name = req.file.originalname;
}

try {

const profile = await pool.query(
`INSERT INTO provider_profile
(user_id, experience, location, availability_status, verification_status, description, document, document_name)
VALUES ($1,$2,$3,$4,'pending',$5,$6,$7)
RETURNING provider_id`,
[
req.user.id,
experience,
location,
availability_status,
description,
document,
document_name
]
);
// reset approval status when vendor resubmits form
await pool.query(
`UPDATE users
 SET approval_status='pending',
 rejection_reason=NULL
 WHERE user_id=$1`,
[req.user.id]
);

const provider_id = profile.rows[0].provider_id;

await pool.query(
`INSERT INTO provider_skills
(provider_id, skill_id, price, duration)
VALUES ($1,$2,$3,$4)`,
[
provider_id,
skill_id,
price,
duration
]
);

res.json({message:"Profile created successfully"});

}catch (err) {

console.error("========== ERROR START ==========");
console.dir(err, { depth: null });
console.error("========== ERROR END ==========");

res.status(500).json({
message: "Server error",
error: err.message
});

}

});

router.get("/skills", async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT skill_id, skill_name 
       FROM skills
       WHERE status = true
       ORDER BY skill_name`
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching skills" });
  }
});

router.get("/profile", verifyToken, getVendorProfile);

router.get("/services", verifyToken, async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT 
  ps.*, 
  s.skill_name, 
  s.category,

  -- ⭐ rating
  COALESCE(AVG(r.rating), 0) AS rating,
  COUNT(r.review_id) AS total_reviews

FROM provider_skills ps

JOIN skills s ON ps.skill_id = s.skill_id

LEFT JOIN reviews r 
  ON r.provider_id = ps.provider_id

WHERE ps.provider_id = (
  SELECT provider_id 
  FROM provider_profile 
  WHERE user_id = $1
)

GROUP BY ps.provider_skill_id, s.skill_name, s.category`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching services" });
  }
});

router.post("/services", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { skill_id, price, duration, description, title } = req.body;

    let image_url = null;

    // ✅ upload image to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "skillora-services"
        }
      );

      image_url = result.secure_url;
    }

    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const provider_id = provider.rows[0].provider_id;

    // ✅ SAVE EVERYTHING
    await pool.query(
      `INSERT INTO provider_skills
       (provider_id, skill_id, price, duration, description, image_url, title)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [provider_id, skill_id, price, duration, description, image_url, title]
    );

    res.json({ message: "Service added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding service" });
  }
});

router.delete("/services/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM provider_skills WHERE provider_skill_id = $1`,
      [id]
    );

    res.json({ message: "Service deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting service" });
  }
});

router.put("/services/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, duration, description } = req.body;

    let image_url = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "skillora-services"
        }
      );

      image_url = result.secure_url;
    }

    const result = await pool.query(
      `UPDATE provider_skills
       SET title=$1,
           price=$2,
           duration=$3,
           description=$4,
           image_url = COALESCE($5, image_url)
       WHERE provider_skill_id=$6
       RETURNING *`,
      [title, price, duration, description, image_url, id]
    );

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating service" });
  }
});

router.post("/add-skill", verifyToken, async (req, res) => {
  try {
    const { skill_name, category, description } = req.body;

    const result = await pool.query(
      `INSERT INTO skills (skill_name, category, description, status)
       VALUES ($1,$2,$3,true)
       RETURNING *`,
      [skill_name, category, description]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding skill" });
  }
});

router.get("/vendor/bookings", verifyToken, async (req, res) => {

  // 🔥 STEP 1: user_id se provider_id nikaalo
  const provider = await pool.query(
    `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
    [req.user.id]
  );

  const providerId = provider.rows[0].provider_id;

  // 🔥 STEP 2: bookings fetch karo
  const result = await pool.query(`
  SELECT 
    b.*, 
    s.skill_name,
    u.name AS user_name,
    u.phone,
    u.address
  FROM bookings b
  JOIN skills s ON b.skill_id = s.skill_id
  JOIN users u ON b.user_id = u.user_id
  WHERE b.provider_id = $1
  ORDER BY b.created_at DESC
`, [providerId]);

  res.json(result.rows);
});
router.put("/vendor/bookings/:id", verifyToken, async (req, res) => {
const { status, cancel_reason } = req.body;
  try {
    await pool.query(
      `UPDATE bookings 
       SET booking_status=$1, cancel_reason=$2 
       WHERE booking_id=$3`,
      [status, cancel_reason, req.params.id]
    );

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

router.get("/earnings-details", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔹 Total + Monthly earnings
    const summary = await pool.query(`
      SELECT 
  COUNT(*) AS total_bookings,

  COUNT(*) FILTER (WHERE booking_status='completed') AS completed,

  COUNT(*) FILTER (
  WHERE booking_status IN ('pending','accepted')
) AS pending,

  COALESCE(SUM(total_amount) FILTER (WHERE booking_status='completed'),0) AS total_earnings,


  COALESCE(SUM(vendor_earning),0) AS vendor_earning,

  COALESCE(SUM(admin_commission),0) AS admin_commission,

    -- 🔥 NEW: total withdrawn
  COALESCE((
    SELECT SUM(amount) FROM transactions 
    WHERE provider_id=$1 AND type='debit' AND status='completed'
  ),0) AS total_withdrawn,

  -- 🔥 NEW: available balance
  COALESCE(SUM(vendor_earning),0) 
  - COALESCE((
      SELECT SUM(amount) FROM transactions 
      WHERE provider_id=$1 AND type='debit' AND status='completed'
    ),0) AS available_balance,

  COALESCE(SUM(total_amount) FILTER (
    WHERE booking_status='completed'
    AND DATE_TRUNC('month', booking_date) = DATE_TRUNC('month', CURRENT_DATE)
  ),0) AS monthly_earnings

FROM bookings
WHERE provider_id=$1
    `, [providerId]);

    // 🔹 Monthly graph data
    const monthlyData = await pool.query(`
      SELECT 
        TO_CHAR(booking_date, 'Mon') AS month,
        SUM(total_amount) AS earnings
      FROM bookings
      WHERE provider_id=$1 AND booking_status='completed'
      GROUP BY month, DATE_TRUNC('month', booking_date)
      ORDER BY DATE_TRUNC('month', booking_date)
    `, [providerId]);

    // 🔹 Recent transactions
    // 🔹 Recent transactions (UPDATED)
const transactions = await pool.query(`
  SELECT 
    t.transaction_id,
    t.amount,
    t.created_at,
    t.status,
    t.type,
    'Withdrawal' AS skill_name
  FROM transactions t
  WHERE t.provider_id=$1
  ORDER BY t.created_at DESC
  LIMIT 5
`, [providerId]);

    res.json({
      summary: summary.rows[0],
      monthly: monthlyData.rows,
      transactions: transactions.rows
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching earnings details" });
  }
});

router.post("/withdraw", verifyToken, async (req, res) => {
  const { amount } = req.body;

  try {
    // 🔹 provider_id
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔹 available balance (earnings - withdrawals)
    const balanceResult = await pool.query(`
      SELECT 
        COALESCE(SUM(vendor_earning),0) 
        - COALESCE((
            SELECT SUM(amount) FROM transactions 
            WHERE provider_id=$1 AND type='debit' AND status='completed'
          ),0) AS balance
      FROM bookings
      WHERE provider_id=$1 AND booking_status='completed'
    `, [providerId]);

    const balance = balanceResult.rows[0].balance;

    // ❌ insufficient balance
    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔹 insert transaction
    // 🔥 PENDING withdrawal (IMPORTANT CHANGE)
await pool.query(`
  INSERT INTO transactions (provider_id, amount, type, status, description)
  VALUES ($1,$2,'debit','pending','Withdrawal request')
`, [providerId, amount]);

res.json({ message: "Withdrawal request sent (pending)" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error processing withdrawal" });
  }
});

router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    const result = await pool.query(`
      SELECT * FROM transactions
      WHERE provider_id=$1
      ORDER BY created_at DESC
    `, [providerId]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

router.put("/services/toggle/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      UPDATE provider_skills
      SET is_active = NOT is_active
      WHERE provider_skill_id = $1
    `, [id]);

    res.json({ message: "Service status updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

router.put("/toggle-availability", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔥 current status check karo
    const current = await pool.query(
      `SELECT availability_status FROM provider_profile WHERE provider_id=$1`,
      [providerId]
    );

    const isCurrentlyActive = current.rows[0].availability_status;

    const newStatus = !isCurrentlyActive;

    // ✅ update provider status
    await pool.query(
      `UPDATE provider_profile SET availability_status=$1 WHERE provider_id=$2`,
      [newStatus, providerId]
    );

    // 🔥 IMPORTANT LOGIC
    if (newStatus === false) {
      // OFF → sab services OFF
      await pool.query(
        `UPDATE provider_skills SET is_active=false WHERE provider_id=$1`,
        [providerId]
      );
    } else {
      // ON → sab services ON
      await pool.query(
        `UPDATE provider_skills SET is_active=true WHERE provider_id=$1`,
        [providerId]
      );
    }

res.json({
  message: "Vendor availability updated",
  availability_status: newStatus
});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating availability" });
  }
});
// ==========================
// VENDOR DASHBOARD STATS
// ==========================
router.get("/dashboard-stats", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔹 Total bookings
    const totalBookings = await pool.query(
      `SELECT COUNT(*) FROM bookings WHERE provider_id=$1`,
      [providerId]
    );

    // 🔹 Today bookings
    const todayBookings = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE provider_id=$1 
       AND DATE(booking_date) = CURRENT_DATE`,
      [providerId]
    );

    // 🔹 Total earnings
    const earnings = await pool.query(
      `SELECT COALESCE(SUM(total_amount),0) FROM bookings 
       WHERE provider_id=$1 AND booking_status='completed'`,
      [providerId]
    );

    // 🔹 Active services
    const activeServices = await pool.query(
      `SELECT COUNT(*) FROM provider_skills 
       WHERE provider_id=$1 AND is_active=true`,
      [providerId]
    );

    // 🔹 Rating
    const rating = await pool.query(
      `SELECT COALESCE(AVG(rating),0) FROM reviews 
       WHERE provider_id=$1`,
      [providerId]
    );

    res.json({
      total_bookings: totalBookings.rows[0].count,
      today_bookings: todayBookings.rows[0].count,
      total_earnings: earnings.rows[0].coalesce,
      active_services: activeServices.rows[0].count,
      rating: rating.rows[0].coalesce
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

router.get("/service-performance", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

   const result = await pool.query(`
  SELECT 
    ps.provider_skill_id,
    s.skill_name,

    COUNT(DISTINCT b.booking_id) AS total_bookings,

    COALESCE(SUM(b.total_amount), 0) AS total_earnings,

    COALESCE(AVG(r.rating), 0) AS rating

  FROM provider_skills ps

  JOIN skills s ON ps.skill_id = s.skill_id

  LEFT JOIN bookings b 
    ON b.provider_id = ps.provider_id 
    AND b.skill_id = ps.skill_id
    AND b.booking_status = 'completed'

  LEFT JOIN reviews r 
    ON r.provider_id = ps.provider_id   -- ✅ FIX

  WHERE ps.provider_id = $1

  GROUP BY ps.provider_skill_id, s.skill_name
`, [providerId]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching performance" });
  }
});

router.get("/notifications", verifyToken, async (req, res) => {
  try {

    // 🔹 provider_id
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔹 bookings
 const bookings = await pool.query(`
  SELECT 
    b.booking_id,
    b.created_at,
    s.skill_name,
    u.name AS user_name
  FROM bookings b
  JOIN skills s ON b.skill_id = s.skill_id
  JOIN users u ON b.user_id = u.user_id
  WHERE b.provider_id=$1 AND b.is_seen=false
  ORDER BY b.created_at DESC
  LIMIT 5
`, [providerId]);

    // 🔹 payments
const payments = await pool.query(`
  SELECT 
    p.payment_id,
     b.total_amount AS amount,
    b.created_at,
    u.name AS user_name
  FROM payments p
  JOIN bookings b ON p.booking_id = b.booking_id
  JOIN users u ON b.user_id = u.user_id
  WHERE b.provider_id = $1 AND p.is_seen=false
  ORDER BY b.created_at DESC
  LIMIT 5
`, [providerId]);

    // 🔥 FORMAT NOTIFICATIONS
const formatted = [

  ...bookings.rows.map(b => ({
    id: b.booking_id,
    type: "booking",
    user_name: b.user_name,
    service_name: b.skill_name,
    created_at: b.created_at
  })),

  ...payments.rows.map(p => ({
    id: p.payment_id,
    type: "payment",
    user_name: p.user_name,
    amount: p.amount,
    created_at: p.created_at
  }))


    ];

    res.json(formatted);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/notifications/read", verifyToken, async (req, res) => {
  const { type, id } = req.body;

  try {

    if (type === "booking") {
      await pool.query(
        `UPDATE bookings SET is_seen=true WHERE booking_id=$1`,
        [id]
      );
    }

    if (type === "payment") {
      await pool.query(
        `UPDATE payments SET is_seen=true WHERE payment_id=$1`,
        [id]
      );
    }

    res.json({ message: "Notification marked as read" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating notification" });
  }
});

router.put("/services/timing/:id", verifyToken, async (req, res) => {
  const { start_time, end_time } = req.body;

  try {
    await pool.query(`
      UPDATE provider_skills
      SET start_time=$1, end_time=$2
      WHERE provider_skill_id=$3
    `, [start_time, end_time, req.params.id]);

    res.json({ message: "Service timing updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating timing" });
  }
});

router.get("/invoices", verifyToken, async (req, res) => {
  try {
    // provider id
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    // completed bookings = invoice
    const result = await pool.query(`
      SELECT 
        b.booking_id,
        b.total_amount,
        b.booking_date,
        s.skill_name,
        u.name AS user_name
      FROM bookings b
      JOIN skills s ON b.skill_id = s.skill_id
      JOIN users u ON b.user_id = u.user_id
      WHERE b.provider_id=$1 AND b.booking_status='completed'
      ORDER BY b.booking_date DESC
    `, [providerId]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching invoices" });
  }
});

router.put("/profile/image", verifyToken, upload.single("image"), async (req, res) => {
  try {

    let image_url = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "skillora-profiles"
        }
      );

      image_url = result.secure_url;
    }

    await pool.query(
      `UPDATE provider_profile 
       SET profile_image=$1 
       WHERE user_id=$2`,
      [image_url, req.user.id]
    );

    res.json({ message: "Profile image updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.put("/profile/update", verifyToken, async (req, res) => {
  const { experience, location, description } = req.body;

  try {
    await pool.query(`
      UPDATE provider_profile
      SET experience=$1,
          location=$2,
          description=$3
      WHERE user_id=$4
    `, [experience, location, description, req.user.id]);

    res.json({ message: "Profile updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});
router.get("/profile/skills", verifyToken, async (req, res) => {
  try {
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
      [req.user.id]
    );

    const providerId = provider.rows[0].provider_id;

    const skills = await pool.query(`
      SELECT s.skill_name
      FROM provider_skills ps
      JOIN skills s ON ps.skill_id = s.skill_id
      WHERE ps.provider_id=$1
    `, [providerId]);

    res.json(skills.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching skills" });
  }
});
module.exports = router;