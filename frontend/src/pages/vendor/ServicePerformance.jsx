
import { useEffect, useState } from "react";
import API from "../../services/api";
import "./ServicePerformance.css";
import { Package, IndianRupee, Star } from "lucide-react";

function ServicePerformance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/provider/service-performance")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="sp-container">
      <h2 className="sp-main-title">Performance</h2>
<p className="sp-subtitle">Service-wise performance metrics</p>

      <div className="sp-grid">
        {data.map((s) => (
          <div key={s.provider_skill_id} className="sp-card">

  <h3 className="sp-title">{s.skill_name}</h3>

  <div className="sp-row">
    <div>
      <p className="label">Bookings</p>
      <h4>{s.total_bookings}</h4>
    </div>

    <div>
      <p className="label">Earnings</p>
      <h4>₹{s.total_earnings}</h4>
    </div>
  </div>

  <div className="sp-row">
    <div className="rating">
      <Star size={16} className="star-icon" />
      <span>{Number(s.rating).toFixed(1)}</span>
    </div>
  </div>

  {/* PROGRESS BAR (optional but UI match) */}
  <div className="progress-bar">
    <div
      className="progress"
      style={{ width: `${Math.min(s.total_bookings, 100)}%` }}
    ></div>
  </div>

</div>
        ))}
      </div>
    </div>
  );
}

export default ServicePerformance;