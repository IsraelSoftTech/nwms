import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaRegFileAlt, FaRegCalendarAlt, FaBan, FaHome } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  
  return (
    <div>
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="logo">
          <span className="logo-icon">
            <img src={logo} alt="" />
          </span>
        </div>
        <ul className={`nav-links ${isSidebarOpen ? "active" : ""}`}>
          <li>
            <Link 
              to="/admin-dashboard" 
              className={`link ${location.pathname === "/admin-dashboard" ? "active" : ""}`}
            >
              <MdDashboard className="icon1" /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-report" 
              className={`link ${location.pathname === "/admin-report" ? "active" : ""}`}
            >
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-schedule" 
              className={`link ${location.pathname === "/admin-schedule" ? "active" : ""}`}
            >
              <FaRegCalendarAlt className="icon1" /> Schedule
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-legal" 
              className={`link ${location.pathname === "/admin-legal" ? "active" : ""}`}
            >
              <FaBan className="icon1" /> Illegal Dumpsites
            </Link>
          </li>
        </ul>
      </aside>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <Link to="/admin-dashboard" className="mobile-nav-icon">
          <FaHome/>
        </Link>
        <Link to="/admin-report" className="mobile-nav-icon">
          <FaRegFileAlt />
        </Link>
        <Link to="/admin-schedule" className="mobile-nav-icon">
          <FaRegCalendarAlt />
        </Link>
        <Link to="/admin-legal" className="mobile-nav-icon">
          <FaBan />
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;