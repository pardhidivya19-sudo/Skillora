import React, { useState } from "react";
import "./Contact.css";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Contact = () => {
const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // 🔥 handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 submit
  if (!localStorage.getItem("token")) {
  alert("Please login first");
  navigate("/login");
  return;
}
  const handleSubmit = async () => {

  // 🔥 EMAIL VALIDATION ADD
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  if (!validateEmail(form.email)) {
    alert("Please enter valid email");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/provider/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    alert(data.message || "Message sent!");

    // reset form
    setForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });

  } catch (err) {
    console.log(err);
    alert("Something went wrong!");
  }
};

  return (
    <section className="contact-section">

      <h1 className="contact-title">Get in Touch</h1>

      <p className="contact-subtitle">
        Have a question or need support? We'd love to hear from you.
      </p>

      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-info">

          <div className="info-card">
            <div className="info-icon"><FiMail /></div>
            <div>
              <h3>Email</h3>
              <p className="info-main">hello@skillora.com</p>
              <p className="info-sub">We respond within 24 hours</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon"><FiPhone /></div>
            <div>
              <h3>Phone</h3>
              <p className="info-main">+91 9437989788</p>
              <p className="info-sub">Mon–Fri, 9am–6pm IST</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon"><FiMapPin /></div>
            <div>
              <h3>Office</h3>
              <p className="info-main">Nagpur, Maharashtra</p>
              <p className="info-sub">Visit us in person</p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form">

          <h2>Send a Message</h2>

          <div className="form-row">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </div>

          <input
            className="full"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
          />

          <textarea
            rows="6"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
          ></textarea>

          <button className="send-btn" onClick={handleSubmit}>
            <FiSend /> Send Message
          </button>

        </div>

      </div>

    </section>
  );
};

export default Contact;