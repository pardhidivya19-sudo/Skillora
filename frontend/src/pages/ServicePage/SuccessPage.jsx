import React from "react";
import "./SuccessPage.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { selectedDate, selectedTime, address } = location.state || {};

  const formatDate = (d) => {
    if (!d) return "";
    const today = new Date();
    const newDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      d.date
    );
    return newDate.toISOString().split("T")[0];
  };

  return (
    <div className="success-container">

      {/* LEFT */}
      <div className="success-left">

        {/* STEPS */}
        <div className="success-steps">
          <div className="success-step done"><span>✓</span> Date & Time</div>
          <div className="success-line"></div>
          <div className="success-step done"><span>✓</span> Address</div>
          <div className="success-line"></div>
          <div className="success-step active"><span>3</span> Confirm</div>
        </div>

        {/* SUCCESS CARD */}
        <div className="success-card">

          <FaCheckCircle className="success-icon" />

          <h1>Booking Confirmed!</h1>
          <p>Your service has been scheduled successfully.</p>

          <div className="success-details">
            <p><strong>Service:</strong> Deep Home Cleaning</p>
            <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Address:</strong> {address}</p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="success-actions">

          <button
            className="dashboard-btn"
            onClick={() => navigate("/account")}
          >
            Go to Dashboard
          </button>

          <button
            className="book-btn"
            onClick={() => navigate("/services")}
          >
            Book Another
          </button>

        </div>

      </div>

      {/* RIGHT SUMMARY */}
      <div className="success-right">

        <div className="book-service-summary">

          <h2>Booking Summary</h2>

          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            alt="service"
          />

          <h3>Deep Home Cleaning</h3>
          <p>Cleaning</p>

          <hr />

          <div className="book-service-row">
            <span>Date</span>
            <span>{formatDate(selectedDate)}</span>
          </div>

          <div className="book-service-row">
            <span>Time</span>
            <span>{selectedTime}</span>
          </div>

          <div className="book-service-total">
            <span>Total</span>
            <span>$89</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SuccessPage;