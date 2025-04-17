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
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { MdAutoGraph, MdDashboard, MdReportProblem } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Profile from '../Profile/Profile';
import { database, ref, get, remove, set } from '../../firebase';

const AdminReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch reports from Firebase with nested structure
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = ref(database, 'reports');
        const snapshot = await get(reportsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const reportsArray = [];
          
          // Iterate through each user's reports
          Object.entries(data).forEach(([userId, userReports]) => {
            Object.entries(userReports).forEach(([reportId, report]) => {
              reportsArray.push({
                id: reportId,
                userId: userId,
                ...report
              });
            });
          });
          
          setReports(reportsArray);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDeleteReport = async (reportId, userId) => {
    if (window.confirm('Do you want to delete report?')) {
      try {
        await remove(ref(database, `reports/${userId}/${reportId}`));
        setReports(reports.filter(report => report.id !== reportId));
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleAssignReport = async (reportId, userId) => {
    try {
      // Update the report status in the database
      await set(ref(database, `reports/${userId}/${reportId}/status`), 'validated');
      // Update local state
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: 'validated' } : report
      ));
      setShowReportModal(false);
      alert('Pick Up Scheduled');
    } catch (error) {
      console.error('Error assigning report:', error);
    }
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
            <input type="text" placeholder="Search reports..." />
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
                <p>{reports.length}</p>
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
                <p>{reports.filter(r => r.status === 'validated').length}</p>
              </div>
            </div>
            <div className="sub-cards">
              <div className="sub-card">
                <FaRegCalendarAlt className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'validated').length}</h1>
                  <p>Resolved Sched...</p>
                </div>
              </div>
              <div className="sub-card">
                <MdReportProblem className="sub-card-icon" />
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'pending').length}</h1>
                  <p>Unresolved Sched...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="bottom-section">
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
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">No reports found</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.wasteType}</td>
                      <td>{report.location}</td>
                      <td>
                        <a 
                          href={report.googleLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="google-link"
                        >
                          View Location
                        </a>
                      </td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{report.user}</td>
                      <td>
                        <div className="action-buttons">
                          {report.status === 'validated' ? (
                            <FaCheckCircle className="validated-icon" />
                          ) : (
                            <FaEye 
                              className="view-icon" 
                              onClick={() => handleViewReport(report)}
                            />
                          )}
                          <FaTrash 
                            className="delete-icon" 
                            onClick={() => handleDeleteReport(report.id, report.userId)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h2>Report Details</h2>
              <button className="close-modal" onClick={() => setShowReportModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="report-details">
                <div className="detail-row">
                  <span className="detail-label">Waste Type:</span>
                  <span className="detail-value">{selectedReport.wasteType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{selectedReport.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(selectedReport.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">User:</span>
                  <span className="detail-value">{selectedReport.user}</span>
                </div>
                {selectedReport.imageURL && (
                  <div className="detail-row">
                    <span className="detail-label">Image:</span>
                    <div className="image-container">
                      <img 
                        src={selectedReport.imageURL} 
                        alt="Report" 
                        className="report-image"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="assign-button"
                onClick={() => handleAssignReport(selectedReport.id, selectedReport.userId)}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && <Profile onClose={() => setShowProfileModal(false)} />}
    </div>
  );
};

export default AdminReport; 