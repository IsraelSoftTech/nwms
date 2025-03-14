import React from "react";
import { FaRegFileAlt, FaTrash, FaCheckCircle,FaTruckPickup } from "react-icons/fa";

import ws1 from "../../assets/ws1.jpeg"
import ws2 from "../../assets/ws2.jpg"

import "./UserDash.css";

// Import necessary components

import Topbar from "../Topbar/Topbar";
import UserSidebar from "../UserSidebar/UserSidebar";



const UserDash = () => {


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
    <UserSidebar/>

      {/* Main Content */}
      <main className="main-content">
       <Topbar/>

        <section className="stats-section">
          <div className="stat-card">
            <FaRegFileAlt className="icon" style={{ color: "rgb(77, 76, 76)", background: "#e2e4e3", padding: "7px", fontSize: "40px", borderRadius: "50%" }} />
            <h3>Total Reports</h3>
            <p>21</p>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon" style={{ color: "rgb(77, 76, 76)", background: "#e2e4e3", padding: "7px", fontSize: "40px", borderRadius: "50%" }}  />
            <h3>Pending Pick-ups</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon" style={{ color: "rgb(77, 76, 76)", background: "#e2e4e3", padding: "7px", fontSize: "40px", borderRadius: "50%" }}  />
            <h3>Completed Pick-ups</h3>
            <p>10</p>
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
