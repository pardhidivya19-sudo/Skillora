import React, { useState } from "react";
import "./Professionals.css";
import { professionalsData } from "../../data/professionalsData";
import { FiSearch, FiMapPin, FiCheckCircle} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Professionals = () => {
const [search,setSearch] = useState("");
const filteredPros = professionalsData.filter((pro)=>
pro.name.toLowerCase().includes(search.toLowerCase())
);

return (
<section className="professionals-section">
<h1 className="professionals-title">
Our Professionals
</h1>

<p className="professionals-subtitle">
Verified experts ready to help you
</p>

{/* SEARCH */}
<div className="professionals-search">
<FiSearch className="search-icon"/>

<input
type="text"
placeholder="Search services..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>
<button>Search</button>
</div>

{/* GRID */}
<div className="professionals-grid">
{filteredPros.map((pro)=>(
<div className="professional-card" key={pro.id}>
<div className="professional-top">
<div className="professionals-image">
<img src={pro.image} alt={pro.name}/>
<FiCheckCircle className="professionals-verified"/>
</div>

<div className="professionals-info">
<h3>{pro.name}</h3>
<p className="professionals-role">{pro.role}</p>
<div className="professionals-meta">
<span className="professionals-rating">
<FaStar/>
{pro.rating}
<span className="professionals-reviews">
({pro.reviews})
</span>
</span>

<span className="professionals-location">
<FiMapPin/>
{pro.location}

</span>
</div>
</div>
</div>

<div className="professionals-divider"></div>
<div className="professional-bottom">
<p>{pro.jobs} jobs completed</p>
<button className="professionals-book-btn">
Book Now
</button>
</div>

</div>
))}
</div>
</section>
);
};

export default Professionals;