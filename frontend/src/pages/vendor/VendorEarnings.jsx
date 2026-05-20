import { useEffect, useState } from "react";
import API from "../../services/api";
import "./VendorEarnings.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function VendorEarnings() {
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
  try {
    const res = await API.get("/provider/earnings-details");
    setData(res.data);
  } catch (err) {
    console.error(err);
  }
};

const [amount, setAmount] = useState("");
const handleWithdraw = async () => {
  try {
    await API.post("/provider/withdraw", { amount });
    alert("Withdrawal successful");
    setAmount("");
    fetchData(); // refresh
  } catch (err) {
    alert(err.response?.data?.message);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const chartData = {
  labels: data?.monthly?.map((m) => m.month),
  datasets: [
    {
      label: "Earnings",
      data: data?.monthly?.map((m) => m.earnings),
    },
  ],
};

  return (
    <div className="earnings-container">
      <h2>Earnings Overview 💰</h2>

      <div className="earnings-grid">
        <div className="earn-card">
    <h3>₹{data?.summary?.total_earnings || 0}</h3>
    <p>Total Earnings</p>
  </div>

  <div className="earn-card">
    <h3>₹{data?.summary?.monthly_earnings || 0}</h3>
    <p>This Month</p>
  </div>

        <div className="earn-card">
          <h3>{data?.summary?.total_bookings || 0}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="earn-card">
          <h3>{data?.summary?.completed || 0}</h3>
          <p>Completed</p>
        </div>

        <div className="earn-card">
          <h3>{data?.summary?.pending || 0}</h3>
          <p>Pending</p>
        </div>

        <div className="earn-card">
  <h3>₹{data?.summary?.available_balance || 0}</h3>
<p>Available Balance</p>
</div>
<div className="earn-card">
  <h3>₹{data?.summary?.total_withdrawn || 0}</h3>
  <p>Total Withdrawn</p>
</div>

<div className="earn-card">
  <h3>₹{data?.summary?.admin_commission || 0}</h3>
  <p>Admin Commission</p>
</div>
      </div>
      
      {/* ✅ STEP 4: GRAPH */}
<div className="earnings-bottom">

  {/* GRAPH */}
  <div className="graph-box">
    <h3>Monthly Earnings 📊</h3>
    {data && <Bar data={chartData} />}
  </div>
  

  {/* TRANSACTIONS */}
  <div className="transactions-box">
    <h3>Recent Transactions</h3>

    {data?.transactions?.map((t) => (
      <div key={t.booking_id} className="transaction-card">
        <p><b>{t.skill_name}</b></p>
        <p>₹{t.amount}</p>
        <p>{t.created_at}</p>
        <p>
      <b>Status:</b>{" "}
      <span className={`status ${t.status}`}>
        {t.status}
      </span>
    </p>
      </div>
    ))}
  </div>
  <div className="withdraw-box">
  <h3>Withdraw Money 💸</h3>

  <input
    type="number"
    placeholder="Enter amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />

  <button onClick={handleWithdraw}>
    Withdraw
  </button>
</div>

</div>
    </div>
    
  );
}

export default VendorEarnings;