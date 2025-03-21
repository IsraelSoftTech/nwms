import React, { useState, useEffect } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import NotifyWrapper from "../Notify/Notify"; // Import Notify component
import Profile from "../profile"; // Import Profile component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import Loader from "../Loader"; // Import Loader component
import "./Topbar.css";

const Topbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [displayUsername, setDisplayUsername] = useState(localStorage.getItem("username") || "");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const navigate = useNavigate();

  useEffect(() => {
    // Update username and profile image when localStorage changes
    const updateUserInfo = () => {
      setDisplayUsername(localStorage.getItem("username") || "");
      setProfileImage(localStorage.getItem("profileImage") || "");
    };

    // Listen for storage changes
    window.addEventListener('storage', updateUserInfo);
    
    // Initial check
    updateUserInfo();

    return () => {
      window.removeEventListener('storage', updateUserInfo);
    };
  }, []);

  const toggleNotify = () => {
    setShowNotify(!showNotify);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    setLoading(true); // Show loader immediately
    setTimeout(() => {
      localStorage.removeItem("username");
      navigate("/signin"); // Redirect to SignIn page
      setLoading(false); // Hide loader after navigation
    }, 1500); // Simulate loading delay
  };

  const handleSettingsClick = () => {
    setShowProfile(true);
    setShowProfileMenu(false); // Close profile menu on settings click
  };

  if (loading) {
    return <Loader />; // Show loader if loading state is true
  }

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
        {showSearch ? (
          <div className="search-bar">
            <input type="text" placeholder="place a search" autoFocus />
            <MdClose className="close-icon" onClick={() => setShowSearch(false)} />
          </div>
        ) : (
          <div className="top-icons">
            <MdSearch className="mobile-search-icon" onClick={() => setShowSearch(true)} />
            <FaBell
              className={`icon1 bell ${showNotify ? 'active' : ''}`} // Add active class based on showNotify
              onClick={toggleNotify} style={{ cursor: "pointer" }}
            />
            <div className="notification-badge">1</div>
            <div className="profile-container-text" onClick={toggleProfileMenu} style={{cursor:"pointer"}}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <h6>{displayUsername ? displayUsername.slice(0, 2).toUpperCase() : "U"}</h6>
              )}
            </div>
          </div>
        )}
      </div>

      {showNotify && <NotifyWrapper onClose={toggleNotify} />}

      {showProfileMenu && (
        <div className="profile-menu">
          <div className="profile-menu-item" onClick={handleSettingsClick}>
            <FaCog /> Settings
          </div>
          <div className="profile-menu-item" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </div>
          <MdClose className="close-icon" onClick={toggleProfileMenu} />
        </div>
      )}

      {showProfile && <Profile username={displayUsername} onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default Topbar;