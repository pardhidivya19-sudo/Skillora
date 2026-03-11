import React, { useEffect, useState, useCallback } from "react";
import API from "../services/adminApi";
import "../styles/Dashboard.css"; // or create Bookings.css if you want
import "../styles/Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ==========================
  // FETCH BOOKINGS
  // ==========================
  const fetchBookings = useCallback(async () => {
  try {
    setLoading(true);

    const response = await API.get(
      `/bookings${status ? `?status=${status}` : ""}`
    );

    setBookings(response.data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    setLoading(false);
  }
}, [status]);

useEffect(() => {
  fetchBookings();
}, [fetchBookings]);

  // ==========================
  // CANCEL BOOKING
  // ==========================
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await API.put(`/cancel-booking/${id}`);
      fetchBookings(); // refresh list
    } catch (error) {
      console.error("Cancel Error:", error);
    }
  };
// ==========================
// VIEW BOOKING DETAILS
// ==========================
const handleView = async (id) => {
  try {
    const response = await API.get(`/booking-details/${id}`);
    setSelectedBooking(response.data);
  } catch (error) {
    console.error("View Error:", error);
  }
};
  // ==========================
  // STATUS BADGE COLOR
  // ==========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { color: "#ff9800", fontWeight: "600" };
      case "Confirmed":
        return { color: "#2196f3", fontWeight: "600" };
      case "Completed":
        return { color: "#4caf50", fontWeight: "600" };
      case "Cancelled":
        return { color: "#f44336", fontWeight: "600" };
      default:
        return {};
    }
  };

  return (
    <div className="details-container bookings-page">
      <h2>Booking Management</h2>

      {/* ==========================
          FILTER SECTION
      ========================== */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ==========================
          TABLE SECTION
      ========================== */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td>{b.booking_id}</td> 
                  <td>{b.customer_name}</td>
                  <td>{b.provider_name}</td>
                  <td>
                   {new Date(b.booking_date).toLocaleDateString()} 
<br />
{b.start_time} - {b.end_time}
                  </td>
                  <td>₹ {b.total_amount}</td>
                  <td style={getStatusStyle(b.booking_status)}>
                    {b.booking_status}
                  </td>
                  <td className="action-buttons">
  <button
    onClick={() => handleView(b.booking_id)}
    className="booking-view-btn"
  >
    View
  </button>

  {b.booking_status === "Pending" && (
    <button
      onClick={() => handleCancel(b.booking_id)}
      className="booking-cancel-btn"
    >
      Cancel
    </button>
  )}
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {selectedBooking && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
}}>
      <h3 style={{ marginBottom: "15px" }}>Booking Details</h3>

      <p><strong>ID:</strong> {selectedBooking.booking_id}</p>
      <p><strong>Customer:</strong> {selectedBooking.customer_name}</p>
      <p><strong>Provider:</strong> {selectedBooking.provider_name}</p>
      <p><strong>Date:</strong> {new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {selectedBooking.start_time} - {selectedBooking.end_time}</p>
      <p><strong>Status:</strong> {selectedBooking.booking_status}</p>
      <p><strong>Amount:</strong> ₹ {selectedBooking.total_amount}</p>
      <hr />

<p><strong>Skill:</strong> {selectedBooking.skill_name}</p>

<h4>Customer Info</h4>
<p>Email: {selectedBooking.customer_email}</p>
<p>Phone: {selectedBooking.customer_phone}</p>

<h4>Provider Info</h4>
<p>Email: {selectedBooking.provider_email}</p>
<p>Phone: {selectedBooking.provider_phone}</p>
<p>Experience: {selectedBooking.experience}</p>
<p>Location: {selectedBooking.location}</p>

<hr />
<p><strong>Created At:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>

     <button
  onClick={() => setSelectedBooking(null)}
  style={{
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Close
</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Bookings;