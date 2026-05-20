import "./PopularServices.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiClock } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

function PopularServices() {

  const [liked, setLiked] = useState({});
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // ❤️ like toggle (same as before)
  const toggleLike = (id) => {
    setLiked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 🔥 API CALL
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/provider/all-services");

      const formatted = res.data.map((item) => ({
        id: item.provider_skill_id,
        title: item.title,
        price: `₹${item.price}`,
        time: `${item.duration} mins`,
        category: item.category,
        rating: Number(item.rating).toFixed(1) || 0,
        reviews: 0, // optional
        desc: item.description,
        image: item.image_url || "https://via.placeholder.com/300"
      }));

      setServices(formatted);

    } catch (err) {
      console.log("Error fetching services:", err);
    }
  };

  return (

    <section className="pop-section">

      <div className="pop-container">

        <div className="pop-header">

          <div>
            <h2>Popular Services</h2>
            <p>Most booked services by our customers</p>
          </div>

<a className="pop-view" onClick={() => {
  if (!localStorage.getItem("token")) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  navigate("/services");
}}>
  View All →
</a>
        </div>

        <div className="pop-grid">

          {/* 🔥 ONLY 4 SERVICES SHOW (OPTIONAL) */}
          {services.slice(0, 4).map((service) => (

<div 
  className="pop-card" 
  key={service.id}
onClick={() => {
  if (!localStorage.getItem("token")) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  navigate(`/services/${service.id}`);
}}>
              <div className="pop-img">

                <img src={service.image} alt={service.title} />

                <span className="pop-tag">{service.category}</span>

                <div
                  className={`pop-heart ${liked[service.id] ? "active" : ""}`}
onClick={(e) => {
  e.stopPropagation();

  if (!localStorage.getItem("token")) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  toggleLike(service.id);
}}                >
                  {liked[service.id] ? (
                    <FaHeart className="heart-filled" />
                  ) : (
                    <FiHeart />
                  )}
                </div>

              </div>

              <div className="pop-body">

                <div className="pop-rating">
                  <FaStar className="pop-star" />
                  {service.rating}
                  <span>({service.reviews})</span>
                </div>

                <h3>{service.title}</h3>

                <p className="pop-desc">
                  {service.desc}
                </p>

                <div className="pop-bottom">

                  <div className="pop-time">
                    <FiClock />
                    {service.time}
                  </div>

                  <div className="pop-price">
                    {service.price}<span>/service</span>
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}

export default PopularServices;