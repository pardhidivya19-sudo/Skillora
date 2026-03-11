import "./TopProfessionals.css";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import {FaStar} from "react-icons/fa"
import pro4 from "../../assets/images/pro4.png";
import pro2 from "../../assets/images/pro2.png";
import pro3 from "../../assets/images/pro3.png";

export const professionals = [
{
id:1,
name:"Rahul Verma",
role:"Home Cleaning Expert",
rating:"4.9",
reviews:"234",
location:"Mumbai",
jobs:"567",
image:pro4
},

{
id:2,
name:"Sandeep Patel",
role:"Licensed Plumber",
rating:"4.8",
reviews:"189",
location:"Delhi",
jobs:"423",
image:pro3
},

{
id:3,
name:"Neha Sharma",
role:"Makeup Artist",
rating:"4.9",
reviews:"312",
location:"Bangalore",
jobs:"678",
image:pro2
}
]

function TopProfessionals(){

return(

<section className="tp-section">

<div className="tp-container">

{/* HEADER */}

<div className="tp-header">

<div>
<h2>Top Professionals</h2>
<p>Verified experts ready to serve you</p>
</div>

<a className="tp-view">
View All →
</a>

</div>


{/* CARDS */}

<div className="tp-grid">

{professionals.map((pro)=> (

<div className="tp-card" key={pro.id}>

<div className="tp-top">

<div className="tp-avatar">

<img src={pro.image} />

<div className="tp-verified">
<FiCheckCircle/>
</div>

</div>


<div className="tp-info">

<h3>{pro.name}</h3>

<p className="tp-role">{pro.role}</p>

<div className="tp-meta">

<span className="tp-rating">
<FaStar className="tp-star"/>
{pro.rating}
<span>({pro.reviews})</span>
</span>

<span className="tp-location">
<FiMapPin/>
{pro.location}
</span>

</div>

</div>

</div>


<hr/>


<div className="tp-bottom">

<p>{pro.jobs} jobs completed</p>

<button className="tp-btn">
Book Now
</button>

</div>

</div>

))}

</div>

</div>

</section>

)

}

export default TopProfessionals