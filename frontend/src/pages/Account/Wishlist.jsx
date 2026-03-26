import React,{useContext} from "react";
import "./Wishlist.css";
import {WishlistContext} from "../../context/WishlistContext";
import {FiHeart} from "react-icons/fi";

const Wishlist = () => {

const {wishlist,toggleWishlist} = useContext(WishlistContext);

return (

<div className="wishlist-page">

<h1 className="wishlist-title">
<FiHeart/> Your Wishlist
</h1>

<div className="wishlist-grid">

{wishlist.map(service => (

<div className="wishlist-card" key={service.id}>

<div className="wishlist-img">

<img src={service.image}/>

<div
className="wishlist-heart"
onClick={()=>toggleWishlist(service)}
>
<FaHeart/>
</div>

<span className="wishlist-category">
{service.category}
</span>

</div>

<div className="wishlist-info">

<p className="rating">
⭐ {service.rating} ({service.reviews})
</p>

<h3>{service.title}</h3>

<p className="desc">
{service.description}
</p>

<div className="bottom">

<span className="time">
⏱ {service.time}
</span>

<span className="price">
${service.price}/service
</span>

</div>

</div>

</div>

))}

</div>

</div>

);

};

export default Wishlist;