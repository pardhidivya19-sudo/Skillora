const db = require("../config/db");

// ✅ GET Vendor Profile
const getVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(`
    SELECT 
  p.*,                     
  u.name,                  
  u.email,

  -- ✅ ADD ONLY (existing untouched)
  (
    SELECT COALESCE(AVG(r.rating), 0)
    FROM reviews r
    WHERE r.provider_id = p.provider_id
  ) AS rating

FROM provider_profile p
JOIN users u ON p.user_id = u.user_id
WHERE p.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getVendorProfile };