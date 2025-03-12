import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaRegFileAlt, FaRegCalendarAlt, FaHome, FaGraduationCap } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "./UserSidebar.css";
import { FcGraduationCap } from "react-icons/fc";

const UserSidebar = ({ isSidebarOpen }) => {
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
              to="/user-dashboard" 
              className={`link ${location.pathname === "/user-dashboard" ? "active" : ""}`}
            >
              <MdDashboard className="icon1" /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/user-report" 
              className={`link ${location.pathname === "/user-report" ? "active" : ""}`}
            >
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link 
              to="/user-schedule" 
              className={`link ${location.pathname === "/user-schedule" ? "active" : ""}`}
            >
              <FaRegCalendarAlt className="icon1" /> Schedule
            </Link>
          </li>
          <li>
            <Link 
              to="/user-edu" 
              className={`link ${location.pathname === "/user-edu" ? "active" : ""}`}
            >
              <FaGraduationCap className="icon1" /> Education
            </Link>
          </li>
        </ul>
      </aside>

     {/* Mobile Navigation */}
<nav className="mobile-nav">
  <Link to="/admin-dashboard" className="mobile-nav-icon">
    <FaHome />
    <span>Home</span>
  </Link>
  <Link to="/admin-report" className="mobile-nav-icon">
    <FaRegFileAlt />
    <span>Report</span>
  </Link>
  <Link to="/admin-schedule" className="mobile-nav-icon">
    <FaRegCalendarAlt />
    <span>Schedule</span>
  </Link>
  <Link to="/admin-legal" className="mobile-nav-icon">
    <FcGraduationCap />
    <span>Education</span>
  </Link>
</nav>

    </div>
  );
};

export default UserSidebar;