import React, { useState, useEffect } from 'react';
import './AdminReport.css';
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
  FaEdit,
  FaTrash,
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
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import { database, ref, get } from "../../firebase";
import Profile from '../Profile/Profile'; // Import Profile component

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false); // State for the profile modal

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsRef = ref(database, 'reports');
      const snapshot = await get(reportsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reportArray = Object.entries(data).map(([id, report]) => ({ id, ...report }));
        setReports(reportArray.sort((a, b) => b.timestamp - a.timestamp));
        setReportCount(reportArray.length);
      } else {
        setReports([]);
        setReportCount(0);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  const filteredReports = reports.filter(report => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1>Waste <span style={{ color: "#ff6600" }}>Manager</span></h1>
        </div>
        {sidebarOpen && (
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        )}
        <ul className="menu">
          <li>
            <Link to="/admin-dash" className="link-no-style">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li className="active">
            <Link to="/admin-report" className="link-no-style">
              <FaRegFileAlt className="side-icon" /> Reports
            </Link>
          </li>
          <li>
            <Link to="/admin-schedule" className="link-no-style">
              <FaRegCalendarAlt /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/admin-illegal" className="link-no-style">
              <MdReportProblem /> Illegal Dumps
            </Link>
          </li>
          <li>
            <Link to="/admin-education" className="link-no-style">
              <FaGraduationCap /> Education
            </Link>
          </li>
          <li>
            <Link to="/admin-chat" className="link-no-style">
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
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-icons">
            <div className="notif">
              <FaBell />
              <span className="notif-count">1</span>
            </div>
            <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
            <button className="ad-btn" onClick={() => setShowProfileModal(true)}>Ad</button>
          </div>
        </header>

        {/* Top Cards */}
        <section className="cards-row">
          <div className="card blue">
            <div className="card-title">
              <FaRegFileAlt className="card-icon" />
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Reports</h4>
                <p>{reportCount}</p>
              </div>
            </div>
            <div className="sub-cards">
              <div className="sub-card">
                <FaTrashAlt className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'pending').length}</h1>
                  <p>Pending Reports</p>
                </div>
              </div>
              <div className="sub-card">
                <FaShuttleVan className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'in-progress').length}</h1>
                  <p>In Progress</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card blue">
            <div className="card-title">
              <MdAutoGraph className="card-icon" />
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Analysis</h4>
                <p>{reports.filter(r => r.status === 'resolved').length} resolved this week</p>
              </div>
            </div>

            <div className="sub-cards">
              <div className="sub-card">
                <MdAutoGraph className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'resolved').length}</h1>
                  <p>Resolved Reports</p>
                </div>
              </div>
              <div className="sub-card">
                <FaShuttleVan className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'in-progress').length}</h1>
                  <p>In Progress</p>
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
          {/* Reports Table */}
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Waste Type</th>
                  <th>Location</th>
                  <th>Google Link</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">Loading reports...</td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">No reports found</td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} onClick={() => handleReportClick(report)}>
                      <td>{report.title}</td>
                      <td>{report.description}</td>
                      <td>{report.location}</td>
                      <td>
                        <span className={`status-badge ${report.status?.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{new Date(report.timestamp).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn">
                            <FaEdit />
                          </button>
                          <button className="delete-btn">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Report Details Display */}
          {selectedReport && (
            <div className="report-display">
              <div className="selected-report">
                <div className="report-header">
                  <h2>{selectedReport.title}</h2>
                  <button onClick={closeReport} className="close-btn">×</button>
                </div>
                <div className="report-body">
                  <div className="report-info">
                    <p><strong>Description:</strong> {selectedReport.description}</p>
                    <p><strong>Location:</strong> {selectedReport.location}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${selectedReport.status?.toLowerCase()}`}>
                        {selectedReport.status}
                      </span>
                    </p>
                    <p><strong>Date:</strong> {new Date(selectedReport.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {showProfileModal && <Profile onClose={() => setShowProfileModal(false)} />} {/* Modal Component */}
    </div>
  );
};

export default AdminReport;