import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./AddService.css";

function AddService() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    skill_id: "",
    price: "",
    duration: "",
    description: "",
  image: null
  });
  const [showNewSkill, setShowNewSkill] = useState(false);
const [newSkill, setNewSkill] = useState({
  skill_name: "",
  category: "",
  description: ""
});

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/provider/skills")
      .then(res => setSkills(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAddSkill = async () => {
  try {
    const res = await API.post("/provider/add-skill", newSkill);

    // 🔥 dropdown update
    setSkills(prev => [...prev, res.data]);

    // 🔥 auto select new skill
    setForm({ ...form, skill_id: res.data.skill_id });

    setShowNewSkill(false);

  } catch (err) {
    console.log(err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const formData = new FormData();

formData.append("skill_id", form.skill_id);
formData.append("price", form.price);
formData.append("duration", form.duration);
formData.append("description", form.description);
formData.append("title", form.title);
formData.append("image", form.image);

await API.post("/provider/services", formData);
      alert("Service Added ✅");

      navigate("/vendor/services"); // 🔥 auto redirect

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-service-container">
      <h2>Add Service</h2>

     <form onSubmit={handleSubmit} className="service-form">

  <h3 className="form-section">Service Details</h3>

  {/* SKILL SELECT */}
  <select
    className="input"
    onChange={(e) => {
      if (e.target.value === "new") {
        setShowNewSkill(true);
      } else {
        setShowNewSkill(false);
        setForm({ ...form, skill_id: e.target.value });
      }
    }}
    required
  >
    <option value="">Select Skill</option>
    {skills.map(skill => (
      <option key={skill.skill_id} value={skill.skill_id}>
        {skill.skill_name}
      </option>
    ))}
    <option value="new">+ Add New Skill</option>
  </select>

  {/* NEW SKILL BOX */}
  {showNewSkill && (
    <div className="new-skill-box">

      <h4>Add New Skill</h4>

      <input
        className="input"
        placeholder="Skill Name"
        onChange={(e) =>
          setNewSkill({ ...newSkill, skill_name: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Category"
        onChange={(e) =>
          setNewSkill({ ...newSkill, category: e.target.value })
        }
      />

      <textarea
        className="input"
        placeholder="Description"
        onChange={(e) =>
          setNewSkill({ ...newSkill, description: e.target.value })
        }
      />

      <button type="button" className="secondary-btn" onClick={handleAddSkill}>
        + Add Skill
      </button>

    </div>
  )}

  {/* GRID */}
  <div className="form-grid">

    <input
      className="input"
      type="text"
      placeholder="Title"
      onChange={(e) => setForm({...form, title: e.target.value})}
    />

    <input
      className="input"
      type="number"
      placeholder="Price (₹)"
      onChange={(e) => setForm({ ...form, price: e.target.value })}
      required
    />

    <input
      className="input"
      type="text"
      placeholder="Duration (e.g. 2 hours)"
      onChange={(e) => setForm({ ...form, duration: e.target.value })}
      required
    />

  </div>

  {/* DESCRIPTION */}
  <textarea
    className="input"
    placeholder="Service Description"
    onChange={(e) => setForm({...form, description: e.target.value})}
  />

  {/* FILE */}
  <div className="file-upload">

  <label className="file-label">Upload Image</label>

  <label className="custom-file">
    <input
      type="file"
      onChange={(e) => setForm({...form, image: e.target.files[0]})}
    />
    <span>Choose Image</span>
  </label>

  {/* FILE NAME SHOW */}
  {form.image && (
    <p className="file-name">{form.image.name}</p>
  )}

</div>

  {/* BUTTON */}
  <button type="submit" className="primary-btn">
    Add Service
  </button>

</form>
    </div>
  );
}

export default AddService;