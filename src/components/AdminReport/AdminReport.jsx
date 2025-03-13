import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTruckPickup,
} from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { getDatabase, ref, onValue } from "firebase/database";

import "./AdminReport.css";

// Import necessary components
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const AdminReport = () => {
  const [submittedReports, setSubmittedReports] = useState([]);

  const db = getDatabase();

  useEffect(() => {
    const reportsRef = ref(db, "submittedReports/");
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedReports(Object.values(data));
      } else {
        setSubmittedReports([]);
      }
    });
  }, [db]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <Topbar />

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
                    <td>{report.location}</td>
                    <td style={{background:"green",color:"white"}}>resolved</td>
                    <td>{report.date}</td>
                    <td>
                      <div className="editDel">
                        <FaCheckCircle
                          className="resolve-icon"
                          style={{
                            color: "#23AE60",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
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