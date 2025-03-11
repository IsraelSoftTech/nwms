import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaBell, FaTruckPickup, FaUserAlt } from "react-icons/fa";
import { MdMenu, MdSearch } from "react-icons/md";
import { FaRegCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./Educare.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const firebaseUrl =
  "https://register-d6145-default-rtdb.firebaseio.com/educational_contents.json";

const abbreviateUsername = (username) => {
  const words = username.split("_");
  if (words.length >= 2) {
    return (words[0][0] + words[1].slice(0, 2)).toUpperCase();
  } else {
    return username.slice(0, 3).toUpperCase();
  }
};

const Educare = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [username, setUsername] = useState("Loading...");
  const [educationalContents, setEducationalContents] = useState([]);
  const [expandedContent, setExpandedContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          "https://register-d6145-default-rtdb.firebaseio.com/users.json"
        );
        const users = await response.json();
        if (users) {
          const loggedInUser = Object.values(users).find(
            (user) => user.role === "admin"
          );
          if (loggedInUser) {
            setUsername(abbreviateUsername(loggedInUser.username));
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);
// educational contents
  useEffect(() => {
    const fetchEducationalContents = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        if (data) {
          setEducationalContents(Object.values(data));
        }
      } catch (error) {
        console.error("Error fetching educational content:", error);
      }
    };

    fetchEducationalContents();
    const interval = setInterval(fetchEducationalContents, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleContent = (index) => {
    setExpandedContent(expandedContent === index ? null : index);
  };
// --------------------------------------------------------------------------------------------------------------------
  return (
    <div className="dashboard-container">
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
            <Link to="/education" className="active link">
              <FaGraduationCap className="icon1" /> Education
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>WASTE MANAGEMENT APPLICATION</h2>
          <MdMenu className="menu-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className={`search-box-mobile ${isSearchVisible ? "active" : ""}`}>
            <MdSearch className="search-icon-mobile" onClick={() => setIsSearchVisible(!isSearchVisible)} />
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
              <div className="text-profile" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUserAlt className="profile-icon" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} />
                <p style={{ fontSize: "14px", color: "black" }}>{username}</p>
              </div>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <p onClick={() => setIsEditProfileOpen(true)}>Edit Profile</p>
                  <p onClick={() => navigate("/")}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {isEditProfileOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{ color: "black" }}>Edit Profile</h3>
              <label style={{ color: "black" }}>Username:</label>
              <input type="text" value="admin_account" readOnly style={{ color: "black" }} />
              <label style={{ color: "black" }}>Password:</label>
              <input type="text" value="admin_password" readOnly style={{ color: "black" }} />
              <button className="close-btn" onClick={() => setIsEditProfileOpen(false)} style={{ color: "black" }}>
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
        </section>

        {/* Educational Content */}
        <section className="content-section">
          <div className="content-box">
            <div className="edu">
              <h3>Educational Contents</h3>
            </div>
            {educationalContents.length === 0 ? (
              <p>No content available. Click the plus icon to add.</p>
            ) : (
              <ul>
              {educationalContents.map((content, index) => (
                <li key={index} onClick={() => toggleContent(index)} style={{ cursor: "pointer" }}>
                  {expandedContent === index 
                    ? content.text 
                    : (typeof content.text === "string" ? content.text.split(".")[0] + "." : "Invalid content")}
                </li>
              ))}
            </ul>
            
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Educare;
