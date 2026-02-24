import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Skillora</h2>
        <a href="#">Dashboard</a>
        <a href="#">My Bookings</a>
        <a href="#">Profile</a>
        <a href="#">Settings</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        
        {/* Topbar */}
        <div className="topbar">
          <h1>Welcome Back 👋</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="card-container">
          <div className="card">
            <h3>Total Bookings</h3>
            <p>12</p>
          </div>

          <div className="card">
            <h3>Upcoming Services</h3>
            <p>3</p>
          </div>

          <div className="card">
            <h3>Completed Services</h3>
            <p>9</p>
          </div>
        </div>

        {/* Recent Section */}
        <div className="recent-section">
          <h2>Recent Bookings</h2>

          <div className="booking-item">
            Cleaning Service - 12 Feb 2026
          </div>

          <div className="booking-item">
            Plumbing Service - 8 Feb 2026
          </div>

          <div className="booking-item">
            Electrical Repair - 2 Feb 2026
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;
