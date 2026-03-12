import "./Testimonials.css";
import { FaStar } from "react-icons/fa";

import user1 from "../../assets/images/pro1.png";
import user2 from "../../assets/images/pro2.png";
import user3 from "../../assets/images/pro3.png";
import user4 from "../../assets/images/pro1.png";

const testimonials = [
{
id:1,
name:"Priya Sharma",
service:"Deep Home Cleaning · 2 days ago",
image:user1,
rating:5,
review:"Absolutely amazing service! The team was professional, on time, and left my home spotless. Will definitely book again."
},

{
id:2,
name:"Rahul Verma",
service:"Plumbing Repair · 1 week ago",
image:user2,
rating:5,
review:"The plumber fixed the leaking pipe in under an hour. Very knowledgeable and reasonably priced. Highly recommended!"
},

{
id:3,
name:"Ananya Kapoor",
service:"Bridal Makeup · 3 days ago",
image:user3,
rating:4,
review:"Did a wonderful job with my wedding makeup. I looked absolutely stunning. Thank you Skillora!"
},

{
id:4,
name:"Vikram Singh",
service:"Electrical Repair · 5 days ago",
image:user4,
rating:5,
review:"The electrician was prompt and efficient. Fixed all the wiring issues and even gave tips on energy saving."
}

];

function Testimonials(){
return(
<section className="test-section">
<div className="test-container">
<h2 className="test-title">
What Our Customers Say
</h2>

<p className="test-subtitle">
Real reviews from real customers
</p>

<div className="test-grid">
{testimonials.map((t)=> (
<div className="test-card" key={t.id}>
<div className="test-top">

<img src={t.image} alt={t.name} />
<div className="test-user">
<h4>{t.name}</h4>
<p>{t.service}</p>

</div>
<div className="test-stars">
{[...Array(5)].map((_,i)=> (

<FaStar
key={i}
className={i < t.rating ? "star active" : "star"}
/>

))}
</div>
</div>

<p className="test-review">
{t.review}
</p>

</div>
))}
</div>
</div>
</section>
)}

export default Testimonials;