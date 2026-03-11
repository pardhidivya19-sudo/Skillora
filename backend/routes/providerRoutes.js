const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const pool = require("../config/db");

// ==========================
// CREATE PROVIDER PROFILE
// ==========================

router.post("/create-profile", verifyToken, async (req, res) => {

const {experience, location, availability_status, description, skill_id, price, duration} = req.body;

try {

const profile = await pool.query(
`INSERT INTO provider_profile
(user_id, experience, location, availability_status, verification_status, description)
VALUES ($1,$2,$3,$4,'pending',$5)
RETURNING provider_id`,
[
req.user.id,
experience,
location,
availability_status,
description
]
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

} catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
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
module.exports = router;