import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaCheckCircle, FaTruckPickup, FaSpinner, FaPaperPlane } from "react-icons/fa";
import { getDatabase, ref, set, onValue } from "firebase/database";

import ws1 from "../../assets/ws1.jpeg";
import ws2 from "../../assets/ws2.jpg";

import "./UserReport.css";

import Topbar from "../Topbar/Topbar";
import UserSidebar from "../UserSidebar/UserSidebar";

const UserReport = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
    date: "",
    user: "",
    image: null,
    googleMapLink: "" // New field for Google Map Link
  });
  const [submittedReports, setSubmittedReports] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const db = getDatabase();

  useEffect(() => {
    const reportsRef = ref(db, 'submittedReports/');
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedReports(Object.values(data));
      }
    });
  }, [db]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: name === "image" ? files[0] : value,
      };

      // Generate Google Map Link when location changes
      if (name === "location") {
        newFormData.googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportId = Date.now(); // Simple ID generation
    const reportData = {
      ...formData,
      id: reportId,
    };

    // Save to Firebase
    set(ref(db, `submittedReports/${reportId}`), reportData)
      .then(() => {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // Reset the form
        setFormData({
          type: "",
          description: "",
          location: "",
          date: "",
          user: "",
          image: null,
          googleMapLink: "", // Reset the Google Map Link as well
        });
        // Reset file input
        document.querySelector('input[type="file"]').value = "";
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  const isFormComplete = Object.values(formData).every((field) => field);

  return (
    <div className="dashboard-container">
      <UserSidebar />
      <main className="main-content">
        <Topbar />
        <section className="stats-section">
          {/* Stat Cards */}
          <div className="stat-card">
            <FaRegFileAlt className="icon2" />
            <h3>Total Reports</h3>
            <p>{submittedReports.length}</p>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <h3>Pending Pick-ups</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <h3>Completed Pick-ups</h3>
            <p>10</p>
          </div>
        </section>

        <section className="user-illegal">
          <div className="user-box">
            <h3>Report for waste collection</h3>
            <form className="report-waste-form" onSubmit={handleSubmit}>
              <label><h4>Type of Waste:</h4></label>
              <select name="type" onChange={handleChange} required>
                <option value="">Select</option>
                <option>Plastic</option>
                <option>Organic</option>
                <option>Metallic</option>
                <option>Glass</option>
                <option>Paper</option>
                <option>Electronic</option>
                <option>Hazardous</option>
                <option>Textile</option>
              </select>

              <label><h4>Description:</h4></label>
              <textarea name="description" placeholder="Describe the waste issue..." onChange={handleChange} required></textarea>

              <label><h4>Upload Image:</h4></label>
              <input type="file" name="image" onChange={handleChange} required />

              <label><h4>Location:</h4></label>
              <input type="text" name="location" placeholder="Enter location" onChange={handleChange} required />

              <label><h4>Google Map Link:</h4></label>
              <input type="text" name="googleMapLink" value={formData.googleMapLink} readOnly /> {/* Autofilled link */}

              <label><h4>Date:</h4></label>
              <input type="date" name="date" onChange={handleChange} required />

              <label><h4>User:</h4></label>
              <input type="text" name="user" onChange={handleChange} required />

              <button type="submit" className="submit-btn" style={{ background: isFormComplete ? "#FE7235" : "#ccc" }}>
                Submit Report
              </button>
            </form>

            {showSuccessMessage && (
              <div className="success-message">
                Report Submitted Successfully
              </div>
            )}
          </div>

          {/* Report Status */}
          <div className="user-box">
            <h3>Report Status</h3>
            <div className="status-steps">
              <div className="step completed">
                <FaPaperPlane className="status-tract" />
                <span className="step-number">11</span>
                <p>Submitted</p>
              </div>
              <div className="step in-progress">
                <FaSpinner className="status-tract" />
                <span className="step-number">3</span>
                <p>In Progress</p>
              </div>
              <div className="step pending">
                <FaCheckCircle className="status-tract" />
                <span className="step-number">7</span>
                <p>Resolved</p>
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="user-box-img">
            <div className="waste-img">
              <img src={ws1} alt="" />
            </div>
          </div>
          <div className="user-box-img">
            <div className="waste-img">
              <img src={ws2} alt="" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserReport;