const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createProviderProfile,
  addSkillToProvider,
  getProvidersBySkill,
  getProviderRating
} = require("../controllers/providerController");

// Import middleware
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");


/*
--------------------------------------------------
1️⃣ Create Provider Profile
Only provider role allowed
--------------------------------------------------
*/
router.post(
  "/create",
  verifyToken,
  authorizeRole("provider"),
  createProviderProfile
);


/*
--------------------------------------------------
2️⃣ Add Skill To Provider
Only provider role allowed
--------------------------------------------------
*/
router.post(
  "/add-skill",
  verifyToken,
  authorizeRole("provider"),
  addSkillToProvider
);


/*
--------------------------------------------------
3️⃣ Get Providers By Skill
Public route (no login required)
--------------------------------------------------
*/
router.get(
  "/skill/:skill_id",
  getProvidersBySkill
);


/*
--------------------------------------------------
4️⃣ Get Provider Rating
Public route
--------------------------------------------------
*/
router.get(
  "/rating/:provider_id",
  getProviderRating
);


module.exports = router;
