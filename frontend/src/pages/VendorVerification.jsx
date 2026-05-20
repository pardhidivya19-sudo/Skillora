import { useState, useEffect } from "react";
import API from "../services/api";
import "./VendorVerification.css";
import LocationPicker from "../Components/LocationPicker";
function VendorVerification() {

  const [form, setForm] = useState({
    experience: "",
    location: "",
    latitude: "",
    longitude: "",
    availability_status: true,
    description: "",
    skill_id: "",
    price: "",
    duration: "",
    document: null
  });

  const [skills, setSkills] = useState([]);
  const [showNewSkill, setShowNewSkill] = useState(false);

  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    category: "",
    description: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);
  const [reason, setReason] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setStatus(payload.approval_status);
      setReason(payload.rejection_reason);

      API.get("/provider/my-profile")
        .then(res => {
          if (res.data) setProfileExists(true);
        })
        .catch(() => {});
    }
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await API.get("/provider/skills");
      setSkills(res.data);
    } catch (err) {
      console.log("Error fetching skills");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document") {
      setForm({ ...form, document: files[0] });
      return;
    }

    setForm({
      ...form,
      [name]: name === "availability_status" ? value === "true" : value
    });
  };

  const handleAddSkill = async () => {
    try {
      const res = await API.post("/provider/add-skill", newSkill);

      setSkills(prev => [...prev, res.data]);
      setForm({ ...form, skill_id: res.data.skill_id });
      setShowNewSkill(false);

    } catch (err) {
      console.log(err);
      alert("Error adding skill");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("experience", form.experience);
      formData.append("location", form.location);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      formData.append("availability_status", form.availability_status);
      formData.append("description", form.description);
      formData.append("skill_id", form.skill_id);
      formData.append("price", form.price);
      formData.append("duration", form.duration);
      formData.append("document", form.document);

      await API.post("/provider/create-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setSubmitted(true);

    } catch (err) {
      alert("Error submitting profile");
    }
  };

  return (
    <div className="vendor-container">

      {status === "rejected" ? (

        <div className="status-box">
          <h2>Verification Rejected ❌</h2>
          <p>Your request was rejected by admin.</p>
          <p><b>Reason:</b> {reason}</p>

          <br />

          <button onClick={() => {
            setStatus(null);
            setSubmitted(false);
          }}>
            Fill Form Again
          </button>

          <br /><br />

          <button onClick={() => {
            window.location.href = "/";
          }}>
            Cancel
          </button>
        </div>

      ) : (submitted || profileExists) ? (

        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <h2>Request Submitted ✅</h2>
          <p>Your verification request has been submitted.</p>
          <p>Please wait for admin approval.</p>
        </div>

      ) : (

        <>
          <h2>Complete Your Provider Profile</h2>

          <input
            className="form-input"
            name="experience"
            value={form.experience}
            placeholder="Experience (years)"
            onChange={handleChange}
          />

          <br /><br />

          {/* ✅ LOCATION INPUT */}
          <input
            className="form-input"
            name="location"
            value={form.location}
            placeholder="Select location from map"
            readOnly
          />

          {/* ✅ MAP PICKER */}
          <LocationPicker
            setLocationData={(data) =>
              setForm(prev => ({
                ...prev,
                location: data.location,
      latitude: data.latitude,
      longitude: data.longitude
              }))
            }
          />

          <br /><br />

          <select name="availability_status" onChange={handleChange}>
            <option value="true">Available</option>
            <option value="false">Busy</option>
          </select>

          <br /><br />

          <textarea
            name="description"
            value={form.description}
            placeholder="Describe your services"
            onChange={handleChange}
          />

          <br /><br />

          <select
            name="skill_id"
            value={form.skill_id}
            onChange={(e) => {
              if (e.target.value === "new") {
                setShowNewSkill(true);
              } else {
                setShowNewSkill(false);
                setForm({ ...form, skill_id: e.target.value });
              }
            }}
          >
            <option value="">Select Skill</option>

            {skills.map(skill => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.skill_name}
              </option>
            ))}

            <option value="new">+ Add New Skill</option>
          </select>

          {showNewSkill && (
            <div className="new-skill-box">
              <h4>Add New Skill</h4>

              <input
                className="form-input"
                placeholder="Skill Name"
                onChange={(e) =>
                  setNewSkill({ ...newSkill, skill_name: e.target.value })
                }
              />

              <input
                className="form-input"
                placeholder="Category"
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
              />

              <textarea
                className="form-input"
                placeholder="Description"
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
              />

              <button
                type="button"
                className="submit-btn"
                onClick={handleAddSkill}
              >
                + Add Skill
              </button>
            </div>
          )}

          <br /><br />

          <input
            className="form-input"
            type="number"
            name="price"
            value={form.price}
            placeholder="Service Price"
            onChange={handleChange}
          />

          <br /><br />

          <input
            className="form-input"
            type="number"
            name="duration"
            value={form.duration}
            placeholder="Service Duration"
            onChange={handleChange}
          />

          <br /><br />

          <input
            className="form-input"
            type="file"
            name="document"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
          />

          <br /><br />

          <button className="submit-btn" onClick={handleSubmit}>
            Submit Profile
          </button>
        </>

      )}

    </div>
  );
}

export default VendorVerification;