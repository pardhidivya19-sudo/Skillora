import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  CalendarCheck,
  CalendarClock,
  IndianRupee,
  Wrench,
  Star
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


import "./VendorHome.css";
import { useNavigate } from "react-router-dom";

function VendorHome() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  API.get("/provider/dashboard-stats")
    .then(res => setData(res.data))
    .catch(err => console.log(err));

  API.get("/provider/profile")
    .then(res => setProfile(res.data))
    .catch(err => console.log(err));

  // 🔥 CHART DATA (existing backend API)
  API.get("/provider/earnings-details")
    .then(res => setChartData(res.data.monthly))
    .catch(err => console.log(err));

}, []);

  return (
    <div className="vh-container">

      <h2 className="vh-title">Dashboard</h2>
      <p className="vh-subtitle">
  Welcome back, {profile?.name || "Vendor"} 👋
</p>

      <div className="vh-grid">

        {/* TOTAL BOOKINGS */}
        <div className="vh-card" onClick={() => navigate("/vendor/bookings")}>
          <div className="vh-icon blue">
            <CalendarCheck size={24} />
          </div>
          <div className="vh-content">
            <h3>{data?.total_bookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        {/* TODAY BOOKINGS */}
        <div className="vh-card" onClick={() => navigate("/vendor/bookings")}>
          <div className="vh-icon purple">
            <CalendarClock size={20} />
          </div>
          <div className="vh-content">
            <h3>{data?.today_bookings || 0}</h3>
            <p>Today Bookings</p>
          </div>
        </div>

        {/* EARNINGS */}
        <div className="vh-card" onClick={() => navigate("/vendor/earnings")}>
          <div className="vh-icon green">
            <IndianRupee size={20} />
          </div>
          <div className="vh-content">
            <h3>₹{data?.total_earnings || 0}</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        {/* SERVICES */}
        <div className="vh-card" onClick={() => navigate("/vendor/services")}>
          <div className="vh-icon orange">
            <Wrench size={20} />
          </div>
          <div className="vh-content">
            <h3>{data?.active_services || 0}</h3>
            <p>Active Services</p>
          </div>
        </div>

        {/* RATING */}
        <div className="vh-card">
          <div className="vh-icon yellow">
            <Star size={20} />
          </div>
          <div className="vh-content">
            <h3>{Number(data?.rating || 0).toFixed(1)}</h3>
            <p>Rating</p>
          </div>
        </div>

      </div>
      <div className="vh-chart">

  <h3>Earnings Overview</h3>

  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={chartData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey={(data) => Number(data.earnings)} />
    </BarChart>
  </ResponsiveContainer>

</div>
    </div>
  );
}

export default VendorHome;