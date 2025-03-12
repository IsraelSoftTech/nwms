import React from "react";
import {  MdSearch } from "react-icons/md";
import { FaBell} from "react-icons/fa";

import "./Topbar.css"
const Topbar = ({ handleMenuClick }) => {
  return (
    <header className="topbar">
      <h1>WAS<span style={{color:"#FE7235"}}>TE A</span>PP</h1>
    
     
      <div className="search-box">
        <MdSearch className="search-icon" />
        <input type="text" placeholder="Place a search" />
      </div>
      <div className="top-icons">
        <FaBell className="icon1 bell" />
        <div className="notification-badge">1</div>
        <div className="profile-container-text">
          <h6>AA</h6>
       
        </div>
      </div>
    </header>
  );
};

export default Topbar;