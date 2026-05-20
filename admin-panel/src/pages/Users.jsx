import { useEffect, useState } from "react";
import API from "../services/adminApi";
import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.log("Error fetching users");
    }
  };

 const handleBlock = async (id) => {
  try {
    const res = await API.put(`/block-user/${id}`);

    setUsers((prevUsers) => {
      const updated = prevUsers.map((user) =>
        user.user_id === id
          ? { ...user, is_blocked: res.data.is_blocked }
          : user
      );

      // IMPORTANT: also update filteredUsers from same updated array
      setFilteredUsers(updated);

      return updated;
    });

  } catch (err) {
    console.log("Error blocking user");
  }
};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/delete-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.log("Error deleting user");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2>All Users</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="search-input"
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>

              <td>
  <span
    className={
      user.is_blocked ? "status inactive" : "status active"
    }
  >
    {user.is_blocked ? "Inactive" : "Active"}
  </span>
</td>

              <td className="action-cell">
  <button
  className={`action-btn ${
    user.is_blocked ? "unblock-btn" : "block-btn"
  }`}
  onClick={() => handleBlock(user.user_id)}
>
  {user.is_blocked ? "Unblock" : "Block"}
</button>

  <button
    className="action-btn delete-btn"
    onClick={() => handleDelete(user.user_id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;