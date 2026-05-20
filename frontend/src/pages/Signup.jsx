import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validateForm = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!form.name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Phone number must be 10 digits");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email (must contain @)");
      return false;
    }

    if (!passwordRegex.test(form.password)) {
      alert(
        "Password must contain:\n- 1 uppercase\n- 1 lowercase\n- 1 number\n- 1 special character\n- minimum 8 characters"
      );
      return false;
    }

    return true;
  };

  // ================= SEND OTP =================
  const sendOTP = async () => {

    // 🔥 VALIDATION BEFORE OTP
    if (!validateForm()) return;

    try {
      await API.post("/auth/send-otp", { email: form.email });
      alert("OTP sent! Check backend terminal.");
      setOtpSent(true);
    } catch (err) {
  console.log(err.response); // DEBUG

  alert(err.response?.data?.message || "Error sending OTP");
}
  };

  // ================= VERIFY OTP =================
  const verifyOTP = async () => {
    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp
      });
      alert("OTP Verified ✅");
      setOtpVerified(true);
    } catch (err) {
      alert("Invalid OTP ❌");
    }
  };

  // ================= FINAL REGISTER =================
  const handleRegister = async () => {

    if (!validateForm()) return;

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await API.post("/auth/register-final", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: role === "vendor" ? "provider" : "customer"
      });

      alert("Registration Successful 🚀");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">

        <h2>Signup</h2>

        {!role && (
          <>
            <button className="role-btn" onClick={() => setRole("user")}>
              Register as User
            </button>

            <button className="role-btn" onClick={() => setRole("vendor")}>
              Register as Vendor
            </button>
          </>
        )}

        {role && (
          <>
            <input name="name" placeholder="Name" onChange={handleChange} />

            <input
              name="phone"
              placeholder="Phone"
              maxLength="10"
              onChange={handleChange}
            />

            <input name="email" placeholder="Email" onChange={handleChange} />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            {!otpSent && (
              <button onClick={sendOTP}>Send OTP</button>
            )}

            {otpSent && !otpVerified && (
              <>
                <input name="otp" placeholder="Enter OTP" onChange={handleChange} />
                <button onClick={verifyOTP}>Verify OTP</button>
              </>
            )}

            {otpVerified && (
              <button onClick={handleRegister}>
                Register
              </button>
            )}
          </>
        )}

        <div className="signup-link">
          Already have account?{" "}
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </div>

      </div>
    </div>
  );
}

export default Signup;