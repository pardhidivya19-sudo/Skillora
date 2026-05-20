import "./HowWorks.css";

function HowWorks(){

const steps = [
{
num:"01",
title:"Choose a Service",
desc:"Browse our wide range of professional home and personal services."
},
{
num:"02",
title:"Pick a Professional",
desc:"Select from verified, top-rated professionals in your area."
},
{
num:"03",
title:"Book & Relax",
desc:"Schedule at your convenience and enjoy hassle-free service."
}
]

return(

<section className="hw-section">

<div className="hw-container">

<h2 className="hw-title">
How Skillora Works
</h2>

<p className="hw-subtitle">
Get professional services in three simple steps
</p>


<div className="hw-grid">

{steps.map((step,index)=> (

<div className="hw-card" key={index}>

<div className="hw-number">

<span>{step.num}</span>

</div>

<h3>{step.title}</h3>

<p>{step.desc}</p>

</div>

))}

</div>

</div>

</section>

)

}

export default HowWorks