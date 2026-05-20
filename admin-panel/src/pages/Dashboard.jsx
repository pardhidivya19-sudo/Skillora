import { useEffect, useState } from "react";
import API from "../services/adminApi";
import "../styles/Dashboard.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
const [monthlyBookings, setMonthlyBookings] = useState([]);
const [statusStats, setStatusStats] = useState([]);
const [topProviders, setTopProviders] = useState([]);

useEffect(() => {
  const fetchAll = async () => {
    const dashboard = await API.get("/dashboard");
    const revenue = await API.get("/monthly-revenue");
    const bookings = await API.get("/monthly-bookings");
    const status = await API.get("/booking-status-stats");
    const providers = await API.get("/top-providers-revenue");
    

    setStats(dashboard.data);
    setMonthlyRevenue(revenue.data);
    setMonthlyBookings(bookings.data);
    setStatusStats(status.data);
    setTopProviders(providers.data);
  };

  fetchAll();
}, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log("Error fetching dashboard data");
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="cards">
        <div className="card">
          <h4>Total Users</h4>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="card">
          <h4>Total Bookings</h4>
          <p>{stats.totalBookings}</p>
        </div>

        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹ {stats.totalRevenue}</p>
        </div>
      </div>
      <div className="charts-container">
     <div className="chart-card">
  <h3>Monthly Revenue</h3>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={monthlyRevenue}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#4e73df"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
  </div>

<div className="chart-card">
  <h3>Monthly Bookings</h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={monthlyBookings}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="bookings" fill="#4e73df" />
    </BarChart>
  </ResponsiveContainer>

</div>

<div className="chart-card">
  <h3>Booking Status Distribution</h3>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={statusStats}
        dataKey="count"
        nameKey="booking_status"
        outerRadius={90}
        
      >
        {statusStats.map((entry, index) => (
          <Cell
              key={index}
              fill={["#4e73df","#16a34a","#f59e0b","#dc2626"][index % 4]}
            />
        ))}
      </Pie>

      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

</div>
  <div className="chart-card">
<h3>Top Providers Revenue</h3>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={topProviders}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="revenue" fill="#16a34a"/>
</BarChart>
</ResponsiveContainer>

</div>

</div> 
    </div>
  );
};

export default Dashboard;