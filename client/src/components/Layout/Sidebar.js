import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./layout.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo" onClick={() => navigate("/")}>
        WorkZen
      </h2>

      <div className="menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
