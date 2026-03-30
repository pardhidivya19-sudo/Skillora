import React, { useState } from "react";
import "./AddressPage.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

const AddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const { selectedDate, selectedTime } = location.state || {};

  const [address, setAddress] = useState("");
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
    <div className="address-container">
      <div className="address-left">

        <div className="address-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </div>

        <h1 className="address-title">Book Your Service</h1>

        {/* STEPS */}
        <div className="address-steps">
          <div className="address-step done">
            <span>✓</span> Date & Time
          </div>

          <div className="address-line"></div>

          <div className="address-step active">
            <span>2</span> Address
          </div>

          <div className="address-line"></div>

          <div className="address-step">
            <span>3</span> Confirm
          </div>
        </div>

        {/* ADDRESS INPUT */}
        <div className="address-section">
          <h2>
            <FiMapPin /> Service Address
          </h2>

          <textarea
            placeholder="Enter your full address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="address-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <button
  className="continue-btn"
  disabled={!address}
  onClick={() =>
   navigate(`/services/${slug}/book/success`, {
  state: {
    selectedDate,
    selectedTime,
    address,
  },
})
  }
>
  Continue
</button>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="address-right">
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
<span>{selectedDate ? formatDate(selectedDate) : "-"}</span>
          </div>

          <div className="book-service-row">
            <span>Time</span>
            <span>{selectedTime || "-"}</span>
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

export default AddressPage;