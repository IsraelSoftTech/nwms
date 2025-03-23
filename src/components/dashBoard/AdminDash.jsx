import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTruckPickup,
  FaEye,
  FaRegFileAlt,
} from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { getDatabase, ref, onValue } from "firebase/database";
import { MdClose } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./AdminDash.css";
import ws1 from "../../assets/ws1.jpeg";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import EduContent from "../EduContent/EduContent";
import Users from "../users/Users";

//import users
import firebaseApp from "../../firebaseConfig";


import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import CustomAreaChart from "../recharts/CustomAreaChart";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
//abreviate username text

const AdminDash = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewedReports, setViewedReports] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);

  const db = getDatabase(firebaseApp);

  useEffect(() => {
    // Fetch submitted reports
    const reportsRef = ref(db, "submittedReports/");
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reportsArray = Object.values(data);
        setSubmittedReports(reportsArray);
        setTotalReports(reportsArray.length);
        
        // Count pending and resolved reports
        const pending = reportsArray.filter(report => !viewedReports[report.id]).length;
        const resolved = reportsArray.filter(report => viewedReports[report.id]).length;
        
        setPendingReports(pending);
        setResolvedReports(resolved);
      } else {
        setSubmittedReports([]);
        setTotalReports(0);
        setPendingReports(0);
        setResolvedReports(0);
      }
    });

    // Fetch viewed reports
    const viewedRef = ref(db, "viewedReports/");
    onValue(viewedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setViewedReports(data);
        // Update counts when viewed reports change
        if (submittedReports.length > 0) {
          const pending = submittedReports.filter(report => !data[report.id]).length;
          const resolved = submittedReports.filter(report => data[report.id]).length;
          setPendingReports(pending);
          setResolvedReports(resolved);
        }
      }
    });

    // Listen for new notifications
    const notificationsRef = ref(db, "notifications/");
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(notificationsArray);
        
        // Show toast for new unread notifications
        notificationsArray.forEach(notification => {
          if (!notification.read) {
            toast.info(notification.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
      }
    });
  }, [db]);

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <Topbar />
        <ToastContainer />

        {showSuccess && (
          <div className="success-notification">
            Status Updated Successfully!
          </div>
        )}

        {showModal && selectedReport && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="review-modal">
              <button className="close-button" onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
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
                onClick={() => {
                  // Implement the logic to update the view status
                }}
              >
                Update View Status
              </button>
            </div>
          </div>
        )}

        <section className="stats-section">
          <div className="stat-card">
            <FaRegFileAlt className="icon2" />
            <div className="card-count">
              <p>Total Reports</p>
              <p>{totalReports}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <div className="card-count">
              <p>Pending Reports</p>
              <p>{pendingReports}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <div className="card-count">
              <p>Resolved Reports</p>
              <p>{resolvedReports}</p>
            </div>
          </div>
        </section>

        {/* Educational Content */}
        <section className="content-section">
          <EduContent />
          <div className="graph-box">
            <div className="graph-placeholder">
         <CustomAreaChart/>
            </div>
          </div>
        </section>

        {/* User and Dump Site */}

        <section className="user-illegal">
          <div className="newUser" style={{ overflowY: "hidden" }}>
            {" "}
            <Users />
          </div>

      
          {/* -------------------------------------------------------------------- */}
<div className="user-box-img">
     
           
     <div className="waste-img">
       <img src={ws1} alt=""/>
     </div>
     
     </div>
  
  
  

{/* --------------------------------------------------------------------------- */}
        
        </section>
      </main>
    </div>
  );
};

export default AdminDash;
