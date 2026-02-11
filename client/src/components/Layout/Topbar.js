import React from "react";
import { useSelector } from "react-redux";
import "./layout.css";

function Topbar() {
  const { user } = useSelector((state) => state.users);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Dashboard</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          {user?.firstName} {user?.lastName}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
