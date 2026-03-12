import React from "react";
import "./OurTeam.css";

import team1 from "../../assets/images/pro1.png";
import team2 from "../../assets/images/pro2.png";
import team3 from "../../assets/images/pro3.png";
import team4 from "../../assets/images/pro4.png";

const teamMembers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    image: team1,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "CTO",
    image: team2,
  },
  {
    id: 3,
    name: "Marcus Lee",
    role: "Head of Operations",
    image: team3,
  },
  {
    id: 4,
    name: "Sofia Chen",
    role: "Head of Design",
    image: team4,
  },
];

const OurTeam = () => {
  return (
    <section className="team-section">

      <h2 className="team-title">Our Team</h2>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div className="team-card" key={member.id}>

            <div className="team-image">
              <img src={member.image} alt={member.name} />
            </div>

            <h3>{member.name}</h3>

            <p>{member.role}</p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default OurTeam;