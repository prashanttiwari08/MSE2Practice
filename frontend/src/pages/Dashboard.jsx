import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>No user found ❌</h2>
        <button onClick={() => navigate("/")}>Go to Login</button>
      </div>
    );
  }

  return (
  <div className="page-wrapper">
    <div className="portal-card">
      <div style={{fontSize: "50px"}}>🎓</div>
      <h2>Welcome, {user.name}!</h2>
      <p>Student Email: {user.email}</p>
      
      <div style={{background: "#f9fafb", padding: "15px", borderRadius: "8px", margin: "20px 0"}}>
        <small>Portal Status: 🟢 Active</small>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  </div>
);
};

export default Dashboard;