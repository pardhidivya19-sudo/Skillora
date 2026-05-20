import "./Hero.css";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const [location, setLocation] = useState("");

  // 🔥 STATES
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // 🔥 keyboard nav
  const [customerCount, setCustomerCount] = useState(0);
const [avatars, setAvatars] = useState([]);

  // ================= LOCATION =================
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const data = await res.json();
            const address = data.address;

            const area =
              address.suburb ||
              address.neighbourhood ||
              address.hamlet ||
              address.village ||
              "";

            const road = address.road || "";
            const city =
              address.city ||
              address.town ||
              address.village ||
              "";

            const state = address.state || "";

            const fullLocation = [road, area, city, state]
              .filter(Boolean)
              .join(", ");

            setLocation(fullLocation);

          } catch (err) {
            console.log("Location fetch error", err);
          }
        },
        (error) => {
          console.log("Permission denied", error);
        }
      );
    }
  }, []);

  // ================= FETCH SERVICES =================
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/provider/all-services");
        const data = await res.json();

        // 🔥 REMOVE DUPLICATES
        const unique = [
          ...new Map(
            data.map(s => [s.skill_name.toLowerCase(), s])
          ).values()
        ];

        setServices(unique);
      } catch (err) {
        console.log(err);
      }
    };

    fetchServices();
  }, []);
 
  useEffect(() => {
  // count
  fetch("http://localhost:5000/api/provider/happy-customers")
    .then(res => res.json())
    .then(data => setCustomerCount(data.total))
    .catch(err => console.log(err));

  // avatars
  fetch("http://localhost:5000/api/provider/customer-avatars")
    .then(res => res.json())
    .then(data => setAvatars(data))
    .catch(err => console.log(err));
}, []);
  // ================= SELECT =================
 const handleSelectService = (service) => {
  navigate(
    `/services?category=${encodeURIComponent(
      (service.category || "").toLowerCase()
    )}`
  );
}; 

  // ================= KEYBOARD =================
  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {
      setActiveIndex(prev =>
        prev < filteredServices.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex(prev =>
        prev > 0 ? prev - 1 : filteredServices.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelectService(filteredServices[activeIndex]);
    }
  };

  return (
    <section className="hero">

      <div className="hero-overlay">

        <div className="hero-content">

          <h1 className="hero-title">
            Expert Services, <br />
            <span>Right at Your</span> <br />
            <span className="door">Door</span>
          </h1>

          <p className="hero-text">
            Book trusted professionals for home cleaning, repairs,
            beauty, wellness and more — all in minutes.
          </p>

          <div className="search-box">

    

            {/* 📍 LOCATION */}
            <div className="location-input">
              <FiMapPin className="search-icon"/>
              <input
                type="text"
                placeholder="Your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* 🔘 BUTTON */}
            <button
              className="search-btn"
              onClick={() => navigate(`/services?search=${searchText}`)}
            >
              Search
            </button>

          </div>

          <div className="hero-users">
            <div className="avatars">
{Array.isArray(avatars) && avatars.map((a, index) => (  <img key={index} src={a.profile_image} alt="user" />
))}
            </div>
<p>
  <b>{customerCount}+</b> happy customers
</p>          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;