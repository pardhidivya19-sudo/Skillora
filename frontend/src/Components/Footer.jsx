import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>Skillora</h2>
        </div>

        <div className="footer-columns">

          <div className="footer-col">
            <h3>Company</h3>
            <p>About us</p>
            <p>Investor Relations</p>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Careers</p>
          </div>

          <div className="footer-col">
            <h3>For Customers</h3>
            <p>Reviews</p>
            <p>Categories near you</p>
            <p>Contact us</p>
          </div>

          <div className="footer-col">
            <h3>For Professionals</h3>
            <p>Register as a Professional</p>
          </div>

          <div className="footer-col">
            <h3>Social Links</h3>
            <div className="social-icons">
              <span>🐦</span>
              <span>📘</span>
              <span>📷</span>
              <span>💼</span>
            </div>

            <div className="app-buttons">
              <button className="app-btn">App Store</button>
              <button className="app-btn">Google Play</button>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Skillora. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;