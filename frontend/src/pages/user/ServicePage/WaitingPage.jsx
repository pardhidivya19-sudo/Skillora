import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../../services/api";

const WaitingPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

const { selectedDate, selectedTime, address, service, bookingId } = location.state || {};

console.log("WAITING PAGE BOOKING ID:", bookingId);
  const [status, setStatus] = useState("pending");

  // 🔥 CHECK STATUS EVERY 3 SEC
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get("/provider/my-latest-booking");

        const booking = res.data;

        if (booking.booking_status === "accepted") {
          clearInterval(interval);

         navigate(`/services/${service.provider_skill_id}/book/success`, {
  state: {
    selectedDate,
    selectedTime,
    address,
    service,
    bookingId // 🔥 VERY IMPORTANT
  }
});
        }

        setStatus(booking.booking_status);

      } catch (err) {
        console.log(err);
      }
    }, 3000);

    return () => clearInterval(interval);

  }, [navigate, selectedDate, selectedTime, address, service, bookingId]);

  return (
    <div style={{ padding: "80px", textAlign: "center" }}>
      <h1>⏳ Waiting for Confirmation</h1>
      <p>Your booking request has been sent to vendor.</p>
      <p>Please wait while vendor accepts your request.</p>

      <h3>Status: {status}</h3>
    </div>
  );
};

export default WaitingPage;