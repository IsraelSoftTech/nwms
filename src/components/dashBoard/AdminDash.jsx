import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaBell, FaTruckPickup, FaUserAlt, FaBan } from "react-icons/fa";
import {  MdMenu, MdSearch } from "react-icons/md";
import {  } from 'react-icons/ai';

import {  FiUsers } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./AdminDash.css";
import logo from "../../assets/logo.png";
import { Link,  useNavigate } from "react-router-dom";


import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import EduContent from "../EduContent/EduContent";
import Users from "../users/Users";

//import users
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseApp from "../../firebaseConfig"; 
import CustomAreaChart from "../recharts/CustomAreaChart";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);
//abreviate username text




const AdminDash = () => {
  //Count users
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const db = getDatabase(firebaseApp);
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserCount(Object.keys(data).length);
      } else {
        setUserCount(0);
      }
    });
  }, []);
//--------------------------------------
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate(); // Used for navigation


  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearchClick = () => {
    setIsSearchVisible((prev) => !prev);
  };
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to Signin.jsx
  };

  const openEditProfile = () => {
    setIsEditProfileOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const closeEditProfile = () => {
    setIsEditProfileOpen(false);
  };


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="logo">
          <span className="logo-icon"><img src={logo} alt=""/></span>
        </div>
        <ul className={`nav-links ${isSidebarOpen ? "active" : ""}`}>
  <li>
    <Link to="/admin-dashboard" className="active link">
      <MdDashboard className="icon1" /> Dashboard
    </Link>
  </li>
  <li>
    <Link to="/report" className="link">
      <FaRegFileAlt className="icon1" /> Report
    </Link>
  </li>
  <li>
    <Link to="/schedule" className="link">
      <FaRegCalendarAlt className="icon1" /> Schedule
    </Link>
  </li>
  <li>
    <Link to="/admin-legal" className="link">
      <FaBan className="icon1" /> Illegal Reports
    </Link>
  </li>
 
</ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
      <header className="topbar">
        
          <h2>WASTE MANAGEMENT APPLICATION</h2>
          <MdMenu className="menu-icon" onClick={handleMenuClick} />
          <div className={`search-box-mobile ${isSearchVisible ? "active" : ""}`}>
            <MdSearch className="search-icon-mobile" onClick={handleSearchClick} />
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
            <div className="text-profile" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
      <FaUserAlt className="profile-icon" onClick={toggleProfileDropdown}/> 
      <p style={{ textAlign: "center", fontSize: "14px", color: "black" }}>admin</p>
   
   
    </div>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <p onClick={openEditProfile}>Edit Profile</p>
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{color:"black"}}>Edit Profile</h3>
              <label style={{color:"black"}}>Username:</label>
              <input type="text" value="admin_account" readOnly  style={{color:"black"}}/>
              <label style={{color:"black"}}>Password:</label>
              <input type="text" value="admin_password" readOnly style={{color:"black"}}/>
              <button className="close-btn" onClick={closeEditProfile} style={{color:"black"}}> 
                Close
              </button>
            </div>
          </div>
        )}

<section className="stats-section">
      <div className="stat-card">
        <FaRegFileAlt className="icon2" />
        <h3>Reports</h3>
        <p>21</p>
      </div>
      <div className="stat-card">
        <FaTruckPickup className="icon2" />
        <h3>Pending PickUps</h3>
        <p>12</p>
      </div>
      <div className="stat-card">
        <FiUsers className="icon2" />
        <h3>Users</h3>
        <p>{userCount}</p> {/* Dynamically updates the user count */}
      </div>
    </section>

        {/* Educational Content */}
        <section className="content-section">
         <EduContent/>
 <div className="graph-box">
   
      <div className="graph-placeholder">
      <CustomAreaChart/>
      </div>
    </div>
        </section>

        {/* User and Dump Site */}
      
       
         <section className="user-illegal">
          <div className="newUser" style={{overflowY:"hidden"}}> <Users /></div>
        
          <div className="user-box">
            <h3>Illegal Dump Sites</h3>
            <div className="graph-placeholder"></div>
          </div>
        </section>

     
      </main>
    </div>
  );
};

export default AdminDash;
