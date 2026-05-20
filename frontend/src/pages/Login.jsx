import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token;

      // ✅ store token
      localStorage.setItem("token", token);

      // ✅ decode JWT
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // ✅ store user
      localStorage.setItem("user", JSON.stringify(payload));

      // ✅ NAVIGATION (same as before)
      if (role === "customer") {
        navigate("/user/home");
        window.location.reload(); // 🔥 IMPORTANT (Navbar update)

      } else if (role === "provider") {

        if (payload.approval_status === "approved") {
          navigate("/vendor");
          window.location.reload(); // 🔥

        } else {
          navigate("/vendor-verification");
        }

      } else if (role === "admin") {

        window.location.href = "http://localhost:3001";

      }

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Skillora Login</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="login-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Signup
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;