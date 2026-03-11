import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-col footer-brand">
          <h2 className="footer-logo">
            Skill<span>ora</span>
          </h2>

          <p>
            Connecting you with trusted local service
            professionals for every need.
          </p>
        </div>

        <div className="footer-col">
          <h4>COMPANY</h4>
          <ul>
            <li>About</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SERVICES</h4>
          <ul>
            <li>Browse All</li>
            <li>Professionals</li>
            <li>Reviews</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SUPPORT</h4>
          <ul>
            <li>Help Center</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Skillora. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;