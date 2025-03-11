import React, { useState } from "react";
import {
  FaRegFileAlt,
 
  FaBell,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTruckPickup,
  FaBan,
} from "react-icons/fa";
import { MdMenu, MdSearch } from "react-icons/md";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./AdminReport.css";
import Profile from "../profile";
// Import necessary components
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const AdminReport = () => {
  //sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="logo">
          <span className="logo-icon">
            <img src={logo} alt="" />
          </span>
        </div>
        <ul className={`nav-links ${isSidebarOpen ? "active" : ""}`}>
          <li>
            <Link to="/admin-dashboard" className="link">
              <MdDashboard className="icon1" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin-report" className="active link">
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link to="/admin-schedule" className="link">
              <FaRegCalendarAlt className="icon1" /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/admin-legal" className="link">
              <FaBan className="icon1" /> Illegal Dumpsites
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2>WASTE MANAGEMENT APPLICATION</h2>
          <MdMenu className="menu-icon" onClick={handleMenuClick} />
          <div className="search-box-mobile">
            <MdSearch className="search-icon-mobile" />
            <input type="text" placeholder="Place a search" />
          </div>
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input type="text" placeholder="Place a search" />
          </div>
          <div className="top-icons">
            <FaBell className="icon1 bell" />
            <div className="notification-badge">1</div>
            <div className="profile-container">
        <Profile />
      </div>
          </div>
        </header>

        <section className="stats-section">
          <div className="stat-card">
            <BsExclamationTriangle className="icon2" />
            <h3>Illegal Dumpsites</h3>
            <p>21</p>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <h3>Missed Reports</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FaTrash className="icon2" />
            <h3>Overflowing Dumpsites</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaTimesCircle className="icon2" />
            <h3>Unresolved Reports</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaSpinner className="icon2" />
            <h3>In-Progress Reports</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <h3>Resolved Reports</h3>
            <p>10</p>
          </div>
        </section>

        {/* Reports of submission */}
        <section className="user-illegal-report">
          <div className="user-box" style={{ height: "350px" }}>
            <h3 style={{ alignItems: "center", display: "flex", gap: "15px" }}>
              Summary of Submitted Reports
            </h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="editDel">
                      <FaCheckCircle
                        className="resolve-icon"
                        style={{
                          color: "#23AE60",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      />
                      <FaSpinner className="edit-icon" />
                      <FiTrash2 className="delete-icon" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminReport;
