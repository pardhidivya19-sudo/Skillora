import React, { useState, useEffect } from "react";
import "./AddressPage.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import API from "../../../services/api";

const AddressPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  // 🔥 receive from previous page
  const { selectedDate, selectedTime, service: passedService } = location.state || {};

  // 🔥 state (fallback ke liye)
  const [service, setService] = useState(passedService || null);
const [address, setAddress] = useState({
  street: "",
  area: "",
  city: "",
  state: "",
  pincode: ""
});
  // 🔥 fallback API (IMPORTANT FIX)
  useEffect(() => {
    if (!service && slug) {
      API.get("/provider/all-services")
        .then(res => {
          const found = res.data.find(
            (s) => s.provider_skill_id === slug
          );
          setService(found);
        })
        .catch(err => console.log(err));
    }
  }, [slug, service]);

  // ✅ loading safe
  if (!service) {
    return (
      <div style={{ padding: "50px" }}>
        <h2>Loading service...</h2>
      </div>
    );
  }

  // ✅ save address API
 const handleSaveAddress = async () => {
  try {
    const fullAddress = `
${address.street}, 
${address.area}, 
${address.city}, 
${address.state} - ${address.pincode}
`;
    // ✅ STEP 1: EXISTING (UNCHANGED)
    await API.post("/provider/save-address", {
      address: fullAddress
    });

    // ✅ STEP 2: NEW (BOOKING CREATE ADD KARO)
const res = await API.post("/provider/create-booking", {
  provider_skill_id: service.provider_skill_id,   // ✅ FIX
  booking_date: selectedDate.fullDate,           // ✅ FIX
  start_time: selectedTime,                      // ✅ FIX
  address: fullAddress,                          // ✅ FIX
  total_amount: service.price                    // ✅ FIX
});

console.log("BOOKING RESPONSE:", res.data); // 👈 ADD THIS

// 🔥 VERY IMPORTANT
localStorage.setItem("bookingId", res.data.booking_id);

navigate(`/services/${slug}/book/waiting`, {
  state: {
    selectedDate,
    selectedTime,
    address,
    service,
    bookingId: res.data.booking_id // 🔥 MUST
  }
});
  } catch (err) {
    console.log(err);
    alert("Failed to save address");
  }
};
const handleChange = (e) => {
  setAddress({
    ...address,
    [e.target.name]: e.target.value
  });
};
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

      {/* LEFT */}
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

          <div className="address-grid">

  <input
    type="text"
    name="street"
    placeholder="Street / House No"
    value={address.street}
    onChange={handleChange}
  />

  <input
    type="text"
    name="area"
    placeholder="Area / Locality"
    value={address.area}
    onChange={handleChange}
  />

  <input
    type="text"
    name="city"
    placeholder="City"
    value={address.city}
    onChange={handleChange}
  />

  <input
    type="text"
    name="state"
    placeholder="State"
    value={address.state}
    onChange={handleChange}
  />

  <input
    type="text"
    name="pincode"
    placeholder="Pincode"
    value={address.pincode}
    onChange={handleChange}
  />

</div>
        </div>

        {/* BUTTONS */}
        <div className="address-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            className="continue-btn"
            disabled={
  !address.street ||
  !address.city ||
  !address.state ||
  !address.pincode
}
            onClick={handleSaveAddress}
          >
            Continue
          </button>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="address-right">
        <div className="book-service-summary">

          <h2>Booking Summary</h2>

          {/* IMAGE */}
          <img
            src={service?.image_url || "https://via.placeholder.com/300"}
            alt={service?.title}
          />

          {/* TITLE */}
          <h3>{service?.title || service?.skill_name}</h3>

          {/* CATEGORY */}
          <p>{service?.category}</p>

          <hr />

          {/* DATE */}
          <div className="book-service-row">
            <span>Date</span>
            <span>{selectedDate ? formatDate(selectedDate) : "-"}</span>
          </div>

          {/* TIME */}
          <div className="book-service-row">
            <span>Time</span>
            <span>{selectedTime || "-"}</span>
          </div>

          {/* PRICE */}
          <div className="book-service-total">
            <span>Total</span>
            <span>₹{service?.price || 0}</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AddressPage;