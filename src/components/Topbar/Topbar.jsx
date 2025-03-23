import React, { useState, useEffect } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import NotifyWrapper from "../Notify/Notify"; // Import Notify component
import Profile from "../profile"; // Import Profile component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import Loader from "../Loader"; // Import Loader component
import { getDatabase, ref, onValue } from "firebase/database";
import "./Topbar.css";

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const Topbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const db = getDatabase();

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
              image: userFound.image || null,
              role: userFound.role || 'user'
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch notifications for all users, but only count unread for admin
    const notificationsRef = ref(db, 'notifications/');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(notificationsArray);
        // Only count unread notifications for admin
        if (userData?.role === 'admin') {
          const unread = notificationsArray.filter(n => !n.read).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      }
    });
  }, [db, userData?.role]);

  const toggleNotify = () => {
    setShowNotify(!showNotify);
  };

  const handleNotificationClick = (reportId) => {
    setShowNotify(false);
    navigate('./admin-report', { state: { scrollToReport: reportId } });
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
            <div className="notification-container" style={{ position: 'relative', cursor: 'pointer' }}>
              <FaBell
                className={`icon1 bell ${showNotify ? 'active' : ''}`}
                onClick={toggleNotify}
                style={{ cursor: "pointer" }}
              />
              {unreadCount > 0 && (
                <div className="notification-badge" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#FE7235',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  animation: 'pulse 2s infinite'
                }}>
                  {unreadCount}
                </div>
              )}
            </div>
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
                <h6>{userData?.username ? userData.username.slice(0, 2).toUpperCase() : ""}</h6>
              )}
            </div>
          </div>
        )}
      </div>

      {showNotify && (
        <NotifyWrapper 
          onClose={toggleNotify} 
          onNotificationClick={handleNotificationClick}
          isAdmin={userData?.role === 'admin'}
        />
      )}

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