import "./ByCategories.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  Wrench,
  Zap,
  Scissors,
  Settings,
  Paintbrush
} from "lucide-react";

// ICON MAPPING
const iconMap = {
  "Home Cleaning": <Sparkles size={28} />,
  "Plumbing": <Wrench size={28} />,
  "Electrical": <Zap size={28} />,
  "Beauty & Spa": <Scissors size={28} />,
  "Appliance Repair": <Settings size={28} />,
  "Painting": <Paintbrush size={28} />
};

function ByCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 API CALL
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/provider/categories");

      const formatted = res.data.map((cat, index) => ({
        id: index + 1,
        title: cat.category,
        services: `${cat.total_services} services`,
        icon: iconMap[cat.category] || <Sparkles size={28} />
      }));

      setCategories(formatted);

    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  };

  // 🔥 LIMIT LOGIC
  const visibleCategories = isMobile
    ? categories.slice(0, 4)
    : categories.slice(0, 6);

  const handleCategoryClick = (category) => {
    if (!localStorage.getItem("token")) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate(`/services?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  return (
    <section className="cat-section">

      <div className="cat-container">

        <h2 className="cat-title">Browse Categories</h2>

        <p className="cat-subtitle">
          Find the perfect service from our curated categories
        </p>

        <div className="cat-grid">

          {visibleCategories.map((cat) => (

            <div
              className="cat-card"
              key={cat.id}
              onClick={() => handleCategoryClick(cat.title)}
            >

              <div className="cat-icon">
                {cat.icon}
              </div>

              <h3>{cat.title}</h3>

              <p>{cat.services}</p>

            </div>

          ))}

        </div>

        {/* 🔥 VIEW MORE */}
        <div className="cat-view-more">
          <button
            className="view-more-btn"
            onClick={() => navigate("/services")}
          >
            View More →
          </button>
        </div>

      </div>

    </section>
  );
}

export default ByCategories;