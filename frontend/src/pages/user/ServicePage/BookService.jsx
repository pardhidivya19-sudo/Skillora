import React, { useState } from "react";
import API from "../../../services/api";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookService.css";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";


const BookService = () => {

  const generateDates = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    days.push({
      fullDate: d, // ✅ important (backend ke liye)
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate()
    });
  }

  return days;
};

  const navigate = useNavigate();
    const { slug } = useParams();
 const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [service, setService] = useState(null);
const [times, setTimes] = useState([]);
const [dates, setDates] = useState([]);
    
  useEffect(() => {
     if (!localStorage.getItem("token")) {
    alert("Please login first");
    navigate("/login");
    return;
  }
  // 🔥 service fetch
  API.get("/provider/all-services")
    .then(res => {
      const found = res.data.find(
        (s) => s.provider_skill_id === slug
      );
      setService(found);
    });

  // 🔥 TIME SLOTS (backend se aayega)
  API.get(`/provider/availability/${slug}`)
    .then(res => {
      setTimes(res.data); // ["10:00 AM", "11:00 AM"]
    })
    .catch(err => {
      console.log(err);

      // fallback (temporary)
      setTimes([
        "09:00 AM",
        "10:00 AM",
        "11:00 AM"
      ]);
    });
 setDates(generateDates());
}, [slug, navigate]);


if (!service) {
  return <h2>Loading...</h2>;
}
const formatDate = (d) => {
  if (!d) return "";
  return d.fullDate.toISOString().split("T")[0];
};

  return (
    <div className="book-service-container">
      <div className="book-service-left">
        <div className="book-service-back">
          <FaArrowLeft /> Back
        </div>

        <h1 className="book-service-title">Book Your Service</h1>

        <div className="book-service-steps">
          <div className="book-service-step active">
            <span>1</span> Date & Time
          </div>
          <div className="book-service-line"></div>
          <div className="book-service-step">
            <span>2</span> Address
          </div>
          <div className="book-service-line"></div>
          <div className="book-service-step">
            <span>3</span> Confirm
          </div>
        </div>

        {/* DATE */}
        <div className="book-service-section">
          <h2>
            <FiCalendar /> Select Date
          </h2>

          <div className="book-service-date-grid">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`book-service-date-card ${
                 selectedDate?.fullDate === d.fullDate ? "selected" : ""
                }`}
                onClick={() => setSelectedDate(d)}
              >
                <p>{d.day}</p>
                <h3>{d.date}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* TIME */}
        <div className="book-service-section">
          <h2>
            <FiClock /> Select Time
          </h2>

          <div className="book-service-time-grid">
            {times.map((t, i) => (
              <div
                key={i}
                 className={`book-service-time-card ${
      selectedTime === t ? "selected" : ""
    }`}
    onClick={() => setSelectedTime(t)}
  >
                {t}
              </div>
            ))}
          </div>
        </div>
<button
  className="book-service-btn"
  disabled={!selectedDate || !selectedTime}
   onClick={() =>
    navigate(`/services/${slug}/book/address`, {
      state: { selectedDate, selectedTime, service}
    })
  }
>
  Continue
</button>

      </div>

      {/* RIGHT */}
      <div className="book-service-right">
        <div className="book-service-summary">
          <h2>Booking Summary</h2>

          <img
  src={service?.image_url || "https://via.placeholder.com/300"}
  alt={service?.title}
/>

         <h3>{service?.title || service?.skill_name}</h3>
<p>{service?.category}</p>
          <hr />
 {selectedDate && (
  <div className="book-service-row">
    <span>Date</span>
    <span>{formatDate(selectedDate)}</span>
  </div>
)}

{selectedTime && (
  <div className="book-service-row">
    <span>Time</span>
    <span>{selectedTime}</span>
  </div>
)}
          <div className="book-service-total">
            <span>Total</span>
            <span>₹{service?.price || 0}</span>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;