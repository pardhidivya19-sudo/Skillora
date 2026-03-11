import { useEffect, useState } from "react";
import API from "../services/adminApi";
import "../styles/Providers.css";
import { useNavigate } from "react-router-dom";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const fetchProviders = async () => {
    try {
      const res = await API.get("/providers");
      setProviders(res.data);
    } catch (err) {
      console.log("Error fetching providers");
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (provider) => {
  if (provider.is_blocked) return "Blocked";
  if (provider.approval_status === "approved") return "Approved";
  if (provider.approval_status === "rejected") return "Rejected";
  return "Pending";
};

  return (
    <div className="providers-container">
      <div className="providers-header">
        <h2>Providers</h2>

        <input
          type="text"
          placeholder="Search provider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="providers-list">
        {filteredProviders.map((provider) => (
          <div className="provider-card" key={provider.user_id}>
            
            <div className="provider-left">
              <h3>{provider.name}</h3>

              <p className="category">
                {provider.category || "General Services"}
              </p>

              <p className="applied-date">
                Applied:{" "}
                {provider.created_at
                  ? new Date(provider.created_at).toLocaleDateString()
                  : "-"}
              </p>

              <span className={`status-badge ${
  provider.is_blocked
    ? "blocked"
    : provider.approval_status === "approved"
    ? "approved"
    : provider.approval_status === "rejected"
    ? "rejected"
    : "pending"
}`}>
  {getStatus(provider)}
</span>
            </div>

            <div className="provider-right">
              <button
  className="view-btn"
  onClick={() => navigate(`/providers/${provider.user_id}`)}
>
  View
</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Providers;