import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTruckPickup,
  FaEye,
} from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { getDatabase, ref, onValue, set } from "firebase/database";

import "./AdminReport.css";

// Import necessary components
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const AdminReport = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewedReports, setViewedReports] = useState({});

  const db = getDatabase();

  useEffect(() => {
    // Fetch submitted reports
    const reportsRef = ref(db, "submittedReports/");
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedReports(Object.values(data));
      } else {
        setSubmittedReports([]);
      }
    });

    // Fetch viewed reports
    const viewedRef = ref(db, "viewedReports/");
    onValue(viewedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setViewedReports(data);
      }
    });
  }, [db]);

  const handleView = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    if (e.target.className === 'modal-overlay') {
      setShowModal(false);
      setSelectedReport(null);
    }
  };

  const handleUpdateViewStatus = async () => {
    try {
      // Save to viewedReports in database
      await set(ref(db, `viewedReports/${selectedReport.id}`), {
        reportId: selectedReport.id,
        viewedAt: new Date().toISOString(),
      });

      // Show success message
      setShowSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSelectedReport(null);
        
        // Hide success message with animation
        setTimeout(() => {
          setShowSuccess(false);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Error updating view status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <Topbar />

        {/* Success Message */}
        {showSuccess && (
          <div className="success-notification">
            Status Updated Successfully!
          </div>
        )}

        {/* View Modal */}
        {showModal && selectedReport && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="review-modal">
              <h2>Review Report</h2>
              <div className="report-content">
                <div className="report-image">
                  {selectedReport.image ? (
                    <img 
                      src={selectedReport.image} 
                      alt="Report" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="no-image">No image available</div>
                  )}
                </div>
                <div className="report-details">
                  <div className="detail-row">
                    <span>ID</span>
                    <span>{selectedReport.id}</span>
                  </div>
                  <div className="detail-row">
                    <span>Location</span>
                    <span>
                      <a 
                        href={selectedReport.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedReport.location}
                      </a>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Date</span>
                    <span>{selectedReport.date}</span>
                  </div>
                  <div className="detail-row">
                    <span>Type</span>
                    <span>{selectedReport.type}</span>
                  </div>
                  <div className="detail-row">
                    <span>Description</span>
                    <span>{selectedReport.description}</span>
                  </div>
                  <div className="detail-row">
                    <span>User</span>
                    <span>{selectedReport.user}</span>
                  </div>
                </div>
              </div>
              <button 
                className="update-status-btn"
                onClick={handleUpdateViewStatus}
              >
                Update View Status
              </button>
            </div>
          </div>
        )}

        <section className="stats-section">
          <div className="stat-card">
            <BsExclamationTriangle className="icon2" />
            <div className="card-count">
            <p>Illegal Dumpsites</p>
            <p>21</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <div className="card-count">
            <p>Missed Reports</p>
            <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTrash className="icon2" />
            <div className="card-count">
            <p>Overflowing Dumpsites</p>
            <p>10</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTimesCircle className="icon2" />
            <div className="card-count">
            <p>Unresolved Reports</p>
            <p>10</p>
            </div>
          </div>
          <div className="stat-card">
            <FaSpinner className="icon2" />
            <div className="card-count">
            <p>In-Progress Reports</p>
            <p>10</p>
            </div>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <div className="card-count">
            <p>Resolved Reports</p>
            <p>10</p>
            </div>
          </div>
        </section>

        {/* Reports of submission */}
        <section className="user-illegal-report">
          <div className="user-box" style={{ height: "350px" }}>
            <h3 style={{ alignItems: "center", display: "flex", gap: "15px" }}>
              Summary of Submitted Reports
            </h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submittedReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.user}</td>
                    <td>{report.type}</td>
                    <td>
                      <a 
                        href={report.googleMapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#0066cc', textDecoration: 'underline' }}
                      >
                        {report.location}
                      </a>
                    </td>
                    <td style={{
                      background: viewedReports[report.id] ? "green" : "transparent",
                      color: viewedReports[report.id] ? "white" : "inherit"
                    }}>
                      {viewedReports[report.id] ? "Viewed" : "No action"}
                    </td>
                    <td>{report.date}</td>
                    <td>
                      <div className="editDel">
                        <FaEye
                          className="view-icon"
                          style={{
                            color: "#0066cc",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleView(report)}
                        />
                        <FaSpinner className="edit-icon" />
                        <FiTrash2 className="delete-icon" />
                      </div>
                    </td>
                  </tr>
                ))}
                {submittedReports.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No Reports Submitted
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminReport;