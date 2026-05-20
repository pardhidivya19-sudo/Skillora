import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OurServices.css";
import API from "../../../services/api";
import { FiSearch, FiHeart, FiClock } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { WishlistContext } from "../../../context/WishlistContext";

const OurServices = () => {

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [showFilters, setShowFilters] = useState(false); // 🔥 NEW

  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchFromHero = queryParams.get("search");
  const selectedCategory = queryParams.get("category");
  const selectedProvider = queryParams.get("provider");

  useEffect(() => {
    if (selectedCategory) setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProvider) setSearch(selectedProvider);
  }, [selectedProvider]);

  useEffect(() => {
    if (searchFromHero) setSearch(searchFromHero);
  }, [searchFromHero]);

  useEffect(() => {
    API.get("/provider/all-services")
      .then(res => setServices(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    API.get("/provider/categories")
      .then(res => {
        const cats = ["all", ...res.data.map(c => c.category.trim().toLowerCase())];
        setCategories(cats);
      })
      .catch(err => console.log(err));
  }, []);

  const filteredServices = services.filter((service) => {
    const matchCategory =
      activeCategory === "all" ||
      (service.category || "").toLowerCase().trim() === activeCategory;

    const matchSearch =
      (service.title || service.skill_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (service.provider_name || "")
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

      {/* SEARCH */}
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

      {/* 🔥 MOBILE HAMBURGER */}
      <div className="mobile-filter-toggle">
        <button onClick={() => setShowFilters(!showFilters)}>
          ☰ Categories
        </button>
      </div>

      {/* FILTERS */}
      <div className={`services-filters ${showFilters ? "show" : ""}`}>
        {categories.map((cat, index) => (
          <button
            key={`${cat}-${index}`}
            className={`filter-btn ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setShowFilters(false); // close after click
            }}
          >
            {cat === "all"
              ? "All"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="services-grid">
        {filteredServices.map((service) => (
          <div
            className="service-card"
            key={service.provider_skill_id}
            onClick={() => navigate(`/services/${service.provider_skill_id}`)}
          >
            <div className="service-image">
              <img
                src={service.image_url || "https://via.placeholder.com/300"}
                alt={service.title}
              />

              <span className="service-category">
                {service.category}
              </span>

              <div
                className="fav"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist({
                    id: service.provider_skill_id,
                    title: service.title,
                    image: service.image_url,
                    category: service.category,
                    rating: service.rating,
                    description: service.description,
                    time: service.duration,
                    price: service.price,
                    reviews: service.reviews
                  });
                }}
              >
                {wishlist.some(item => item.id === service.provider_skill_id)
                  ? <FaHeart className="heart-filled" />
                  : <FiHeart className="heart-outline" />}
              </div>
            </div>

            <div className="service-body">

              <div className="service-rating">
                <FaStar />
                <span>{Number(service.rating || 0).toFixed(1)}</span>
                <span className="service-reviews">({service.reviews})</span>
              </div>

              <h3>{service.title || service.skill_name}</h3>

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