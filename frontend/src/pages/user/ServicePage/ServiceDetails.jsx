import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./ServiceDetails.css";

import { FaStar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const ServiceDetails = () => {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    API.get("/provider/all-services")
      .then(res => {

        const all = res.data;

        // 🔥 current service
        const found = all.find(
          (s) => s.provider_skill_id == slug
        );

        setService(found);

        // 🔥 related services
        if (found) {
          const related = all.filter(
            (s) =>
              s.category === found.category &&
              s.provider_skill_id != slug
          );

          setRelatedServices(related);
        }

      })
      .catch(err => console.log(err));
  }, [slug]);

  if (!service) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="service-detail">

      {/* 🔥 HERO SECTION */}
      <div className="service-hero">

        {/* ✅ LEFT IMAGE FIXED */}
        <div className="service-image-box">
          <img
            src={service.image_url || "https://via.placeholder.com/400"}
            alt={service.title}
            className="service-main-img"
          />
        </div>

        {/* ✅ RIGHT SIDE SAME (NO CHANGE) */}
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

      {/* 🔥 INFO */}
      <div className="service-info">

        <span className="category">
          {service.category}
        </span>

        <h1>{service.title || service.skill_name}</h1>

        <div className="meta">

          <div>
            <FaStar />
            {Number(service.rating || 0).toFixed(1)}
          </div>

          <div>
            <FiClock />
            {service.duration}
          </div>

        </div>

        <h3>About This Service</h3>

        <p>{service.description}</p>

      </div>

      {/* 🔥 SIMILAR SERVICES */}
      <div className="related-services">

        <h2>Similar Services</h2>

        <div className="services-grid">

          {relatedServices.slice(0, 4).map((item) => (

            <div
              key={item.provider_skill_id}
              className="service-card"
              onClick={() =>
                navigate(`/services/${item.provider_skill_id}`)
              }
            >

              <div className="service-image">
                <img
                  src={item.image_url || "https://via.placeholder.com/300"}
                  alt={item.title}
                />

                <span className="service-category">
                  {item.category}
                </span>
              </div>

              <div className="service-body">

                <div className="service-rating">
                  <FaStar />
                  <span>{Number(item.rating || 0).toFixed(1)}</span>
                </div>

                <h3>{item.title || item.skill_name}</h3>

                <div className="service-bottom">
                  <div className="price">₹{item.price}</div>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ServiceDetails;