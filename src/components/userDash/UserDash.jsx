import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaTrash, FaCheckCircle, FaTruckPickup } from "react-icons/fa";
import { getDatabase, ref, onValue } from "firebase/database";

import ws1 from "../../assets/ws1.jpeg"
import ws2 from "../../assets/ws2.jpg"

import "./UserDash.css";

// Import necessary components

import Topbar from "../Topbar/Topbar";
import UserSidebar from "../UserSidebar/UserSidebar";

const UserDash = () => {
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [completedReports, setCompletedReports] = useState(0);
  const db = getDatabase();

  useEffect(() => {
    // Get current user from session storage
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) return;

    // Fetch reports for the current user
    const reportsRef = ref(db, "submittedReports/");
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter reports for current user
        const userReports = Object.values(data).filter(
          (report) => report.user === currentUser.username
        );
        
        // Set total reports
        setTotalReports(userReports.length);
        
        // Count pending and completed reports
        const pending = userReports.filter(report => !report.status || report.status === 'pending').length;
        const completed = userReports.filter(report => report.status === 'resolved').length;
        
        setPendingReports(pending);
        setCompletedReports(completed);
      } else {
        setTotalReports(0);
        setPendingReports(0);
        setCompletedReports(0);
      }
    });
  }, [db]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
    <UserSidebar/>

      {/* Main Content */}
      <main className="main-content">
       <Topbar/>

        <section className="stats-section">
          <div className="stat-card">
            <FaRegFileAlt className="icon2" />
            <div className="card-count">
            <p>Total Reports</p>
            <p>{totalReports}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2"  />
            <div className="card-count">
            <p>Pending Pick-ups</p>
            <p>{pendingReports}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <div className="card-count">
            <p>Completed Pick-ups</p>
            <p>{completedReports}</p>
            </div>
          </div>
        </section>

        {/* Reports of submission */}
        <section className="user-illegal">
          <div className="user-box" style={{ display: "grid", gap: "4px" }}>
            <h3>Recent Reports</h3>
            <ul>
              <div className="recent-reports">
                <div className="left-recent">
                  <FaTrash className="left-recent-icon" />
                  <div className="left-recent-text">
                    <p>Pastic Waste</p>
                    <p className="location-text">Mile 4</p>
                  </div>
                </div>
                <p className="recent-report-pending">pending</p>
              </div>
            </ul>

            <ul>
              <div className="recent-reports">
                <div className="left-recent">
                  <FaTrash className="left-recent-icon" />
                  <div className="left-recent-text">
                    <p>Electronic Waste</p>
                    <p className="location-text">City Chemist</p>
                  </div>
                </div>
                <p className="recent-report-progress">in progress</p>
              </div>
            </ul>
            <ul>
              <div className="recent-reports">
                <div className="left-recent">
                  <FaTrash className="left-recent-icon" />
                  <div className="left-recent-text">
                    <p>Pastic Waste</p>
                    <p className="location-text">Mile 4</p>
                  </div>
                </div>
                <p className="recent-report-pending">pending</p>
              </div>
            </ul>
          </div>
          {/* ------------------------------------------ */}
          <div className="user-box" style={{ display: "grid", gap: "4px" }}>
            <h3>Up Coming Pick-ups </h3>
            <ul>
              <div className="upcoming-pickup">
                <div className="right-upcoming">
                  <FaTruckPickup className="right-upcoming-icon" />
                  <div className="right-upcoming-text">
                    <p>General Wastes</p>
                    <p className="time-text">12/09/2025</p>
                  </div>
                </div>
                <p className="upcoming-report-schedule">scheduled</p>
              </div>
            </ul>
            <ul>
              <div className="upcoming-pickup">
                <div className="right-upcoming">
                  <FaTruckPickup className="right-upcoming-icon" />
                  <div className="right-upcoming-text">
                    <p>Recyclable wastes</p>
                    <p className="time-text">13/09/2025</p>
                  </div>
                </div>
                <p className="upcoming-report-not-scheduled">not scheduled</p>
              </div>
            </ul>
          </div>
{/* -------------------------------------------------------------------- */}
<div className="user-box-img">
     
           
          <div className="waste-img">
            <img src={ws1} alt=""/>
          </div>
          
          </div>
          {/* ------------------------------------------ */}
          <div className="user-box-img">
      
           
          <div className="waste-img">
            <img src={ws2} alt=""/>
          </div>
          
          </div>
          {/* ------------------------------------------ */}

{/* --------------------------------------------------------------------------- */}
        </section>
      </main>

    
     
      
    </div>
  );
};

export default UserDash;
