import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import { useEffect, useState } from "react";
import API from "../services/adminApi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const handleNotificationClick = (notification) => {

  if(notification.message.includes("Provider")){
    navigate("/providers");
  }

  if(notification.message.includes("Booking")){
    navigate("/bookings");
  }

  if(notification.message.includes("Payment")){
    navigate("/payments");
  }

  // remove notification
  setNotifications(prev =>
    prev.filter(n => n !== notification)
  );

  // close dropdown
  setShowNotifications(false);

};


const handleExportCSV = async () => {

  try{

    const res = await API.get("/export-bookings",{
      responseType:"blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");

    link.href = url;

    // change here
    link.setAttribute("download","bookings.xlsx");

    document.body.appendChild(link);

    link.click();

    link.remove();

  }catch(err){

    console.log("Excel export error");

  }

};

useEffect(() => {

  const fetchNotifications = async () => {

    try {

      const res = await API.get("/notifications");

      const allNotifications = [
        ...res.data.providers.map(p => ({
          message: `New Provider: ${p.name}`
        })),
        ...res.data.bookings.map(b => ({
          message: `New Booking #${b.booking_id}`
        })),
        ...res.data.payments.map(p => ({
          message: `Payment Success #${p.payment_id}`
        }))
      ];

      setNotifications(allNotifications);

    } catch (error) {
      console.log("Notification error");
    }

  };

  // first load
  fetchNotifications();

  // auto refresh every 5 seconds
  const interval = setInterval(() => {
    fetchNotifications();
  }, 5000);

  return () => clearInterval(interval);

}, []);

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Skillora</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/users")}>Users</li>
          <li onClick={() => navigate("/providers")}>Providers</li>
          <li onClick={() => navigate("/bookings")}>Bookings</li>
          <li onClick={() => navigate("/payments")}>Payments</li>
          <li onClick={() => navigate("/withdrawals")}>Withdrawals</li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">

        {/* Navbar */}
        <div className="navbar">

          <h3>Admin Panel</h3>

          <div className="nav-actions">

            {/* Notification Icon */}
            <div className="notification-container">

<span
  className="nav-icon"
  onClick={()=>setShowNotifications(!showNotifications)}
>
  🔔
</span>

{notifications.length > 0 && (
  <span className="notification-badge">
    {notifications.length}
  </span>
)}

{showNotifications && (

<div className="notification-dropdown">

{notifications.map((n,index)=>(
<div
  key={index}
  className="notification-item"
  onClick={() => handleNotificationClick(n)}
>
  {n.message}
</div>
))}

</div>

)}

</div>

            {/* Excel Download */}
            <button
className="csv-btn"
onClick={handleExportCSV}
>
Download Excel
</button>

          </div>

        </div>

        <div className="page-content">
  <Outlet />
</div>

      </div>

    </div>
  );
};

export default AdminLayout;