const express = require("express");
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getProviderBookings
} = require("../controllers/bookingController");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

router.post(
  "/create",
  verifyToken,
  authorizeRole("customer"),
  createBooking
);

// 2️⃣ Customer Booking History
router.get(
  "/my-bookings",
  verifyToken,
  authorizeRole("customer"),
  getCustomerBookings
);


// 3️⃣ Provider Booking History
router.get(
  "/provider-bookings",
  verifyToken,
  authorizeRole("provider"),
  getProviderBookings
);


module.exports = router;
