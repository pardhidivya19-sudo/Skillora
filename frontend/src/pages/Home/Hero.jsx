import "./Hero.css";
import { FiSearch, FiMapPin } from "react-icons/fi";

function Hero() {
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

            <div className="search-input">
              <FiSearch className="search-icon"/>
              <input
                type="text"
                placeholder="What service do you need?"
              />
            </div>

            <div className="location-input">
              <FiMapPin className="search-icon"/>
              <input
                type="text"
                placeholder="Your location"
              />
            </div>

            <button className="search-btn">
              Search
            </button>

          </div>

          <div className="hero-users">

            <div className="avatars">
              <img src="https://randomuser.me/api/portraits/women/44.jpg"/>
              <img src="https://randomuser.me/api/portraits/men/32.jpg"/>
              <img src="https://randomuser.me/api/portraits/women/68.jpg"/>
            </div>

            <p><b>10,000+</b> happy customers</p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;