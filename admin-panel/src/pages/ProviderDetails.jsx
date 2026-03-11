import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/adminApi";
import "../styles/ProviderDetails.css";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/provider-details/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load provider details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No Data Found</p>;

  const profile = data?.profile || {};
  const skills = data?.skills || [];
  const reviews = data?.reviews || [];
  const ratingSummary = data?.ratingSummary || {};
  
// ================= ACTION FUNCTIONS =================

const handleAccept = async () => {
  await API.put(`/approve-provider/${id}`);
  window.location.reload();
};

const handleReject = async () => {
  await API.put(`/reject-provider/${id}`);
  window.location.reload();
};

const handleBlock = async () => {
  await API.put(`/block-provider/${id}`);
  window.location.reload();
};

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this provider?")) return;

  await API.delete(`/delete-provider/${id}`);
  navigate("/providers");
};

  return (
    <div className="details-container">

      <div className="details-header">
    <div className="header-left">

  <button onClick={() => navigate(-1)} className="back-btn">
    ← Back to List
  </button>
  </div>

  <div className="action-buttons">
    <button className="approve-btn" onClick={handleAccept}>
  Accept
</button>

<button className="reject-btn" onClick={handleReject}>
  Reject
</button>

<button className="block-btn" onClick={handleBlock}>
  {profile.is_blocked ? "Unblock" : "Block"}
</button>

<button className="delete-btn" onClick={handleDelete}>
  Delete
</button>
  </div>

</div>

      <h2>{profile?.name || "No Name"}</h2>
      <p className="sub-text">{profile?.location || "No Location"}</p>
      <span className={`status-badge ${
  profile.is_blocked
    ? "blocked"
    : profile.approval_status === "approved"
    ? "approved"
    : profile.approval_status === "rejected"
    ? "rejected"
    : "pending"
}`}>
  {profile.is_blocked
    ? "Blocked"
    : profile.approval_status === "approved"
    ? "Approved"
    : profile.approval_status === "rejected"
    ? "Rejected"
    : "Pending"}
</span>
      <div className="grid">

        {/* CONTACT */}
        <div className="card">
          <h3>Contact</h3>
          <p>Email: {profile?.email || "N/A"}</p>
          <p>Phone: {profile?.phone || "N/A"}</p>
          <p>
            Applied:{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* WORK DETAILS */}
        <div className="card">
          <h3>Work Details</h3>
          <p>Experience: {profile?.experience || 0} yrs</p>
          <p>
Availability: {profile?.availability_status ? "Available" : "Busy"}
</p>
<p>
Verification: {profile?.verification_status || "Pending"}
</p>
        </div>

        {/* DESCRIPTION */}
        <div className="card">
          <h3>About</h3>
          <p>{profile?.description || "No description available"}</p>
        </div>

        {/* SKILLS */}
        <div className="card">
          <h3>Skills</h3>
          {skills.length === 0 ? (
            <p>No skills added</p>
          ) : (
            skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <strong>{skill.skill_name}</strong>
                <p>Category: {skill.category}</p>
                <p>Price: ₹{skill.price}</p>
                <p>Duration: {skill.duration}</p>
              </div>
            ))
          )}
        </div>

        {/* RATINGS */}
        <div className="card">
          <h3>Ratings</h3>
          <p>
            ⭐{" "}
            {ratingSummary?.avg_rating
              ? Number(ratingSummary.avg_rating).toFixed(1)
              : 0}
            {" "}({ratingSummary?.total_reviews || 0} reviews)
          </p>
        </div>

        {/* REVIEWS */}
        <div className="card">
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-item">
                <p>⭐ {r.rating}</p>
                <p>{r.review_comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ProviderDetails;