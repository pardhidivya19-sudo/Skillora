import React, { useEffect, useState } from "react";
import API from "../services/adminApi";
import "../styles/Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState({});
  

 useEffect(() => {
  fetchPayments();
}, [status]);

useEffect(() => {
  API.get("/payments-summary").then(res => {
    setSummary(res.data);
  });
}, []);

 const fetchPayments = async () => {
  try {
    const response = await API.get(
      `/payments${status ? `?status=${status}` : ""}`
    );

    setPayments(response.data);
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

const handleRefund = async (id) => {
  try {
    await API.put(`/refund-payment/${id}`);
    fetchPayments();   // list refresh
  } catch (error) {
    console.error("Refund Error:", error);
  }
};

  return (
    <div className="payments-page">
      <h2>Payments Management</h2>
      <div className="payment-cards">
      <div className="card">
        <h4>Total Revenue</h4>
        <p>₹ {summary.totalRevenue}</p>
      </div>

      <div className="card">
        <h4>Total Payments</h4>
        <p>{summary.totalPayments}</p>
      </div>

      <div className="card">
        <h4>Total Refunded</h4>
        <p>{summary.totalRefunded}</p>
      </div>
    </div>

<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  style={{ marginBottom: "20px", padding: "8px" }}
>
  <option value="">All</option>
  <option value="Success">Success</option>
  <option value="Pending">Pending</option>
  <option value="Failed">Failed</option>
</select>

<table className="admin-table"></table>

      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.customer_name}</td>
              <td>{p.provider_name}</td>
              <td>₹ {p.total_amount}</td>
              <td>{p.payment_method}</td>
              <td>
  <span className={`payment-badge ${p.payment_status?.toLowerCase()}`}>
    {p.payment_status}
  </span>
</td>
              <td>
                {new Date(p.payment_date).toLocaleDateString()}
              </td>
               <td>
    {p.payment_status?.toLowerCase() === "success" &&
     p.refund_status !== "Refunded" && (
      <button
        className="refund-btn"
        onClick={() => handleRefund(p.payment_id)}
      >
        Refund
      </button>
    )}
  </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;