const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const pool = require("../config/db");

// ==========================
// ADMIN LOGIN
// ==========================
router.post("/login", adminController.adminLogin);

// ==========================
// DASHBOARD
// ==========================
router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("admin"),
  adminController.dashboardStats
);

// ==========================
// // USER MANAGEMENT
// // ==========================

router.get(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  adminController.getAllUsers
);

router.put(
  "/block-user/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.blockUser
);

// // ==========================
// // PROVIDER MANAGEMENT
// // ==========================

// Get all providers
router.get(
  "/providers",
  verifyToken,
  authorizeRole("admin"),
  adminController.getAllProviders
);

// Approve provider
router.put(
  "/approve-provider/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.approveProvider
);

// Reject provider
router.put(
  "/reject-provider/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.rejectProvider
);

// Block / Unblock provider
router.put(
  "/block-provider/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.blockProvider
);

// Soft Delete provider
router.delete(
  "/delete-provider/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.deleteProvider
);
//Provider details

router.get(
  "/provider-details/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.getProviderDetails
);


// ==========================
// BOOKING MANAGEMENT
// ==========================

// Get all bookings
router.get(
  "/bookings",
  verifyToken,
  authorizeRole("admin"),
  adminController.getAllBookingsAdmin
);

// Cancel booking
router.put(
  "/cancel-booking/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.cancelBookingAdmin
);

// Get single booking details
router.get(
  "/booking-details/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.getBookingDetailsAdmin
);

// ==========================
// PAYMENT MANAGEMENT
// ==========================

router.get(
  "/payments",
  verifyToken,
  authorizeRole("admin"),
  adminController.getAllPaymentsAdmin
);

// Payments Summary
router.get(
  "/payments-summary",
  verifyToken,
  authorizeRole("admin"),
  adminController.paymentSummaryAdmin
);

// Refund Payment
router.put(
  "/refund-payment/:id",
  verifyToken,
  authorizeRole("admin"),
  adminController.refundPaymentAdmin
);

router.get("/monthly-revenue", verifyToken, authorizeRole("admin"), adminController.monthlyRevenueAdmin);

router.get("/monthly-bookings", verifyToken, authorizeRole("admin"), adminController.monthlyBookingsAdmin);

router.get("/booking-status-stats", verifyToken, authorizeRole("admin"), adminController.bookingStatusStatsAdmin);

router.get(
  "/top-providers-revenue", verifyToken, authorizeRole("admin"), adminController.topProvidersRevenueAdmin);

router.get(
  "/notifications",
  verifyToken,
  authorizeRole("admin"),
  adminController.adminNotifications
);

router.get(
  "/export-bookings",
  verifyToken,
  authorizeRole("admin"),
  adminController.exportBookingsExcel
);

// ==========================
// ADMIN: APPROVE / REJECT WITHDRAWAL
// ==========================

router.put("/transactions/:id", async (req, res) => {
  const { status } = req.body; // completed / rejected

  try {
    await pool.query(
      `UPDATE transactions SET status=$1 WHERE transaction_id=$2`,
      [status, req.params.id]
    );

    res.json({ message: "Transaction updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating transaction" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT DISTINCT ON (t.transaction_id)
    t.transaction_id,
    t.amount,
    t.status,
    t.created_at,

    u.name AS provider_name,
    s.skill_name

  FROM transactions t

  JOIN provider_profile p 
    ON t.provider_id = p.provider_id

  JOIN users u 
    ON p.user_id = u.user_id

  LEFT JOIN provider_skills ps
    ON ps.provider_id = p.provider_id

  LEFT JOIN skills s
    ON ps.skill_id = s.skill_id

  ORDER BY t.transaction_id, ps.provider_skill_id
`);
    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});
module.exports = router;