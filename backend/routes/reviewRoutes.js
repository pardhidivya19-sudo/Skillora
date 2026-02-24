const express = require("express");
const router = express.Router();
const { addReview } = require("../controllers/reviewController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

router.post(
  "/add",
  verifyToken,
  authorizeRole("customer"),
  addReview
);

module.exports = router;
