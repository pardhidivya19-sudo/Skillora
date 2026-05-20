import { useEffect, useState } from "react";
import API from "../services/adminApi";
import "../styles/Withdrawals.css"; // 👈 new css file

function Withdrawals() {
  const [data, setData] = useState([]);

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get("/transactions");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/transactions/${id}`, { status });
      fetchWithdrawals();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return (
    <div className="withdrawals-container">
      <h2 className="withdrawals-title">Withdrawal Requests 💸</h2>

      {data.map((t) => (
        <div key={t.transaction_id} className="withdraw-card">

          <p><b>Vendor:</b> {t.provider_name}</p>
<p><b>Skill:</b> {t.skill_name || "N/A"}</p>
          <p><b>Amount:</b> ₹{t.amount}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={`withdraw-status ${t.status}`}>
              {t.status}
            </span>
          </p>

          {t.status === "pending" && (
            <div className="withdraw-actions">
              <button
                className="withdraw-approve"
                onClick={() => updateStatus(t.transaction_id, "completed")}
              >
                Approve
              </button>

              <button
                className="withdraw-reject"
                onClick={() => updateStatus(t.transaction_id, "rejected")}
              >
                Reject
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default Withdrawals;