import "./Navbar.css";
import { Link } from "react-router-dom";
import { FiHeart, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ STEP 1: state + navigate (INSIDE component)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ STEP 2: check login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ STEP 3: LOGOUT FUNCTION (YEHI TU PUCH RAHI THI)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/"); // landing page
  };

  return (
    <header className="navbar">

      <div className="nav-container">

        <div className="nav-logo">
          Skill<span>ora</span>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? <FiX /> : <FiMenu />}
</div>

<ul className={`nav-links ${menuOpen ? "active" : ""}`}>          <li><Link to="/user/home">Home</Link></li>
          <li><Link to="/services" onClick={() => setMenuOpen(false)} >Services</Link></li>
          <li><Link to="/professionals" onClick={() => setMenuOpen(false)}>Professionals</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>

        <div className="nav-right">

          {/* ✅ Wishlist only if logged in */}
          {user && (
            <Link to="/wishlist">
              <FiHeart className="nav-icon"/>
            </Link>
          )}

          {/* ✅ Account only if logged in */}
          {user && (
            <Link to="/account">
              <FiUser className="nav-icon"/>
            </Link>
          )}

          {/* ✅ LOGIN / LOGOUT SWITCH */}
          {!user ? (
            <Link to="/login">
              <button className="nav-signin-btn">
                Login
              </button>
            </Link>
          ) : (
            <button className="nav-signin-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;