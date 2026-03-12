import React from "react";
import "./CTASection.css";
import { FiShield, FiClock, FiStar, FiCheckCircle } from "react-icons/fi";

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <div className="cta-top">

          <div className="cta-text">
            <h2>Ready to book your first service?</h2>
            <p>
              Join 50,000+ happy customers. First booking comes with a special
              discount.
            </p>
          </div>

          <div className="cta-buttons">
            <button className="browse-btn">Browse Services</button>
            <button className="signup-btn">Sign Up Free</button>
          </div>

        </div>

        <div className="cta-divider"></div>

        <div className="cta-features">

          <div className="feature">
            <FiShield className="icon"/>
            <span>100% Satisfaction Guarantee</span>
          </div>

          <div className="feature">
            <FiClock className="icon"/>
            <span>Same Day Service Available</span>
          </div>

          <div className="feature">
            <FiStar className="icon"/>
            <span>Verified Professionals Only</span>
          </div>

          <div className="feature">
            <FiCheckCircle className="icon"/>
            <span>Free Cancellation</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;