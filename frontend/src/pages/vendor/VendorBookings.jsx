import { useEffect, useState } from "react";
import API from "../../services/api";
import "./VendorBookings.css";
import toast from "react-hot-toast";

function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
const [selectedBookingId, setSelectedBookingId] = useState(null);
const [reason, setReason] = useState("");

  // 🔹 Fetch all bookings for vendor
  const fetchBookings = async () => {
    try {
      const res = await API.get("/provider/vendor/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
  if (filter === "all") return true;
  return b.booking_status === filter;
});

  // 🔹 Update booking status
  const updateStatus = async (id, status, reason = null) => {
  try {
    await API.put(`/provider/vendor/bookings/${id}`, {
      status,
      cancel_reason: reason
    });


    // 🔥 TOAST NOTIFICATIONS
    if (status === "accepted") {
      toast.success("Booking Accepted ✅");
    } 
    else if (status === "rejected") {
      toast.error("Booking Rejected ❌");
    } 
    else if (status === "completed") {
      toast("Booking Completed 🎉");
    }

  } catch (err) {
    toast.error("Something went wrong ❌");
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>

     <div className="filter-tabs">

  <button
    className={filter === "all" ? "active" : ""}
    onClick={() => setFilter("all")}
  >
    All
  </button>

  <button
    className={filter === "pending" ? "active" : ""}
    onClick={() => setFilter("pending")}
  >
    Pending
  </button>

  <button
    className={filter === "accepted" ? "active" : ""}
    onClick={() => setFilter("accepted")}
  >
    Accepted
  </button>

  <button
    className={filter === "completed" ? "active" : ""}
    onClick={() => setFilter("completed")}
  >
    Completed
  </button>

  <button
    className={filter === "rejected" ? "active" : ""}
    onClick={() => setFilter("rejected")}
  >
    Rejected
  </button>

</div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((b) => (
            <div className="booking-card" key={b.booking_id}>
              
              <h3>{b.skill_name}</h3>

              <p><b>User:</b> {b.user_name}</p>

              <p><b>Date:</b> {b.booking_date}</p>
              <p><b>Time:</b> {b.start_time} - {b.end_time}</p>
              <p><b>Phone:</b> {b.phone}</p>

<p><b>Address:</b> {b.address || "N/A"}</p>

{b.notes && (
  <p><b>Notes:</b> {b.notes}</p>
)}

{b.booking_status === "rejected" && b.cancel_reason && (
  <p style={{ color: "red" }}>
    <b>Cancel Reason:</b> {b.cancel_reason}
  </p>
)}
              <p><b>Amount:</b> ₹{b.total_amount}</p>

              <p>
                <b>Status:</b>{" "}
                <span className={`status ${b.booking_status}`}>
                  {b.booking_status}
                </span>
              </p>

              {/* 🔹 Action Buttons */}
              <div className="actions">

  {b.booking_status === "pending" && (
    <>
      <button
        className="accept-btn"
        onClick={() => {
          console.log("Accept clicked", b.booking_id);
          updateStatus(b.booking_id, "accepted");
        }}
      >
        Accept
      </button>

      <button
  className="reject-btn"
  onClick={() => {
  setSelectedBookingId(b.booking_id);
  setShowModal(true);
}}
>
  Reject
</button>
    </>
  )}

  {b.booking_status === "accepted" && (
    <button
      className="complete-btn"
      onClick={() => {
        console.log("Complete clicked", b.booking_id);
        updateStatus(b.booking_id, "completed");
      }}
    >
      Mark Completed
    </button>
  )}

  

</div>

            </div>
          ))}
        </div>
      )}

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Reject Booking</h3>

      <textarea
        placeholder="Enter cancellation reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowModal(false);
            setReason("");
          }}
        >
          Cancel
        </button>

        <button
          className="submit-btn"
          onClick={() => {
            updateStatus(selectedBookingId, "rejected", reason);
            setShowModal(false);
            setReason("");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>

  );
}

export default VendorBookings;