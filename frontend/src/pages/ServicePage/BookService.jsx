import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookService.css";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";

const dates = [
  { day: "Sun", date: 29 },
  { day: "Mon", date: 30 },
  { day: "Tue", date: 31 },
  { day: "Wed", date: 1 },
  { day: "Thu", date: 2 },
  { day: "Fri", date: 3 },
  { day: "Sat", date: 4 },
];

const times = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const BookService = () => {

  const navigate = useNavigate();
const { slug } = useParams();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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
                 selectedDate?.date === d.date ? "selected" : ""
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
      state: { selectedDate, selectedTime }
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
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            alt="service"
          />

          <h3>Deep Home Cleaning</h3>
          <p>Cleaning</p>

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
            <span>$89</span>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;