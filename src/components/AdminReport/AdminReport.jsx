import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import './AdminReport.css'; // Import CSS for styling the component
import {
  FaBars, // Import icons from react-icons
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

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"; // Import Chart.js modules
import logo from "../../assets/logo.png"; // Import logo image
import { Link } from 'react-router-dom'; // Import Link for navigation
import { database, ref, get } from "../../firebase"; // Import Firebase database functions
import Profile from '../Profile/Profile'; // Import Profile component

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminReport = () => {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false); // Control sidebar visibility
  const [reports, setReports] = useState([]); // Store reports data
  const [reportCount, setReportCount] = useState(0); // Count of reports
  const [error, setError] = useState(null); // Store error messages
  const [loading, setLoading] = useState(false); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Store search query
  const [selectedReport, setSelectedReport] = useState(null); // Store selected report details
  const [showProfileModal, setShowProfileModal] = useState(false); // Control profile modal visibility

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => { // Function to fetch reports from Firebase
    try {
      setLoading(true); // Set loading state to true
      const reportsRef = ref(database, 'reports'); // Reference to reports in Firebase
      const snapshot = await get(reportsRef); // Get reports snapshot

      if (snapshot.exists()) { // Check if reports exist
        const data = snapshot.val(); // Get the data
        const reportArray = Object.entries(data).map(([id, report]) => ({ id, ...report })); // Convert to array with IDs
        setReports(reportArray.sort((a, b) => b.timestamp - a.timestamp)); // Sort reports by timestamp
        setReportCount(reportArray.length); // Update report count
      } else {
        setReports([]); // No reports found
        setReportCount(0); // Reset report count
      }
    } catch (error) {
      console.error('Error fetching reports:', error); // Log error
      setError('Failed to load reports. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleReportClick = (report) => { // Function to handle report click
    setSelectedReport(report); // Set selected report
  };

  const closeReport = () => { // Function to close report details
    setSelectedReport(null); // Reset selected report
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(report => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data for the bar chart
  const graphData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Reports Submitted",
        data: [12, 19, 10, 15], // Sample data for reports
        backgroundColor: "#ff6600", // Bar color
        borderRadius: 6, // Rounded corners
      },
    ],
  };

  // Options for the bar chart
  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top", // Legend position
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Y-axis starts at zero
      },
    },
  };

  return (
    <div className="admin-container"> {/* Main container for admin report */}
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}> {/* Sidebar component */}
        <div className="logo"> {/* Logo area */}
          <h1>Waste <span style={{ color: "#ff6600" }}>Manager</span></h1> {/* Logo title */}
        </div>
        {sidebarOpen && ( // Close button when sidebar is open
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes /> {/* Close icon */}
          </button>
        )}
        <ul className="menu"> {/* Navigation menu */}
          <li>
            <Link to="/admin-dash" className="link-no-style"> {/* Dashboard link */}
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li className="active"> {/* Active link for reports */}
            <Link to="/admin-report" className="link-no-style">
              <FaRegFileAlt className="side-icon" /> Reports
            </Link>
          </li>
          <li>
            <Link to="/admin-schedule" className="link-no-style"> {/* Schedule link */}
              <FaRegCalendarAlt /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/admin-illegal" className="link-no-style"> {/* Illegal dumps link */}
              <MdReportProblem /> Illegal Dumps
            </Link>
          </li>
          <li>
            <Link to="/admin-education" className="link-no-style"> {/* Education link */}
              <FaGraduationCap /> Education
            </Link>
          </li>
          <li>
            <Link to="/admin-chat" className="link-no-style"> {/* Chat link */}
              <FaCommentAlt /> Chat
            </Link>
          </li>
        </ul>
        <button className="logout" onClick={() => setShowProfileModal(true)}> {/* Logout button */}
          <FiLogOut /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content"> {/* Main content area */}
        <header className="topbar"> {/* Top bar with search and icons */}
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}> {/* Sidebar toggle */}
            <FaBars /> {/* Menu icon */}
          </button>

          <div className="search-box"> {/* Search input */}
            <FaSearch className="search-icon" /> {/* Search icon */}
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery} // Controlled input for search
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
            />
          </div>

          <div className="topbar-icons"> {/* Notification and profile icons */}
            <div className="notif"> {/* Notification area */}
              <FaBell /> {/* Bell icon */}
              <span className="notif-count">1</span> {/* Notification count */}
            </div>
            <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" /> {/* User profile picture */}
            <button className="ad-btn" onClick={() => setShowProfileModal(true)}>Ad</button> {/* Ad button */}
          </div>
        </header>

        {/* Top Cards */}
        <section className="cards-row"> {/* Row for displaying summary cards */}
          <div className="card blue"> {/* Card for report summary */}
            <div className="card-title"> {/* Card title area */}
              <FaRegFileAlt className="card-icon" /> {/* Card icon */}
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Reports</h4> {/* Reports title */}
                <p>{reportCount}</p> {/* Total report count */}
              </div>
            </div>
            <div className="sub-cards"> {/* Sub-cards for detailed counts */}
              <div className="sub-card"> {/* Sub-card for pending reports */}
                <FaTrashAlt className="sub-card-icon" /> {/* Icon for pending reports */}
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'pending').length}</h1> {/* Count of pending reports */}
                  <p>Pending Reports</p> {/* Label for pending reports */}
                </div>
              </div>
              <div className="sub-card"> {/* Sub-card for in-progress reports */}
                <FaShuttleVan className="sub-card-icon" /> {/* Icon for in-progress reports */}
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'in-progress').length}</h1> {/* Count of in-progress reports */}
                  <p>In Progress</p> {/* Label for in-progress reports */}
                </div>
              </div>
            </div>
          </div>

          <div className="card blue"> {/* Card for analysis summary */}
            <div className="card-title"> {/* Card title area */}
              <MdAutoGraph className="card-icon" /> {/* Card icon */}
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Analysis</h4> {/* Analysis title */}
                <p>{reports.filter(r => r.status === 'resolved').length} resolved this week</p> {/* Resolved reports count */}
              </div>
            </div>

            <div className="sub-cards"> {/* Sub-cards for detailed counts */}
              <div className="sub-card"> {/* Sub-card for resolved reports */}
                <MdAutoGraph className="sub-card-icon" /> {/* Icon for resolved reports */}
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'resolved').length}</h1> {/* Count of resolved reports */}
                  <p>Resolved Reports</p> {/* Label for resolved reports */}
                </div>
              </div>
              <div className="sub-card"> {/* Sub-card for in-progress reports */}
                <FaShuttleVan className="sub-card-icon" /> {/* Icon for in-progress reports */}
                <div className="sub-card-tools">
                  <h1>{reports.filter(r => r.status === 'in-progress').length}</h1> {/* Count of in-progress reports */}
                  <p>In Progress</p> {/* Label for in-progress reports */}
                </div>
              </div>
            </div>
          </div>

          <div className="card blue"> {/* Card for schedules summary */}
            <div className="card-title"> {/* Card title area */}
              <FaRegCalendarAlt className="card-icon" /> {/* Card icon */}
              <div className="title-tools" style={{ display: "grid" }}>
                <h4>Schedules</h4> {/* Schedules title */}
                <p>12</p> {/* Sample schedule count */}
              </div>
            </div>
            <div className="sub-cards"> {/* Sub-cards for detailed counts */}
              <div className="sub-card"> {/* Sub-card for resolved schedules */}
                <FaRegCalendarAlt className="sub-card-icon" /> {/* Icon for resolved schedules */}
                <div className="sub-card-tools">
                  <h1>1</h1> {/* Count of resolved schedules */}
                  <p>Resolved Sched...</p> {/* Label for resolved schedules */}
                </div>
              </div>
              <div className="sub-card"> {/* Sub-card for unresolved schedules */}
                <MdReportProblem className="sub-card-icon" /> {/* Icon for unresolved schedules */}
                <div className="sub-card-tools">
                  <h1>0</h1> {/* Count of unresolved schedules */}
                  <p>Unresolved Sched...</p> {/* Label for unresolved schedules */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="bottom-section"> {/* Section for reports table */}
          {/* Reports Table */}
          <div className="reports-table-container"> {/* Container for reports table */}
            <table className="reports-table"> {/* Table for displaying reports */}
              <thead>
                <tr>
                  <th>Waste Type</th> {/* Column for waste type */}
                  <th>Location</th> {/* Column for location */}
                  <th>Google Link</th> {/* Column for Google link */}
                  <th>Date</th> {/* Column for date */}
                  <th>User</th> {/* Column for user */}
                  <th>Actions</th> {/* Column for action buttons */}
                </tr>
              </thead>
              <tbody>
                {loading ? ( // Check if loading
                  <tr>
                    <td colSpan="6" className="loading-cell">Loading reports...</td> {/* Loading message */}
                  </tr>
                ) : filteredReports.length === 0 ? ( // Check if no reports found
                  <tr>
                    <td colSpan="6" className="empty-cell">No reports found</td> {/* No reports message */}
                  </tr>
                ) : (
                  filteredReports.map((report) => ( // Map over filtered reports to display them
                    <tr key={report.id} onClick={() => handleReportClick(report)}> {/* Row for each report */}
                      <td>{report.title}</td> {/* Display report title */}
                      <td>{report.description}</td> {/* Display report description */}
                      <td>{report.location}</td> {/* Display report location */}
                      <td>
                        <span className={`status-badge ${report.status?.toLowerCase()}`}>
                          {report.status} {/* Display report status with badge */}
                        </span>
                      </td>
                      <td>{new Date(report.timestamp).toLocaleDateString()}</td> {/* Display report date */}
                      <td>
                        <div className="action-buttons"> {/* Action buttons for edit/delete */}
                          <button className="edit-btn"> {/* Edit button */}
                            <FaEdit /> {/* Edit icon */}
                          </button>
                          <button className="delete-btn"> {/* Delete button */}
                            <FaTrash /> {/* Delete icon */}
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
          {selectedReport && ( // Check if a report is selected
            <div className="report-display"> {/* Container for selected report details */}
              <div className="selected-report"> {/* Display selected report */}
                <div className="report-header"> {/* Header for report details */}
                  <h2>{selectedReport.title}</h2> {/* Display report title */}
                  <button onClick={closeReport} className="close-btn">×</button> {/* Close button */}
                </div>
                <div className="report-body"> {/* Body for report details */}
                  <div className="report-info"> {/* Info area for report details */}
                    <p><strong>Description:</strong> {selectedReport.description}</p> {/* Display report description */}
                    <p><strong>Location:</strong> {selectedReport.location}</p> {/* Display report location */}
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${selectedReport.status?.toLowerCase()}`}>
                        {selectedReport.status} {/* Display report status with badge */}
                      </span>
                    </p>
                    <p><strong>Date:</strong> {new Date(selectedReport.timestamp).toLocaleDateString()}</p> {/* Display report date */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {showProfileModal && <Profile onClose={() => setShowProfileModal(false)} />} {/* Render Profile modal if open */}
    </div>
  );
};

export default AdminReport; // Export the AdminReport component