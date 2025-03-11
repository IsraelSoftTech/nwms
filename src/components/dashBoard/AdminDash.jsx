import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaBell, FaTruckPickup,FaBan } from "react-icons/fa";
import {  MdMenu, MdSearch } from "react-icons/md";
import {  } from 'react-icons/ai';

import {  FiUsers } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./AdminDash.css";
import logo from "../../assets/logo.png";
import { Link} from "react-router-dom";


import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import EduContent from "../EduContent/EduContent";
import Users from "../users/Users";

//import users
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseApp from "../../firebaseConfig"; 
import CustomAreaChart from "../recharts/CustomAreaChart";
import Profile from "../profile";

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


  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
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
            <Link to="/admin-report" className="link">
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link to="admin-schedule" className="link">
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
            <MdSearch className="search-icon-mobile"/>
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
