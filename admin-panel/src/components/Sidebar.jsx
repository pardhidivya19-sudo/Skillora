import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "200px" }}>
      <h3>Admin Panel</h3>
      <Link to="/">Dashboard</Link><br />
      <Link to="/users">Users</Link><br />
      <Link to="/providers">Providers</Link><br />
      <Link to="/bookings">Bookings</Link><br />
      <Link to="/payments">Payments</Link><br />
      <Link to="/reviews">Reviews</Link>
    </div>
  );
};

export default Sidebar;