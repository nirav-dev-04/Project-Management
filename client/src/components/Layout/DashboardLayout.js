import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";

function DashboardLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <div className="layout-content fade-in">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
