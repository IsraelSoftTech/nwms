import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaBell, FaTruckPickup} from "react-icons/fa";
import { MdMenu, MdSearch } from "react-icons/md";
import { FaRegCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./UserEdu.css";
import logo from "../../assets/logo.png";
import { Link} from "react-router-dom";
import Profile from "../profile";

const firebaseUrl =
  "https://register-d6145-default-rtdb.firebaseio.com/educational_contents.json";



const UserEdu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);



  const [educationalContents, setEducationalContents] = useState([]);
  const [expandedContent, setExpandedContent] = useState(null);



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
            <Link to="/user-dashboard" className="link">
              <MdDashboard className="icon1" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/user-report" className="link">
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link to="/user-schedule" className="link">
              <FaRegCalendarAlt className="icon1" /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/user-edu" className="active link">
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

export default UserEdu;
