import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaUserAlt, FaBell, FaTrash, FaCheckCircle, FaTimesCircle, FaSpinner, FaTruckPickup } from "react-icons/fa";
import { MdMenu, MdSearch } from "react-icons/md";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { FaRegCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./AdminReport.css";

// Import necessary components
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

// Firebase URLs

const reportsUrl = "https://register-d6145-default-rtdb.firebaseio.com/submitReport.json";
const viewedReportsUrl = "https://register-d6145-default-rtdb.firebaseio.com/viewedReports.json";


const AdminReport = () => {
  //sidebar, profile setting
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [reports, setReports] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearchClick = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const openEditProfile = () => {
    setIsEditProfileOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const closeEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  useEffect(() => {

//fetch reports
    const fetchReports = async () => {
      try {
        const response = await fetch(reportsUrl);
        const data = await response.json();
        if (data) {
          const reportsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            status: "No action", // Default status
            ...value,
          }));
          setReports(reportsArray);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };


    fetchReports();
  }, []);

  //status tick,edit
  const handleStatusChange = async (id, action) => {
    let newStatus = "";
    if (action === "tick") {
      const currentReport = reports.find((report) => report.id === id);
      newStatus = currentReport.status === "Resolved" ? "No action" : "Resolved";
    } else if (action === "edit") {
      const currentReport = reports.find((report) => report.id === id);
      newStatus = currentReport.status === "In Progress" ? "No action" : "In Progress";
    }

    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id
          ? { ...report, status: newStatus }
          : report
      )
    );

    // Update or delete in Firebase
    if (newStatus === "Resolved" || newStatus === "In Progress") {
      await fetch(viewedReportsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } else {
      // Delete from viewedReports if status is "No action"
      const existingStatusResponse = await fetch(`${viewedReportsUrl}.json`);
      const existingStatusData = await existingStatusResponse.json();
      const statusId = Object.keys(existingStatusData).find(key => existingStatusData[key].status === (newStatus === "Resolved" ? "Resolved" : "In Progress"));
      if (statusId) {
        await fetch(`${viewedReportsUrl}/${statusId}.json`, {
          method: "DELETE",
        });
      }
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const confirmDeleteReport = async () => {
    const id = confirmDelete.id;
    if (!id) return;

    try {
        // Check if the report exists before deletion
        const reportResponse = await fetch(`${reportsUrl}/${id}.json`);
        const reportData = await reportResponse.json();

        if (reportData) {
            // Proceed with deletion
            await fetch(`${reportsUrl}/${id}.json`, {
                method: "DELETE",
            });

            // Update local state
            setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        } else {
            console.error("Report not found or already deleted.");
        }
    } catch (error) {
        console.error("Error deleting report:", error);
    }
    
    // Reset confirmation state
    setConfirmDelete({ show: false, id: null });
};

  const cancelDelete = () => {
    setConfirmDelete({ show: false, id: null });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="logo">
          <span className="logo-icon"><img src={logo} alt="" /></span>
        </div>
        <ul className={`nav-links ${isSidebarOpen ? "active" : ""}`}>
          <li>
            <Link to="/admin-dashboard" className="link">
              <MdDashboard className="icon1" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/report" className="active link">
              <FaRegFileAlt className="icon1" /> Report
            </Link>
          </li>
          <li>
            <Link to="/schedule" className="link">
              <FaRegCalendarAlt className="icon1" /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/education" className="link">
              <FaGraduationCap className="icon1" /> Education
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2>WASTE MANAGEMENT APPLICATION</h2>
          <MdMenu className="menu-icon" onClick={handleMenuClick} />
          <div className={`search-box-mobile ${isSearchVisible ? "active" : ""}`}>
            <MdSearch className="search-icon-mobile" onClick={handleSearchClick} />
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
              <div className="text-profile" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                <FaUserAlt className="profile-icon" onClick={toggleProfileDropdown} />
                <p style={{ textAlign: "center", fontSize: "14px", color: "black" }}>admin</p>
              </div>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <p onClick={openEditProfile}>Edit Profile</p>
                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Confirmation Delete Modal */}
        {confirmDelete.show && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Do you want to delete?</h3>
              <button onClick={confirmDeleteReport}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{ color: "black" }}>Edit Profile</h3>
              <label style={{ color: "black" }}>Username:</label>
              <input type="text" value="admin_account" readOnly style={{ color: "black" }} />
              <label style={{ color: "black" }}>Password:</label>
              <input type="text" value="admin_password" readOnly style={{ color: "black" }} />
              <button className="close-btn" onClick={closeEditProfile} style={{ color: "black" }}>
                Close
              </button>
            </div>
          </div>
        )}

        <section className="stats-section">
          <div className="stat-card">
            <BsExclamationTriangle className="icon2" />
            <h3>Illegal Dumpsites</h3>
            <p>21</p>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <h3>Missed Reports</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FaTrash className="icon2" />
            <h3>Overflowing Dumpsites</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaTimesCircle className="icon2" />
            <h3>Unresolved Reports</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaSpinner className="icon2" />
            <h3>In-Progress Reports</h3>
            <p>10</p>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <h3>Resolved Reports</h3>
            <p>10</p>
          </div>
        </section>

        {/* Reports of submission */}
        <section className="user-illegal-report">
          <div className="user-box" style={{ height: "350px" }}>
            <h3 style={{ alignItems: "center", display: "flex", gap: "15px" }}>Summary of Submitted Reports</h3>
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
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.user}</td>
                    <td>{report.type}</td>
                    <td>{report.location}</td>
                    <td style={{ background: report.status === "No action" ? "brown" : report.status === "Resolved" ? "#23AE60" : "#FFA500", padding: "2px", borderRadius: "3px", color: "white" }}>
                      {report.status}
                    </td>
                    <td>{report.date}</td>
                    <td>
                      <div className="editDel">
                        <FaCheckCircle
                          className="resolve-icon"
                          style={{ color: "#23AE60", fontSize: "18px", cursor: "pointer" }}
                          onClick={() => handleStatusChange(report.id, "tick")}
                        />
                        <FaSpinner
                          className="edit-icon"
                          onClick={() => handleStatusChange(report.id, "edit")}
                        />
                        <FiTrash2
                          className="delete-icon"
                          onClick={() => handleDelete(report.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminReport;