import { useEffect, useState } from "react";
import API from "../../services/api";
import "./VendorServices.css";
import { Clock, Star, Pencil, Trash2 } from "lucide-react";

function VendorServices() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
 const [vendorStatus, setVendorStatus] = useState(true);
 const [timingService, setTimingService] = useState(null);

  useEffect(() => {
    API.get("/provider/services")
      .then(res => setServices(res.data))
      .catch(err => console.log(err));

      // 🔥 NEW
  API.get("/provider/profile")
    .then(res => setVendorStatus(res.data.availability_status))
    .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await API.delete(`/provider/services/${id}`);

      setServices(prev =>
        prev.filter(s => s.provider_skill_id !== id)
      );

    } catch (err) {
      console.log(err);
    }
  };

  const toggleVendor = async () => {
  try {
    const res = await API.put("/provider/toggle-availability");

    setVendorStatus(res.data.availability_status);

    // 🔥 if OFF → UI me bhi sab OFF dikhao
    setServices(prev =>
  prev.map(s => ({
    ...s,
    is_active: res.data.availability_status
  }))
);

  } catch (err) {
    console.log(err);
  }
};

   const toggleService = async (id) => {
  try {
    await API.put(`/provider/services/toggle/${id}`);

    // UI update without reload
    setServices((prev) =>
      prev.map((s) =>
        s.provider_skill_id === id
          ? { ...s, is_active: !s.is_active }
          : s
      )
    );

  } catch (err) {
    console.log(err);
  }
};
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("title", editingService.title);
      formData.append("price", editingService.price);
      formData.append("duration", editingService.duration);
      formData.append("description", editingService.description);

      if (editingService.image) {
        formData.append("image", editingService.image);
      }

      await API.put(
        `/provider/services/${editingService.provider_skill_id}`,
        formData
      );

      setEditingService(null);

      const res = await API.get("/provider/services");
      setServices(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="services-container">
      <div className="services-header">
  <h2>Services</h2>
  <p>Manage your service offerings</p>
</div>

      <div className="vendor-toggle-box">

  <span className="vendor-label">Vendor Status:</span>

  <button
    className={`vendor-toggle ${vendorStatus ? "on" : "off"}`}
    onClick={toggleVendor}
  >
    {vendorStatus ? "ONLINE" : "OFFLINE"}
  </button>

</div>

      <div className="services-grid">
        {services.map(service => (
          <div className="service-card" key={service.provider_skill_id}>

  {/* 🔥 IMAGE + STATUS */}
  <div className="image-box">
    <img
      src={
        service.image_url
          ? service.image_url
          : "https://via.placeholder.com/300x200?text=Service"
      }
      alt="service"
    />

    <span className={`status-badge ${service.is_active ? "active" : "inactive"}`}>
      {service.is_active ? "active" : "inactive"}
    </span>
  </div>

  {/* 🔥 CONTENT */}
  <div className="service-info">

    <h3 className="title">
      {service.title || service.skill_name}
    </h3>

    <p className="category">{service.category}</p>

    <p className="desc">
      {service.description?.slice(0, 80)}...
    </p>

    {/* 🔥 PRICE + TIME + RATING */}
    <div className="meta-row">
  <span className="price">₹{service.price}</span>

  <span className="time">
    <Clock size={14} /> {service.duration} min
  </span>

  <span className="rating">
    <Star size={14} color="#f59e0b" fill="#f59e0b" />{" "}
    {service.rating ? Number(service.rating).toFixed(1) : "0.0"}
  </span>
</div>

    {/* 🔥 TIMING */}
   <div className="slot">
  <Clock size={14} />
  <span>{service.start_time || "--"} - {service.end_time || "--"}</span>
</div>

    {/* 🔥 ACTION ROW */}
  <div className="action-row">

  <div className="left-actions">
    <div className="toggle-row">
      <label className="switch">
        <input
          type="checkbox"
          checked={service.is_active}
          onChange={() => toggleService(service.provider_skill_id)}
        />
        <span className="slider"></span>
      </label>
      <span>{service.is_active ? "ON" : "OFF"}</span>
    </div>
  </div>

  <div className="right-actions">
    <button
  className="icon-btn"
  onClick={() => setEditingService(service)}
>
  <Pencil size={16} />
</button>

    <button
  className="icon-btn delete"
  onClick={() => handleDelete(service.provider_skill_id)}
>
  <Trash2 size={16} />
</button>

    <button
      className="timing-btn"
      onClick={() => setTimingService(service)}
    >
      Set Timing
    </button>
  </div>

</div>

  </div>
</div>
        ))}
      </div>

      {/* MODAL */}
      {editingService && (
        <div className="modal-overlay">
          <div className="modal">

            <button
              className="close-btn"
              onClick={() => setEditingService(null)}
            >
              ✖
            </button>

            <h2>Edit Service</h2>

            {editingService.image_url && (
              <img
                src={editingService.image_url}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            )}

            <input
              type="text"
              placeholder="Title"
              value={editingService.title || ""}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  title: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={editingService.price}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  price: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Duration"
              value={editingService.duration}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  duration: e.target.value
                })
              }
            />

            <textarea
              placeholder="Description"
              value={editingService.description || ""}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  description: e.target.value
                })
              }
            />

            <input
              type="file"
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  image: e.target.files[0]
                })
              }
            />

            <button className="save-btn" onClick={handleUpdate}>
              Save Changes
            </button>

          </div>
        </div>
      )}

{timingService && (
  <div className="modal-overlay">
    <div className="modal">

      <h2 className="modal-title">
        Set Timing 
      </h2>

      <div className="time-input-group">
        <label>Start Time</label>
        <input
          type="time"
          value={timingService.start_time || ""}
          onChange={(e) =>
            setTimingService({
              ...timingService,
              start_time: e.target.value
            })
          }
        />
      </div>

      <div className="time-input-group">
        <label>End Time</label>
        <input
          type="time"
          value={timingService.end_time || ""}
          onChange={(e) =>
            setTimingService({
              ...timingService,
              end_time: e.target.value
            })
          }
        />
      </div>

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={async () => {
            await API.put(
              `/provider/services/timing/${timingService.provider_skill_id}`,
              {
                start_time: timingService.start_time,
                end_time: timingService.end_time
              }
            );

            setTimingService(null);

            const res = await API.get("/provider/services");
            setServices(res.data);
          }}
        >
          Save Changes
        </button>

        <button
          className="cancel-btn"
          onClick={() => setTimingService(null)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default VendorServices;