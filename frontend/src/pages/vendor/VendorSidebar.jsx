import { NavLink } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Wrench,
  PlusCircle,
  CalendarCheck,
  IndianRupee,
  BarChart3,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function VendorSidebar() {
  const [showMenu, setShowMenu] = useState(false);
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/"); // landing page
};

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="sidebar">

      {/* LOGO / TITLE */}
      <div className="sidebar-header">
        <div className="logo-box">
          <Wrench size={20} />
        </div>
        <h2>Skillora</h2>
      </div>

      {/* MENU */}
      <ul>

        <li>
          <NavLink to="/vendor/profile" className="nav-item">
            <User size={18} />
            <span>My Profile</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/dashboard" className="nav-item">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/services" className="nav-item">
            <Wrench size={18} />
            <span>Services</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/add-service" className="nav-item">
            <PlusCircle size={18} />
            <span>Add Service</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/bookings" className="nav-item">
            <CalendarCheck size={18} />
            <span>Bookings</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/earnings" className="nav-item">
            <IndianRupee size={18} />
            <span>Earnings</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/performance" className="nav-item">
            <BarChart3 size={18} />
            <span>Performance</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/vendor/invoices" className="nav-item">
            <FileText size={18} />
            <span>Invoices</span>
          </NavLink>
        </li>

      </ul>

      {/* BOTTOM USER */}
      <div 
  className="sidebar-footer"
  onClick={() => setShowMenu(!showMenu)}
>
  <div className="avatar">
    {user?.name?.charAt(0) || "V"}
  </div>
  <div>
    <p className="name">{user?.name || "Vendor"}</p>
    <span className="role">Vendor</span>
  </div>
</div>
{showMenu && (
  <div className="logout-menu">
    <p onClick={handleLogout}>Logout</p>
  </div>
)}

    </div>
  );
}

export default VendorSidebar;