import "./Navbar.css";
import { Link } from "react-router-dom";
import { FiHeart, FiUser } from "react-icons/fi";

function Navbar() {
  return (
    <header className="navbar">

      <div className="nav-container">

        <div className="nav-logo">
          Skill<span>ora</span>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/professionals">Professionals</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="nav-right">
          <FiHeart className="nav-icon"/>
          <FiUser className="nav-icon"/>

          <button className="nav-signin-btn">
            Sign In
          </button>
        </div>

      </div>

    </header>
  );
}

export default Navbar;