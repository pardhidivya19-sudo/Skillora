const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const transporter = require("../config/mailer");
const { getVendorProfile } = require("../controllers/vendorController");


// ==========================
// CREATE PROVIDER PROFILE
// ==========================

router.post("/create-profile", verifyToken, upload.single("document"), async (req, res) => {

const {
  experience,
  location,
  latitude,
  longitude,
  availability_status,
  description,
  skill_id,
  price,
  duration
} = req.body;// delete old profile if exists (for Fill Form Again case)
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
(user_id, experience, location, latitude, longitude, availability_status, verification_status, description, document, document_name)
VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9)
RETURNING provider_id`,
[
  req.user.id,
  experience,
  location,
  latitude,
  longitude,
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

// ✅ GET provider_id from logged-in user
const provider = await pool.query(
  `SELECT provider_id FROM provider_profile WHERE user_id=$1`,
  [req.user.id]
);

if (provider.rows.length === 0) {
  return res.status(400).json({ message: "Provider not found" });
}

const provider_id = provider.rows[0].provider_id;

    // ✅ SAVE EVERYTHING
    await pool.query(
      `INSERT INTO provider_skills
       (provider_id, skill_id, price, duration, description, image_url, title)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
[provider_id, skill_id, price, duration, description, image_url, title]    );

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

if (provider.rows.length === 0) {
  return res.json([]); // empty return, crash nahi hoga
}

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

    if (provider.rows.length === 0) {
  return res.status(404).json({ message: "Provider not found" });
}

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

// ==========================
// GET ALL SERVICES (FOR USER)
// ==========================

router.get("/all-services", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ps.provider_skill_id,
        ps.price,
        ps.duration,
        ps.description,
        ps.image_url,
        ps.title,

        s.skill_name,
        s.category,

        u.name AS provider_name,

        COALESCE(AVG(r.rating),0) AS rating

      FROM provider_skills ps

      JOIN skills s ON ps.skill_id = s.skill_id
      JOIN provider_profile p ON ps.provider_id = p.provider_id
      JOIN users u ON p.user_id = u.user_id

      LEFT JOIN reviews r ON r.provider_id = ps.provider_id

      WHERE ps.is_active = true

      GROUP BY 
        ps.provider_skill_id,
        ps.price,
        ps.duration,
        ps.description,
        ps.image_url,
        ps.title,
        s.skill_name,
        s.category,
        u.name
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching services" });
  }
});

router.post("/save-address", verifyToken, async (req, res) => {
  try {
    const { address } = req.body;

    const userId = req.user.id; // ✅ JWT se aayega

    await pool.query(
      `UPDATE users SET address=$1 WHERE user_id=$2`,
      [address, userId]
    );

    res.json({ message: "Address saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save address" });
  }
});

