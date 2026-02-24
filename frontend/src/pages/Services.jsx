import "./Services.css";

function Services() {
  const services = [
    { title: "Home Cleaning", icon: "🧹" },
    { title: "Plumbing", icon: "🚰" },
    { title: "Electrician", icon: "💡" },
    { title: "AC Repair", icon: "❄️" },
    { title: "Salon at Home", icon: "💄" },
    { title: "Carpentry", icon: "🪚" },
    { title: "Painting", icon: "🎨" },
    { title: "Appliance Repair", icon: "🛠️" },
  ];

  return (
    <div className="services-page">
      <h1 className="services-heading">Our Services</h1>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;