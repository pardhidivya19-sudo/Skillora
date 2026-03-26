import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OurServices.css";
import servicesData from "../../data/servicesData";
import { FiSearch, FiHeart, FiClock } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

const categories = [
  "All",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Beauty & Spa",
  "Appliance Repair",
  "Painting",
];

const OurServices = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [liked, setLiked] = useState({});
  const toggleLike = (id) => {
  setLiked((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

  const filteredServices = servicesData.filter((service) => {
    const matchCategory =
      activeCategory === "All" || service.category === activeCategory;

    const matchSearch = service.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <section className="services-section">

      <h1 className="services-title">Our Services</h1>
      <p className="services-subtitle">
        Find and book the perfect service for your needs
      </p>

      {/* Search */}
      <div className="services-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>
      </div>

      {/* Categories */}
      <div className="services-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="services-grid">
        {filteredServices.map((service) => (
          <div
  className="service-card"
  key={service.id}
  onClick={() => navigate(`/services/${service.slug}`)}
>

            <div className="service-image">
              <img src={service.image} alt={service.title} />

              <span className="service-category">
                {service.category}
              </span>

<div
  className="fav"
  onClick={() => toggleLike(service.id)}
>
  {liked[service.id] ? (
    <FaHeart className="heart-filled"/>
  ) : (
    <FiHeart className="heart-outline"/>
  )}
</div>
            </div>

            <div className="service-body">

              <div className="service-rating">
                <FaStar />
                <span>{service.rating}</span>
                <span className="service-reviews">({service.reviews})</span>
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <div className="service-bottom">

                <div className="duration">
                  <FiClock />
                  {service.duration}
                </div>

                <div className="price">
                  ₹{service.price}
                  <span>/service</span>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default OurServices;