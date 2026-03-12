import React from "react";
import "./Contact.css";

import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

const Contact = () => {
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
            <div className="info-icon">
              <FiMail />
            </div>

            <div>
              <h3>Email</h3>
              <p className="info-main">hello@skillora.com</p>
              <p className="info-sub">We respond within 24 hours</p>
            </div>
          </div>


          <div className="info-card">
            <div className="info-icon">
              <FiPhone />
            </div>

            <div>
              <h3>Phone</h3>
              <p className="info-main">+91 9437989788</p>
              <p className="info-sub">Mon–Fri, 9am–6pm IST</p>
            </div>
          </div>


          <div className="info-card">
            <div className="info-icon">
              <FiMapPin />
            </div>

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
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
          </div>

          <input
            className="full"
            type="text"
            placeholder="Subject"
          />

          <textarea
            rows="6"
            placeholder="Your message..."
          ></textarea>

          <button className="send-btn">
            <FiSend /> Send Message
          </button>

        </div>

      </div>

    </section>
  );
};

export default Contact;