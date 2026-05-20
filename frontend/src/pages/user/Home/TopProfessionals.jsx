import "./TopProfessionals.css";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TopProfessionals() {

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ ADD
  const navigate = useNavigate();

  // 🔥 API CALL
  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/provider/top-professionals");

      // ✅ 🔥 REMOVE DUPLICATES (IMPORTANT FIX)
      const uniqueProviders = [];
      const seen = new Set();

      res.data.forEach((item) => {
        if (!seen.has(item.provider_id)) {
          seen.add(item.provider_id);
          uniqueProviders.push(item);
        }
      });

      const formatted = uniqueProviders.map((item, index) => ({
        id: item.provider_id || index,
        serviceId: item.provider_skill_id,
        name: item.provider_name,
        role: item.category,
        rating: Number(item.rating || 0).toFixed(1),
        reviews: 0,
        location: "India",
        jobs: item.jobs_completed || 0,
image: item.profile_image && item.profile_image.trim() !== ""
  ? item.profile_image
  : "/default-user.png"      }));

      setProfessionals(formatted);

    } catch (err) {
      console.log("Error fetching professionals:", err);
    } finally {
      setLoading(false); // ✅ FIX flick
    }
  };

  // ✅ LOADING FIX (avoid flick)
  if (loading) return null;

  return (

    <section className="tp-section">

      <div className="tp-container">

        {/* HEADER */}
        <div className="tp-header">

          <div>
            <h2>Top Professionals</h2>
            <p>Verified experts ready to serve you</p>
          </div>

          <a 
            className="tp-view"
            onClick={() => {
              if (!localStorage.getItem("token")) {
                alert("Please login first");
                navigate("/login");
                return;
              }
              navigate("/professionals");
            }}
          >
            View All →
          </a>

        </div>

        {/* CARDS */}
        <div className="tp-grid">

          {professionals.slice(0, 3).map((pro) => (

            <div 
              className="tp-card" 
              key={`${pro.id}-${pro.serviceId}`}  // ✅ FIXED KEY
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  alert("Please login first");
                  navigate("/login");
                  return;
                }
                navigate(`/services?provider=${encodeURIComponent(pro.name)}`);
              }}
            >

              <div className="tp-top">

                <div className="tp-avatar">

                  <img 
                    src={pro.image} 
                    alt={pro.name}
                    loading="lazy"  // ✅ smooth load
                  />

                  <div className="tp-verified">
                    <FiCheckCircle />
                  </div>

                </div>

                <div className="tp-info">

                  <h3>{pro.name}</h3>

                  <p className="tp-role">{pro.role}</p>

                  <div className="tp-meta">

                    <span className="tp-rating">
                      <FaStar className="tp-star" />
                      {pro.rating}
                      <span>({pro.reviews})</span>
                    </span>

                    <span className="tp-location">
                      <FiMapPin />
                      {pro.location}
                    </span>

                  </div>

                </div>

              </div>

              <hr />

              <div className="tp-bottom">

                <p>{pro.jobs} jobs completed</p>

                <button 
                  className="tp-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!localStorage.getItem("token")) {
                      alert("Please login first");
                      navigate("/login");
                      return;
                    }

                    navigate(`/services/${pro.serviceId}/book`);
                  }}
                >
                  Book Now
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}

export default TopProfessionals;