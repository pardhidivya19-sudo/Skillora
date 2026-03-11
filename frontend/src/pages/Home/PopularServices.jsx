import "./PopularServices.css";
import { popularServices } from "../../data/popularServices";
import { FiHeart, FiClock } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useState } from "react";

function PopularServices(){

const [liked,setLiked] = useState({});

const toggleLike = (id) =>{
  setLiked(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
}

  return(

<section className="pop-section">

<div className="pop-container">

<div className="pop-header">

<div>
<h2>Popular Services</h2>
<p>Most booked services by our customers</p>
</div>

<a className="pop-view">View All →</a>

</div>


<div className="pop-grid">

{popularServices.map((service)=> (

<div className="pop-card" key={service.id}>

<div className="pop-img">

<img src={service.image} />

<span className="pop-tag">{service.category}</span>

<div 
className={`pop-heart ${liked[service.id] ? "active" : ""}`}
onClick={()=>toggleLike(service.id)}
>
{liked[service.id] ? (
  <FaHeart className="heart-filled"/>
) : (
  <FiHeart/>
)}
</div>

</div>


<div className="pop-body">

<div className="pop-rating">
<FaStar className="pop-star"/>
{service.rating}
<span>({service.reviews})</span>
</div>

<h3>{service.title}</h3>

<p className="pop-desc">
{service.desc}
</p>

<div className="pop-bottom">

<div className="pop-time">
<FiClock/>
{service.time}
</div>

<div className="pop-price">
{service.price}<span>/service</span>
</div>

</div>

</div>

</div>

))}

</div>

</div>

</section>

  )
}

export default PopularServices