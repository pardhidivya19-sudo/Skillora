import "./ByCategories.css";
import { 
  FiStar, 
  FiTool, 
  FiDroplet, 
  FiScissors, 
  FiTruck, 
  FiZap, 
  FiHeart, 
  FiShield 
} from "react-icons/fi";

function ByCategories() {

const categories = [
  { icon: <FiStar />, name: "Cleaning", services: "48 services" },
  { icon: <FiTool />, name: "Plumbing", services: "32 services" },
  { icon: <FiDroplet />, name: "Painting", services: "24 services" },
  { icon: <FiScissors />, name: "Beauty", services: "56 services" },
  { icon: <FiTruck />, name: "Moving", services: "18 services" },
  { icon: <FiZap />, name: "Electrical", services: "29 services" },
  { icon: <FiHeart />, name: "Wellness", services: "41 services" },
  { icon: <FiShield />, name: "Security", services: "15 services" },
];
  return (
    <section className="categories">

      <div className="categories-container">

        <h2 className="categories-title">Browse by Category</h2>

        <p className="categories-subtitle">
          Explore our wide range of professional home and personal services.
        </p>

        <div className="categories-grid">

          {categories.map((cat, index) => (
            <div className="category-card" key={index}>

              <div className="category-icon">
                {cat.icon}
              </div>

              <h3>{cat.name}</h3>
              <p>{cat.services}</p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default ByCategories;