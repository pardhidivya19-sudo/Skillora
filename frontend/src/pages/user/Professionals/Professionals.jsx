import React, { useState, useEffect } from "react";
import "./Professionals.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FiSearch, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Professionals = () => {

  const [search, setSearch] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const navigate = useNavigate();

  // 🔥 API CALL
  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/provider/top-professionals");

      const uniqueMap = {};

res.data.forEach((item) => {
  if (!uniqueMap[item.provider_id]) {
    uniqueMap[item.provider_id] = {
      id: item.provider_id,
      serviceId: item.provider_skill_id, // first skill for booking
      name: item.provider_name,
      role: item.category,
      rating: Number(item.rating || 0).toFixed(1),
      reviews: item.total_reviews || 0,
      location: item.location || "India",
      jobs: item.jobs_completed || 0,
      image: item.profile_image || "/default-avatar.png",
    };
  }
});

const formatted = Object.values(uniqueMap);
setProfessionals(formatted);
      setProfessionals(formatted);

    } catch (err) {
      console.log("Error fetching professionals:", err);
    }
  };

  // 🔍 FILTER (same as before)
  const filteredPros = professionals.filter((pro) =>
    pro.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="professionals-section">

      <h1 className="professionals-title">
        Our Professionals
      </h1>

      <p className="professionals-subtitle">
        Verified experts ready to help you
      </p>

      {/* SEARCH */}
      <div className="professionals-search">
        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>
      </div>

      {/* GRID */}
      <div className="professionals-grid">

        {filteredPros.map((pro, index) => (

          <div
            className="professional-card"
            key={`${pro.id}-${index}`} // 🔥 duplicate key fix
            onClick={() =>
              navigate(`/services?provider=${encodeURIComponent(pro.name)}`)
            }
          >

            <div className="professional-top">

              <div className="professionals-image">
                <img src={pro.image} alt={pro.name} />
                <FiCheckCircle className="professionals-verified" />
              </div>

              <div className="professionals-info">

                <h3>{pro.name}</h3>

                <p className="professionals-role">{pro.role}</p>

                <div className="professionals-meta">

                  <span className="professionals-rating">
                    <FaStar />
                    {pro.rating}
                    <span className="professionals-reviews">
                      ({pro.reviews})
                    </span>
                  </span>

                  <span className="professionals-location">
                    <FiMapPin />
                    {pro.location}
                  </span>

                </div>

              </div>

            </div>

            <div className="professionals-divider"></div>

            <div className="professional-bottom">

              <p>{pro.jobs} jobs completed</p>

              <button
                className="professionals-book-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/services/${pro.serviceId}/book`);
                }}
              >
                Book Now
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Professionals;