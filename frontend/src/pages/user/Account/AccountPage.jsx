import React, { useState, useEffect } from "react";
import "./AccountPage.css";
import { useContext } from "react";
import { WishlistContext } from "../../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiHeart,
  FiCreditCard,
  FiUser
} from "react-icons/fi";
import axios from "axios";

const AccountPage = () => {
const { wishlist } = useContext(WishlistContext);
const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");

  // 🔥 FETCH USER + BOOKINGS
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setUserName(user.name);

      axios
        .get(`http://localhost:5000/api/provider/user/bookings/${user.id}`)
        .then((res) => {
          setBookings(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="account-page">

      {/* HEADER */}
      <div className="account-header">

        <div className="account-icon">
          <FiUser />
        </div>

        <div>
          <h2>Welcome back, {userName}</h2>
          <p>Manage your bookings and preferences</p>
        </div>

      </div>

      {/* TABS */}
      <div className="account-tabs">

        <button
          className={activeTab === "upcoming" ? "tab active" : "tab"}
          onClick={() => setActiveTab("upcoming")}
        >
          <FiCalendar /> Upcoming
        </button>

        <button
          className={activeTab === "past" ? "tab active" : "tab"}
          onClick={() => setActiveTab("past")}
        >
          <FiClock /> Past Bookings
        </button>

        <button
          className={activeTab === "saved" ? "tab active" : "tab"}
          onClick={() => setActiveTab("saved")}
        >
          <FiHeart /> Saved
        </button>

        <button
          className={activeTab === "payments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("payments")}
        >
          <FiCreditCard /> Payments
        </button>

        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser /> Profile
        </button>

      </div>

      {/* CONTENT */}
      <div className="account-content">

        {/* ✅ UPCOMING */}
        {activeTab === "upcoming" && (
          bookings
.filter(
  b =>
    b.status === "accepted" &&
    new Date(b.booking_date) >= new Date()
)            .map((b) => (

              <div className="account-booking-card" key={b.booking_id}>

                <img src={b.image_url || "/images/cleaning.jpg"} alt="" />

                <div>
                  <h3>{b.title}</h3>
                  <p>{b.category}</p>
                  <span>
                    {new Date(b.booking_date).toDateString()} • {b.time}
                  </span>
                </div>

                 {/* ✅ YAHI CHANGE KARNA HAI */}
  <div className="account-status">
    {b.status === "accepted" ? "Scheduled" : b.status}
  </div>

              </div>

            ))
        )}

        {/* ✅ PAST */}
        {activeTab === "past" && (
          bookings
.filter(
  b =>
    b.status === "completed" ||
    new Date(b.booking_date) < new Date()
)            .map((b) => (

              <div className="account-booking-card" key={b.booking_id}>

                <img src={b.image_url || "/images/electrical.jpg"} alt="" />

                <div>
                  <h3>{b.title}</h3>
                  <p>⭐ {Number(b.rating || 4.5).toFixed(1)}</p>
                  <span>
                    Completed on {new Date(b.booking_date).toDateString()}
                  </span>
                </div>

                <button className="account-rebook">
                  Rebook
                </button>

              </div>

            ))
        )}

        {/* ✅ SAVED (abhi same rakha hai) */}
      {activeTab === "saved" && (
  <div className="account-saved-grid">

    {wishlist.map((service) => (

      <div className="account-service-card" key={service.id}>

        <img src={service.image} alt="" />

        <h3>{service.title}</h3>

        <p>₹{service.price}</p>

        <button
          onClick={() => navigate(`/services/${service.id}`)}
        >
          View Details
        </button>

      </div>

    ))}

  </div>
)}

        {/* ✅ PAYMENTS */}
        {activeTab === "payments" && (
          <table className="account-payment-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td>{b.title}</td>
                  <td>{new Date(b.booking_date).toDateString()}</td>
                  <td>₹{b.price}</td>
                  <td className="account-paid">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ✅ PROFILE */}
        {activeTab === "profile" && (
          <div className="account-profile-form">

            <input defaultValue={userName} placeholder="Enter full name" />
            <input placeholder="Enter email" />
            <input placeholder="Enter phone" />
            <input placeholder="Enter address" />

            <button className="account-save-btn">
              Save Changes
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default AccountPage;