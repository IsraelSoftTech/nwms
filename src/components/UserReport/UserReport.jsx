import React, { useState, useEffect } from 'react';
import "./UserReport.css";
import {
  FaBars,
  FaBell,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaSearch,
  FaTrashAlt,
  FaGraduationCap,
  FaCommentAlt,
  FaTimes,
  FaShuttleVan,
} from "react-icons/fa";
import { MdAutoGraph, MdDashboard, MdReportProblem } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Profile from '../Profile/Profile';
import { database, ref, set, get, child } from '../../firebase'; // Import Firebase functions

const UserReport = () => {
  const [wasteType, setWasteType] = useState('');
  const [location, setLocation] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [date, setDate] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [submittedReportsCount, setSubmittedReportsCount] = useState(0);
  const [weeklyReportsCount, setWeeklyReportsCount] = useState(0);

  const fetchCounts = async () => {
    const userId = user; // Assuming user is the unique identifier for the logged-in user
    const reportsRef = ref(database, 'reports/');

    try {
      const snapshot = await get(child(reportsRef, userId));
      if (snapshot.exists()) {
        const reports = snapshot.val();
        const reportEntries = Object.values(reports);
        
        setSubmittedReportsCount(reportEntries.length);

        // Count reports submitted in the current week
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const weeklyCount = reportEntries.filter(report => new Date(report.date) >= firstDayOfWeek).length;

        setWeeklyReportsCount(weeklyCount);
      }
    } catch (error) {
      console.error("Error fetching report counts: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedGoogleLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    setGoogleLink(generatedGoogleLink);

    const reportData = {
      wasteType,
      location,
      googleLink: generatedGoogleLink,
      date,
      user,
      image: image ? URL.createObjectURL(image) : null,
    };

    try {
      await set(ref(database, 'reports/' + user + '/' + Date.now()), reportData); // Save report under user ID
      setMessage("Report Submitted successfully");
      fetchCounts(); // Refresh counts
      setWasteType('');
      setLocation('');
      setGoogleLink('');
      setDate('');
      setUser('');
      setImage(null);
    } catch (error) {
      console.error("Error saving report: ", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImage(file);
    } else {
      alert('Please select an image file smaller than 5MB.');
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h1>Waste <span style={{ color: "#ff6600" }}>Manager</span></h1>
        </div>
        <button className="close-sidebar">
          <FaTimes />
        </button>
        <ul className="menu">
          <li>
            <Link to="/user-dash" className="link-no-style">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li className="active">
            <Link to="/user-report" className="link-no-style">
              <FaRegFileAlt className="side-icon" /> Reports
            </Link>
          </li>
          <li>
            <Link to="/user-schedule" className="link-no-style">
              <FaRegCalendarAlt /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/user-illegal" className="link-no-style">
              <MdReportProblem /> Illegal Dumps
            </Link>
          </li>
          <li>
            <Link to="/user-education" className="link-no-style">
              <FaGraduationCap /> Education
            </Link>
          </li>
          <li>
            <Link to="/user-chat" className="link-no-style">
              <FaCommentAlt /> Chat
            </Link>
          </li>
        </ul>
        <button className="logout">
          <FiLogOut /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle">
            <FaBars />
          </button>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Place a search" />
          </div>

          <div className="topbar-icons">
            <div className="notif">
              <FaBell />
              <span className="notif-count">1</span>
            </div>
            <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
            <button className="ad-btn" onClick={() => setShowProfileModal(true)}>Us</button>
          </div>
        </header>

        {/* Top Cards */}
        <section className="cards-row">
          <div className="card blue">
            <div className="card-title">
              <FaRegFileAlt className="card-icon" />
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>My Submitted Reports</h4>
                <p>{submittedReportsCount}</p>
              </div>
            </div>
            <div className="sub-cards">
              <div className="sub-card">
                <FaTrashAlt className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>10</h1>
                  <p>Pending Reports</p>
                </div>
              </div>
              <div className="sub-card">
                <FaShuttleVan className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>11</h1>
                  <p>Pending Pickups</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card blue">
            <div className="card-title">
              <MdAutoGraph className="card-icon" />
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>My Analysis</h4>
                <p>{weeklyReportsCount} reports this week</p>
              </div>
            </div>
            <div className="sub-cards">
              <div className="sub-card">
                <MdAutoGraph className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>18</h1>
                  <p>6 successful pickups</p>
                </div>
              </div>
              <div className="sub-card">
                <FaShuttleVan className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>5</h1>
                  <p>Missed Pickups</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card blue">
            <div className="card-title">
              <FaRegCalendarAlt className="card-icon" />
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Schedules</h4>
                <p>12</p>
              </div>
            </div>
            <div className="sub-cards">
              <div className="sub-card">
                <FaRegCalendarAlt className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>1</h1>
                  <p>Resolved Sched...</p>
                </div>
              </div>
              <div className="sub-card">
                <MdReportProblem className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>0</h1>
                  <p>Unresolved Sched...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="bottom-section">
          <div className="chat-box">
            <h3>Report Submission Form</h3>
            <div className="form-container">
              <h2>Report a waste</h2>
              <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-left">
                  <div className="form-group">
                    <label>Waste Type</label>
                    <select className="form-input" value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
                      <option value="" disabled>Select waste type</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Metallic">Metallic</option>
                      <option value="Glass">Glass</option>
                      <option value="Toxic">Toxic</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      placeholder="Enter Location"
                      className="form-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location Google Link</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={googleLink}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload Image</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="form-input"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="form-right">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>User</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                    />
                  </div>
                  <button className="submit-button">Submit Waste Report</button>
                </div>
              </form>
              {message && <div className="success-message">{message}</div>}
            </div>
          </div>
        </section>
      </main>

      {showProfileModal && <Profile onClose={() => setShowProfileModal(false)} />}
    </div>
  );
};

export default UserReport;