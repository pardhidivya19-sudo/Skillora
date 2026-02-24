import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState("Select Location");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`);
        setShowLocationModal(false);
      });
    } else {
      alert("Geolocation not supported");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">

        {/* Left */}
        <div className="nav-left">
          <div className="logo" onClick={() => navigate("/")}>
            Skillora
          </div>

          <div className="nav-links">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/services")}>Our Services</span>
            <span>About Us</span>
          </div>
        </div>

        {/* Center */}
        <div className="nav-center">
          <div
            className="location-tab"
            onClick={() => setShowLocationModal(true)}
          >
            📍 {location}
          </div>

          <span className="my-bookings">
            My Bookings
          </span>
        </div>

        {/* Right */}
        <div className="nav-right">
          {!isLoggedIn ? (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <div
              className="profile-dropdown"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              👤 My Profile
              {showDropdown && (
                <div className="dropdown-menu">
                  <div onClick={() => navigate("/user-dashboard")}>
                    Dashboard
                  </div>
                  <div onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </nav>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay">
          <div className="location-modal">
            <div className="modal-header">
              <h3>Select Location</h3>
              <span
                className="close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                ✖
              </span>
            </div>

            <button
              className="detect-btn"
              onClick={detectLocation}
            >
              Use Current Location
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
