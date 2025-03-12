import React from "react";
import {  MdSearch } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import Profile from "../profile"; 
import "./Topbar.css"
const Topbar = ({ handleMenuClick }) => {
  return (
    <header className="topbar">
      <h2>WASTE MANAGEMENT APPLICATION</h2>
    
     
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
  );
};

export default Topbar;
