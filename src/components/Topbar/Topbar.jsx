import React, { useState, useEffect } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import NotifyWrapper from "../Notify/Notify"; // Import Notify component
import Profile from "../profile"; // Import Profile component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import Loader from "../Loader"; // Import Loader component
import "./Topbar.css";

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const Topbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (currentUser) {
          const response = await fetch(firebaseUrl);
          const users = await response.json();
          const userFound = Object.values(users).find(user => user.username === currentUser.username);
          
          if (userFound) {
            setUserData({
              username: userFound.username,
              image: userFound.image || null
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
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
      sessionStorage.removeItem("currentUser");
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
              {userData?.image ? (
                <img 
                  src={userData.image} 
                  alt="Profile" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <h6>{userData?.username ? userData.username.slice(0, 2).toUpperCase() : "U"}</h6>
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

      {showProfile && <Profile username={userData?.username} onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default Topbar;