import React, { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { FaBell } from "react-icons/fa";

import "./Topbar.css";

const Topbar = ({ handleMenuClick }) => {
  
  const [showSearch, setShowSearch] = useState(false);
  return (
    <header className="topbar">
      <h1>
        WAS<span style={{ color: "#FE7235" }}>TE A</span>PP
      </h1>

      <div className="search-box">
        <MdSearch className="search-icon" />
        <input type="text" placeholder="Place a search" />
      </div>

      <div className={`topbar-container ${showSearch ? "search-active" : ""}`}>
      {/* Search Bar (Shown Only When Search Icon is Clicked) */}
      {showSearch ? (
        <div className="search-bar">
          <input type="text" placeholder="place a search" autoFocus />
          <MdClose className="close-icon" onClick={() => setShowSearch(false)} />
        </div>
      ) : (
        /* Default Topbar */
        <div className="top-icons">
          <MdSearch className="mobile-search-icon" onClick={() => setShowSearch(true)} />
          <FaBell className="icon1 bell" />
          <div className="notification-badge">1</div>
          <div className="profile-container-text">
            <h6>AA</h6>
          </div>
        </div>
      )}
    </div>
    </header>
  );
};

export default Topbar;