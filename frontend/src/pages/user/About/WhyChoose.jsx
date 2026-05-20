import React from "react";
import "./WhyChoose.css";

import { FiShield, FiHeart, FiAward, FiZap } from "react-icons/fi";

const WhyChoose = () => {
  return (
    <section className="why-section">

      <h2 className="why-title">Why Choose Skillora</h2>

      <div className="why-grid">

        {/* Card 1 */}
        <div className="why-card">
          <div className="why-icon">
            <FiShield />
          </div>

          <h3>Trust & Safety</h3>

          <p>
            Every professional is background-checked and verified.
          </p>
        </div>

        {/* Card 2 */}
        <div className="why-card">
          <div className="why-icon">
            <FiHeart />
          </div>

          <h3>Customer First</h3>

          <p>
            100% satisfaction guarantee on every service.
          </p>
        </div>

        {/* Card 3 */}
        <div className="why-card">
          <div className="why-icon">
            <FiAward />
          </div>

          <h3>Quality Service</h3>

          <p>
            Only top-rated professionals on our platform.
          </p>
        </div>

        {/* Card 4 */}
        <div className="why-card">
          <div className="why-icon">
            <FiZap />
          </div>

          <h3>Fast & Reliable</h3>

          <p>
            Same-day service available in most areas.
          </p>
        </div>

      </div>

    </section>
  );
};

export default WhyChoose;