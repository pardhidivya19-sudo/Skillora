import React from "react";
import "./Footer.css";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  fetchServices();
}, []);

const fetchServices = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/provider/categories");
    setServices(res.data); // already top 5 aa rahe hai backend se
  } catch (err) {
    console.log("Error fetching footer services:", err);
  }
};
  return (
    <footer className="footer">
<svg width="0" height="0">
  <defs>
    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#7C6BFF"/>
      <stop offset="100%" stopColor="#FF6A6A"/>
    </linearGradient>
  </defs>
</svg>
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col brand-col">

          <div className="footer-logo">
            <h2>Skillora</h2>
          </div>

          <p className="footer-desc">
            Your trusted marketplace for professional home and personal
            services. Quality guaranteed.
          </p>

          <div className="social-icons">

  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="social"
  >
    <FiFacebook />
  </a>

  <a
    href="https://twitter.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="social"
  >
    <FiTwitter />
  </a>

  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="social"
  >
    <FiInstagram />
  </a>

  <a
    href="https://www.youtube.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="social"
  >
    <FiYoutube />
  </a>

</div>

        </div>

        {/* Column 2 */}
        <div className="footer-col">

          <h3>Quick Links</h3>

         <ul>
  <li onClick={() => navigate("/services")}>Services</li>
  <li onClick={() => navigate("/professionals")}>Professionals</li>
  <li onClick={() => navigate("/about")}>About</li>
  <li onClick={() => navigate("/contact")}>Contact</li>
</ul>

        </div>


        {/* Column 3 */}
        <div className="footer-col">

          <h3>Services</h3>

          <ul>
  {services.map((item, index) => (
    <li
      key={index}
      onClick={() =>
navigate(
  `/services?category=${encodeURIComponent(item.category.toLowerCase())}`
)      }
    >
      {item.category}
    </li>
  ))}
</ul>

        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <FiMapPin className="contact-icon"/>
            <span>123 Service Avenue, Nagpur, Maharshtra - 440036</span>
          </div>

          <div className="contact-item">
            <FiPhone className="contact-icon"/>
            <span>+91 9437989788</span>
          </div>

          <div className="contact-item">
            <FiMail className="contact-icon"/>
            <span>skillora@gmail.com</span>
          </div>
        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">

        <p>© 2026 Skillora. All rights reserved.</p>

        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>

      </div>

    </footer>
  );
};

export default Footer;