import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import servicesData from "../../data/servicesData";
import "./ServiceDetails.css";

import TopProfessionals from "../Home/TopProfessionals";
import Testimonials from "../Home/Testimonials";

import { FaStar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const ServiceDetails = () => {

  const { slug } = useParams();
  const navigate = useNavigate();

  const service = servicesData.find(
    (s) => s.slug === slug
  );

  if (!service) {
    return <h2>Service not found</h2>;
  }

  return (
    <section className="service-detail">

      {/* Hero */}

      <div className="service-hero">

        <img src={service.image} alt={service.title} />

        <div className="service-book-card">

          <p>Starting from</p>

          <h2>₹{service.price}</h2>

          <button 
  className="book-btn"
  onClick={() => navigate(`/services/${slug}/book`)}
>
  Book Now
</button>

          <ul>
            <li>100% money-back guarantee</li>
            <li>Free cancellation up to 24h</li>
            <li>Service at your doorstep</li>
          </ul>

        </div>

      </div>

      {/* Info */}

      <div className="service-info">

        <span className="category">
          {service.category}
        </span>

        <h1>{service.title}</h1>

        <div className="meta">

          <div>
            <FaStar />
            {service.rating}
            ({service.reviews})
          </div>

          <div>
            <FiClock />
            {service.duration}
          </div>

        </div>

        <h3>About This Service</h3>

        <p>
          {service.description}
        </p>

      </div>


      {/* Packages */}

      <div className="packages">

        <h2>Choose a Package</h2>

        <div className="package-grid">

          <div className="package">
            <h3>Basic</h3>
            <h2>₹49</h2>
            <ul>
              <li>1 room service</li>
              <li>Basic cleaning supplies</li>
              <li>2 hour duration</li>
            </ul>

            <button onClick={() => navigate(`/services/${slug}/book`)}>
  Select
</button>
          </div>

          <div className="package popular">
            <span>Most Popular</span>

            <h3>Standard</h3>
            <h2>₹89</h2>

            <ul>
              <li>3 room service</li>
              <li>Premium supplies</li>
              <li>4 hour duration</li>
              <li>Free re-service</li>
            </ul>

            <button onClick={() => navigate(`/services/${slug}/book`)}>
  Select
</button>

          </div>

          <div className="package">
            <h3>Premium</h3>
            <h2>₹149</h2>

            <ul>
              <li>Full home service</li>
              <li>Premium eco supplies</li>
              <li>6 hour duration</li>
              <li>Free re-service</li>
            </ul>

            <button onClick={() => navigate(`/services/${slug}/book`)}>
  Select
</button>

          </div>

        </div>

      </div>


      {/* Home page same sections */}

      <TopProfessionals />

      {/* <Testimonials /> */}

    </section>
  );
};

export default ServiceDetails;