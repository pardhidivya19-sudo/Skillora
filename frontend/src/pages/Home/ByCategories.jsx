import "./ByCategories.css";
import {
Sparkles,
Wrench,
Zap,
Scissors,
Settings,
Paintbrush
} from "lucide-react";

const categories = [
{
id:1,
title:"Home Cleaning",
services:"24 services",
icon:<Sparkles size={28}/>
},
{
id:2,
title:"Plumbing",
services:"18 services",
icon:<Wrench size={28}/>
},
{
id:3,
title:"Electrical",
services:"15 services",
icon:<Zap size={28}/>
},
{
id:4,
title:"Beauty & Spa",
services:"32 services",
icon:<Scissors size={28}/>
},
{
id:5,
title:"Appliance Repair",
services:"21 services",
icon:<Settings size={28}/>
},
{
id:6,
title:"Painting",
services:"12 services",
icon:<Paintbrush size={28}/>
}
];

function ByCategories(){

return(

<section className="cat-section">

<div className="cat-container">

<h2 className="cat-title">
Browse Categories
</h2>

<p className="cat-subtitle">
Find the perfect service from our curated categories
</p>


<div className="cat-grid">

{categories.map((cat)=>(

<div className="cat-card" key={cat.id}>

<div className="cat-icon">
{cat.icon}
</div>

<h3>{cat.title}</h3>

<p>{cat.services}</p>

</div>

))}

</div>

</div>

</section>

)

}

export default ByCategories;