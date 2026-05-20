import React, { useEffect, useState } from "react";
import "./SuccessPage.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import API from "../../../services/api";

const SuccessPage = () => {
  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [paymentMode, setPaymentMode] = useState("");
  const [address, setAddress] = useState("");
const bookingId =
  location.state?.bookingId || localStorage.getItem("bookingId");

console.log("FINAL BOOKING ID:", bookingId);

  const { selectedDate, selectedTime, service } = location.state || {};

  // ✅ FETCH ADDRESS
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await API.get("/provider/my-address");
        setAddress(res.data.address);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAddress();
  }, []);

  // 🔥 UPDATED HANDLE PAYMENT
  const handlePayment = async () => {

    if (!paymentMode) {
      alert("Please select payment method");
      return;
    }

    // 💵 COD CASE
    if (paymentMode === "cod") {
      try {
        await API.post("/provider/cod-payment", {
          booking_id: bookingId
        });

        alert("Booking Confirmed (Cash on Service)");
        navigate("/account");

      } catch (err) {
        console.log(err);
        alert("COD failed");
      }
    }

    // 💳 ONLINE CASE
    if (paymentMode === "online") {

  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Razorpay SDK failed to load");
    return;
  }

  try {
    const res = await API.post("/provider/create-order", {
      amount: service.price
    });

    const order = res.data;

    const options = {
      key: "rzp_test_SisgScM2UZNokw", // 👈 same as backend key
      amount: order.amount,
      currency: "INR",
      name: "Skillora",
      description: "Service Booking",
      order_id: order.id,

      handler: async function (response) {

       console.log("SENDING BOOKING ID:", bookingId);

await API.post("/provider/verify-payment", {
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  booking_id: bookingId
});

        alert("Payment Successful ✅");
        navigate("/account");
      },

      theme: {
        color: "#7b61ff"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    alert("Payment failed");
  }
}
  };

  if (!service) {
    return <h2>Loading...</h2>;
  }

  const formatDate = (d) => {
    if (!d) return "";

    const date = d.fullDate;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="success-container">

      {/* LEFT */}
      <div className="success-left">

        <div className="success-steps">
          <div className="success-step done"><span>✓</span> Date & Time</div>
          <div className="success-line"></div>
          <div className="success-step done"><span>✓</span> Address</div>
          <div className="success-line"></div>
          <div className="success-step active"><span>3</span> Confirm</div>
        </div>

        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your service has been scheduled successfully.</p>

          <div className="success-details">
            <p><strong>Service:</strong> {service?.title || service?.skill_name}</p>
            <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Address:</strong> {address}</p>
          </div>
        </div>

        {/* 🔥 PAYMENT OPTIONS */}
        <div className="payment-options">
          <div
            className={`payment-option ${paymentMode === "cod" ? "active" : ""}`}
            onClick={() => setPaymentMode("cod")}
          >
            💵 Cash on Service
          </div>

          <div
            className={`payment-option ${paymentMode === "online" ? "active" : ""}`}
            onClick={() => setPaymentMode("online")}
          >
            💳 Pay Online
          </div>
        </div>

        {/* 🔥 BUTTON */}
        <div className="payment-wrapper">
          <button className="payment-btn" onClick={handlePayment}>
            Continue to Payment
          </button>
        </div>

        <div className="success-actions">
          <button className="dashboard-btn" onClick={() => navigate("/account")}>
            Go to Dashboard
          </button>

          <button className="book-btn" onClick={() => navigate("/services")}>
            Book Another
          </button>
        </div>

      </div>

      {/* RIGHT */}
      <div className="success-right">
        <div className="book-service-summary">

          <h2>Booking Summary</h2>

          <img
            src={service?.image_url || "https://via.placeholder.com/300"}
            alt={service?.title}
          />

          <h3>{service?.title || service?.skill_name}</h3>
          <p>{service?.category}</p>

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
            <span>₹{service?.price || 0}</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SuccessPage;