router.post("/create-booking", verifyToken, async (req, res) => {
  try {
    const {
      provider_skill_id,
      booking_date,
      start_time,
      address,
      total_amount
    } = req.body;

    // 🔥 USER ID
    const userId = req.user.id;

    // 🔥 provider_id fetch karo
    const provider = await pool.query(
      `SELECT provider_id FROM provider_skills WHERE provider_skill_id=$1`,
      [provider_skill_id]
    );

    const providerId = provider.rows[0].provider_id;

    // 🔥 skill_id fetch karo
    const skill = await pool.query(
  `SELECT skill_id FROM provider_skills WHERE provider_skill_id=$1`,
  [provider_skill_id]
);

if (skill.rows.length === 0) {
  return res.status(400).json({ message: "Invalid skill" });
}

const skillId = skill.rows[0].skill_id;

    // 🔥 INSERT BOOKING
    const result = await pool.query(
  `INSERT INTO bookings 
(user_id, provider_id, skill_id, booking_date, start_time, end_time, booking_status, total_amount)
VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
RETURNING booking_id`,   // 🔥 IMPORTANT
  [
    userId,
    providerId,
    skillId,
    booking_date,
    start_time,
    start_time,
    total_amount
  ]
);

res.json({
  message: "Booking created successfully",
  booking_id: result.rows[0].booking_id   // 🔥 MUST
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

router.get("/my-address", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT address FROM users WHERE user_id=$1`,
      [req.user.id]
    );

    res.json({ address: result.rows[0].address });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching address" });
  }
});
router.get("/my-latest-booking", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT *
      FROM bookings
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId]);

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching booking" });
  }
});

// ==========================
// GET CATEGORIES WITH COUNT
// ==========================
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.category,
        COUNT(ps.provider_skill_id) AS total_services
      FROM provider_skills ps
      JOIN skills s ON ps.skill_id = s.skill_id
      WHERE ps.is_active = true
      GROUP BY s.category
   
      ORDER BY COUNT(ps.provider_skill_id) DESC
LIMIT 5
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// ==========================
// GET TOP PROFESSIONALS
// ==========================
router.get("/top-professionals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
  p.provider_id,
  ps.provider_skill_id,

  u.name AS provider_name,
  u.address AS location,           -- ✅ LOCATION

  p.profile_image,                -- ✅ IMAGE

  s.category,

  COUNT(b.booking_id) FILTER (
    WHERE b.booking_status = 'completed'
  ) AS jobs_completed,

  COALESCE(AVG(r.rating), 0) AS rating,

  COUNT(r.review_id) AS total_reviews   -- ✅ REVIEWS

FROM provider_profile p

JOIN users u ON p.user_id = u.user_id
JOIN provider_skills ps ON p.provider_id = ps.provider_id
JOIN skills s ON ps.skill_id = s.skill_id

LEFT JOIN bookings b ON b.provider_id = p.provider_id
LEFT JOIN reviews r ON r.provider_id = p.provider_id

GROUP BY 
  p.provider_id,
  ps.provider_skill_id,
  u.name,
  u.address,
  p.profile_image,
  s.category

ORDER BY rating DESC;
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching professionals" });
  }
});

// ✅ SAVE CONTACT MESSAGE
router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, subject, message]
    );

    res.json({ message: "Message sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving message" });
  }
});

// ✅ GET ALL MESSAGES (ADMIN)
router.get("/contact", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// ✅ UPDATE STATUS + REPLY
router.put("/contact/reply/:id", async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const result = await pool.query(
      "SELECT email FROM contact_messages WHERE contact_id = $1",
      [id]
    );

    const userEmail = result.rows[0]?.email;

    // send mail
    if (userEmail && userEmail.includes("@")) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Reply from Skillora Support",
          html: `<p>${reply}</p>`
        });
      } catch (err) {
        console.log("Email failed:", err);
      }
    }

    // 🔥 ONLY REPLY UPDATE (NOT STATUS)
    await pool.query(
      "UPDATE contact_messages SET reply = $1 WHERE contact_id = $2",
      [reply, id]
    );

    res.json({ message: "Reply sent!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending reply" });
  }
});

router.put("/contact/resolve/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE contact_messages SET status = 'resolved' WHERE contact_id = $1",
      [id]
    );

    res.json({ message: "Marked as resolved!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating status" });
  }
});
// ✅ GET USER BOOKINGS
router.get("/user/bookings/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        b.booking_id,
        b.booking_date,
        b.start_time AS time,
        b.booking_status AS status,

        ps.title,
        s.category,
        ps.image_url,
        ps.price

      FROM bookings b

      JOIN provider_skills ps 
        ON b.skill_id = ps.skill_id   -- ✅ FIX HERE

      JOIN skills s 
        ON ps.skill_id = s.skill_id

      WHERE b.user_id = $1

      ORDER BY b.booking_date DESC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
router.get("/nearby-services", async (req, res) => {
  const { lat, lng } = req.query;

  try {

    const result = await pool.query(`
      SELECT * FROM (
        SELECT 
          ps.*,
          p.latitude,
          p.longitude,

          (
            6371 * acos(
              cos(radians($1)) *
              cos(radians(p.latitude)) *
              cos(radians(p.longitude) - radians($2)) +
              sin(radians($1)) *
              sin(radians(p.latitude))
            )
          ) AS distance

        FROM provider_skills ps
        JOIN provider_profile p 
        ON ps.provider_id = p.provider_id

        WHERE p.latitude IS NOT NULL
      ) AS nearby

      WHERE distance < 10
      ORDER BY distance ASC
    `, [lat, lng]);

    res.json(result.rows);

  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ message: "Error fetching nearby services" });
  }
});

const razorpay = require("../utils/razorpay");

router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating order" });
  }
});

router.post("/cod-payment", verifyToken, async (req, res) => {
  try {
    const { booking_id } = req.body;

    await pool.query(
      `INSERT INTO payments 
      (booking_id, payment_method, payment_status, payment_date)
      VALUES ($1, $2, $3, NOW())`,
      [booking_id, "cod", "pending"]
    );

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving COD" });
  }
});

const crypto = require("crypto");

router.post("/verify-payment", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id
    } = req.body;

    // 🔥 DEBUG
    console.log("REQ BODY:", req.body);

   if (!booking_id || booking_id === "undefined") {
  return res.status(400).json({ message: "Invalid booking ID" });
}

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("EXPECTED:", expectedSignature);
    console.log("RECEIVED:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {

      await pool.query(
        `INSERT INTO payments 
        (booking_id, payment_method, transaction_id, payment_status, payment_date)
        VALUES ($1, $2, $3, $4, NOW())`,
        [
          booking_id,
          "online",
          razorpay_payment_id,
          "success" // ✅ FIXED
        ]
      );

      return res.json({ success: true });
    }

    res.status(400).json({ success: false });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// ==========================
// GET HAPPY CUSTOMERS
// ==========================
router.get("/happy-customers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'customer'
      AND is_deleted = false
    `);

    res.json({ total: result.rows[0].total });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching customers" });
  }
});
// ==========================
// GET CUSTOMER AVATARS
// ==========================
router.get("/customer-avatars", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name
      FROM users
      WHERE role = 'customer'
      LIMIT 3
    `);

    // 🔥 dummy images attach karo
    const avatars = result.rows.map((u, i) => ({
      profile_image: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? "women" : "men"
      }/${30 + i}.jpg`
    }));

    res.json(avatars);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching avatars" });
  }
});
module.exports = router;