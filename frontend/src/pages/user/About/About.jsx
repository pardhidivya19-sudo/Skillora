import React from "react";
import "./About.css";
import WhyChoose from "./WhyChoose";
import OurTeam from "./OurTeam";
import { FaStar } from "react-icons/fa";

const About = () => {
  return (
     <div>
    <section className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <h1>Making Services Accessible to Everyone</h1>
        <p>
          We're building the future of home and personal services by connecting
          customers with trusted, skilled professionals.
        </p>
      </div>


      {/* STATS */}
      <div className="about-stats">

        <div className="stat-card">
          <h2>50K+</h2>
          <p>Customers Served</p>
        </div>

        <div className="stat-card">
          <h2>2,000+</h2>
          <p>Professionals</p>
        </div>

        <div className="stat-card">
          <h2>100+</h2>
          <p>Services</p>
        </div>

        <div className="stat-card">
          <h2>
            4.8 <FaStar />
          </h2>
          <p>Average Rating</p>
        </div>

      </div>


      {/* MISSION */}
      <div className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Skillora was founded with a simple mission: make it effortless for
          people to find and book reliable, high-quality services. We believe
          everyone deserves access to professional help, delivered with
          transparency, trust, and care.
        </p>
      </div>
    </section>

    {/* Why Choose Section */}
      <WhyChoose />
      <OurTeam />
 </div>
  );
};

export default About;