import VendorSidebar from "./VendorSidebar";
import { Outlet, useNavigate } from "react-router-dom"; // ✅ UPDATED
import "./Vendordashboard.css";
import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { Bell, Download } from "lucide-react";

function VendorDashboard() {

  const navigate = useNavigate(); // ✅ NEW
  const formatTimeAgo = (time) => {
  const diff = Math.floor((new Date() - new Date(time)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hour ago";

  return Math.floor(diff / 86400) + " day ago";
};

  // 🔔 notifications state
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/provider/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.log("Notification error", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ OUTSIDE CLICK CLOSE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ NEW: CLICK HANDLER
  const handleNotificationClick = async (item) => {

  try {
    // ✅ mark as read in backend
    await API.put("/provider/notifications/read", {
      type: item.type,
      id: item.id
    });

    // ✅ remove from UI instantly
    setNotifications(prev =>
      prev.filter(n => n.id !== item.id)
    );

  } catch (err) {
    console.log(err);
  }

  // navigation
  if (item.type === "booking") {
    navigate("/vendor/bookings");
  }

  if (item.type === "payment") {
    navigate("/vendor/earnings");
  }

  setShowDropdown(false);
};

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <VendorSidebar />

      {/* Content */}
      <div className="dashboard-content">

        {/* 🔥 NAVBAR */}
        <div className="vendor-navbar">

          <h2 className="vendor-title">Vendor Panel</h2>

          <div className="nav-actions">

  {/* 🔥 DOWNLOAD FIRST */}
  <button className="download-btn">
  <Download size={16} />
  Download
</button>

  {/* ✅ Notification AFTER */}
  <div className="notification-wrapper" ref={dropdownRef}>

              {/* 🔔 Notification */}
              <div 
                className="notification-box"
                onClick={() => setShowDropdown(!showDropdown)}
              >
               <Bell size={18} />

                {notifications.length > 0 && (
                  <span className="notif-badge">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </div>

              {/* ✅ DROPDOWN */}
              {showDropdown && (
<div className="notification-dropdown">

  <div className="notif-header">
    <h4>Notifications</h4>
    <span onClick={() => setShowDropdown(false)}>✕</span>
  </div>

  <div className="notif-list">                  {notifications.length === 0 ? (
                    <p className="empty">No notifications</p>
                  ) : (
                    notifications.map((item, i) => (
                      <div
                        key={i}
                        className="notification-item"
                        onClick={() => handleNotificationClick(item)}
                      >
                        <div className="notif-item-content">

  <div className={`dot ${item.type}`}></div>

  <div className="notif-text">

    {item.type === "booking" && (
      <>
        <p>
          New booking from <b>{item.user_name}</b> for {item.service_name}
        </p>
        <span>{formatTimeAgo(item.created_at)}</span>
      </>
    )}

    {item.type === "payment" && (
      <>
        <p>
          Payment of ₹{item.amount} received from <b>{item.user_name}</b>
        </p>
        <span>{formatTimeAgo(item.created_at)}</span>
      </>
    )}

  </div>

</div>
                      </div>
                    ))
                  )}
                </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Page Content */}
        <div className="vendor-page">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default VendorDashboard;