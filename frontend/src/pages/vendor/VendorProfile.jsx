import { useEffect, useState } from "react";
import API from "../../services/api";
import "./VendorProfile.css";
import { Mail, MapPin, Briefcase } from "lucide-react";

function VendorProfile() {

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    experience: "",
    location: "",
    description: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/provider/profile");
    setProfile(res.data);

    setForm({
      experience: res.data.experience || "",
      location: res.data.location || "",
      description: res.data.description || ""
    });

    const skillRes = await API.get("/provider/profile/skills");
    setSkills(skillRes.data);
    
  };

 const handleUpdate = async () => {
  try {
    await API.put("/provider/profile/update", {
      experience: form.experience || null,
      location: form.location || null,
      description: form.description || null
    });

    setEdit(false);
    fetchProfile(); // refresh UI

  } catch (err) {
    console.log(err);
  }
};

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) return alert("Select image first");

    const formData = new FormData();
    formData.append("image", image);

    try {
      await API.put("/provider/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Image updated successfully");

      setImage(null);
      fetchProfile();

    } catch (err) {
      console.log(err);
    }
  };

 const handleToggle = async () => {
  try {
    await API.put("/provider/toggle-availability"); // ✅ new safe API
    fetchProfile(); // refresh
  } catch (err) {
    console.log(err);
  }
};

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* 🔥 TOP SECTION */}
        <div className="profile-top">

          {/* LEFT IMAGE */}
          <div className="profile-left">
            <div className="profile-image-box">
              <img
                src={profile.profile_image || "https://via.placeholder.com/120"}
                alt="profile"
                className="profile-img"
              />

            {edit && (
  <div className="upload-section">

    <label className="custom-file-upload">
      <input type="file" onChange={handleImageChange} />
      Choose Image
    </label>

    {image && (
      <p className="file-name">{image.name}</p>
    )}

    <button onClick={uploadImage} className="upload-btn">
      Upload
    </button>

  </div>
)}
            </div>
          </div>

          {/* CENTER INFO */}
          <div className="profile-center">
            <h2>{profile.name}</h2>
            <p className="rating">
  ⭐ {profile.rating || "N/A"}
</p>
          </div>

          {/* RIGHT EDIT BUTTON */}
          {!edit && (
            <div className="profile-right">
              <button className="edit-btn" onClick={() => setEdit(true)}>
                Edit
              </button>
            </div>
          )}

        </div>

        {/* 🔥 STATUS BAR */}
 <div className="status-bar">

  <label className="switch">
    <input
      type="checkbox"
      checked={profile.availability_status}
      onChange={handleToggle}
    />
    <span className="slider"></span>
  </label>
   <span
    className={
      profile.availability_status ? "online-dot" : "offline-dot"
    }
  ></span>


  <p>
    {profile.availability_status
      ? "Online — Availability Status"
      : "Offline — Availability Status"}
  </p>

</div>
        {/* 🔥 INFO GRID */}
       <div className="profile-info">

  {/* EMAIL */}
  <div className="info-item">
    <Mail size={18} className="icon" />
    <div className="info-text">
      <p className="label">Email</p>
      <p className="value">{profile.email}</p>
    </div>
  </div>

  {/* LOCATION */}
  <div className="info-item">
    <MapPin size={18} className="icon" />
    <div className="info-text">
      <p className="label">Location</p>
      <p className="value">{profile.location || "Not added"}</p>
    </div>
  </div>

  {/* EXPERIENCE */}
  <div className="info-item">
    <Briefcase size={18} className="icon" />
    <div className="info-text">
      <p className="label">Experience</p>
      <p className="value">
        {profile.experience
          ? `${profile.experience} Years`
          : "Not added"}
      </p>
    </div>
  </div>

</div>

        {/* 🔥 CONTENT */}
        {!edit ? (
          <>
            <p className="desc">{profile.description}</p>

            <div className="skills-box">
              <p className="label">Skills</p>
              <div className="skills-list">
                {skills.map((s, i) => (
                  <span key={i}>{s.skill_name}</span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="edit-form">

  {/* ROW 1 */}
  <div className="form-row">
    <div className="form-group">
      <label>Name</label>
      <input value={profile.name} disabled />
    </div>

    <div className="form-group">
      <label>Email</label>
      <input value={profile.email} disabled />
    </div>
  </div>

  {/* ROW 2 */}
  <div className="form-row">
    <div className="form-group">
      <label>Experience</label>
      <input
        value={form.experience}
        onChange={(e) =>
          setForm({ ...form, experience: e.target.value })
        }
        placeholder="Enter experience"
      />
    </div>

    <div className="form-group">
      <label>Location</label>
      <input
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
        placeholder="Enter location"
      />
    </div>
  </div>

  {/* DESCRIPTION */}
  <div className="form-group full">
    <label>Description</label>
    <textarea
      value={form.description}
      onChange={(e) =>
        setForm({ ...form, description: e.target.value })
      }
      placeholder="Enter description"
    />
  </div>

  {/* BUTTONS */}
  <div className="edit-actions">
    <button onClick={handleUpdate}>Save Changes</button>

    <button
      className="cancel-btn"
      onClick={() => {
        setEdit(false);
        fetchProfile();
      }}
    >
      Cancel
    </button>
  </div>

</div>
        )}

      </div>

    </div>
  );
}

export default VendorProfile;