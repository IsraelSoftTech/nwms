import React, { useState } from 'react';
import "./UserDash.css";
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from 'react-router-dom';
import Profile from '../Profile/Profile'; // Import Profile component

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UserDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // State for the profile modal

  const graphData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Reports Submitted",
        data: [12, 19, 10, 15],
        backgroundColor: "#ff6600",
        borderRadius: 6,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <h1>Waste <span style={{color:"#ff6600"}}>Manager</span></h1>
        </div>
        {sidebarOpen && (
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        )}
        <ul className="menu">
          <li className="active">
            <Link to="/user-dash" className="link-no-style">
              <MdDashboard className="side-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/user-report" className="link-no-style">
              <FaRegFileAlt /> Reports
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
        <button className="logout" onClick={() => setShowProfileModal(true)}>
          <FiLogOut /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
                <p>20</p>
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
                <p>9 reports this week</p>
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
          <div className="analysis">
            <h3>Analysis</h3>
            <p>Report Submission</p>
            <Bar data={graphData} options={graphOptions} />
          </div>

          <div className="chat-box">
            <h3>My Chats</h3>
            <ul>
              <li>
                <img src="https://i.pravatar.cc/40?img=1" alt="Arlo" />
                <div>
                  <strong>Arlo Moore</strong>
                  <p>I want to rent a car...</p>
                </div>
                <span>07:05 PM</span>
              </li>
              <li>
                <img src="https://i.pravatar.cc/40?img=2" alt="Archie" />
                <div>
                  <strong>Archie Oscar</strong>
                  <p>I need a car...</p>
                </div>
                <span className="unread">06:05 PM</span>
              </li>
              <li>
                <img src="https://i.pravatar.cc/40?img=3" alt="George" />
                <div>
                  <strong>George Henry</strong>
                  <p>Hi, Good afternoon</p>
                </div>
                <span>04:26 PM</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {showProfileModal && <Profile onClose={() => setShowProfileModal(false)} />} {/* Modal Component */}
    </div>
  );
};

export default UserDash;