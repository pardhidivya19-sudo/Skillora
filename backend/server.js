const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const providerRoutes = require("./routes/providerRoutes");
app.use("/api/provider", providerRoutes);


// Protected test route
const { verifyToken } = require("./middleware/authMiddleware");

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route working", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
