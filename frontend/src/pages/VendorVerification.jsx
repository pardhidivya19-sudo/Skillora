import { useState, useEffect } from "react";
import API from "../services/api";

function VendorVerification() {

  
  const [form, setForm] = useState({
  experience: "",
  location: "",
  availability_status: true,
  description: "",
  skill_id: "",
  price: "",
  duration: "",
  document:null
});
const [skills, setSkills] = useState([]);

useEffect(() => {
  fetchSkills();
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
[name]: name==="availability_status" ? value==="true" : value
})

}

  const handleSubmit = async () => {
    try {

      const token = localStorage.getItem("token");

await API.post(
  "/provider/create-profile",
  form,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      alert("Profile submitted successfully. Waiting for admin approval.");

    } catch (err) {
      alert("Error submitting profile");
    }
  };

  return (
    <div style={{padding:"40px"}}>

      <h2>Complete Your Provider Profile</h2>

      <input
  name="experience"
  value={form.experience}
  placeholder="Experience (years)"
  onChange={handleChange}
/>

      <br/><br/>

      <input
  name="location"
  value={form.location}
  placeholder="Service Location"
  onChange={handleChange}
/>

      <br/><br/>

      <select name="availability_status" onChange={handleChange}>
<option value="true">Available</option>
<option value="false">Busy</option>
</select>
      <br/><br/>

      <textarea
  name="description"
  value={form.description}
  placeholder="Describe your services"
  onChange={handleChange}
/>

      <br/><br/>

<select
  name="skill_id"
  value={form.skill_id}
  onChange={handleChange}
>
  <option value="">Select Skill</option>
 {skills.map(skill => (
<option key={skill.skill_id} value={skill.skill_id}>
{skill.skill_name}
</option>
))}
</select>
<br/><br/>

<input
  type="number"
  name="price"
  value={form.price}
  placeholder="Service Price"
  onChange={handleChange}
/>
<br/><br/>

<input
  type="number"
  name="duration"
  value={form.duration}
  placeholder="Service Duration"
  onChange={handleChange}
/>

<br/><br/>

<input
type="file"
name="document"
onChange={handleChange}
/>

      <button onClick={handleSubmit}>
        Submit Profile
      </button>

    </div>
  );
}

export default VendorVerification;