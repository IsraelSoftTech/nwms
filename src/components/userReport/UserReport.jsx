import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaCheckCircle, FaTruckPickup, FaSpinner, FaPaperPlane } from "react-icons/fa";

import ws1 from "../../assets/ws1.jpeg";
import ws2 from "../../assets/ws2.jpg";

import "./UserReport.css";

import { getDatabase, ref, push } from "firebase/database";
import app from "../../firebaseConfig"; // Import your existing Firebase config

// Import necessary components

import Topbar from "../Topbar/Topbar";
import UserSidebar from "../UserSidebar/UserSidebar";



const UserReport = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    image: null,
    location: "",
    date: "", // New date field
    user: "", // New user field
  });
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if all fields are filled
    setIsFormComplete(
      formData.type &&
      formData.description &&
      formData.image &&
      formData.location &&
      formData.date && // Ensure date is included
      formData.user // Ensure user is included
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    const db = getDatabase(app);
    const reportsRef = ref(db, "submitReport");
    await push(reportsRef, formData);

    setSuccessMessage("Report Submitted Successfully!");
    setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3s

    // Reset form
    setFormData({ type: "", description: "", image: null, location: "", date: "", user: "" });
  };


  
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
            <FaTruckPickup className="icon" style={{ color: "rgb(77, 76, 76)", background: "#e2e4e3", padding: "7px", fontSize: "40px", borderRadius: "50%" }} />
            <h3>Pending Pick-ups</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon" style={{ color: "rgb(77, 76, 76)", background: "#e2e4e3", padding: "7px", fontSize: "40px", borderRadius: "50%" }} />
            <h3>Completed Pick-ups</h3>
            <p>10</p>
          </div>
        </section>

        {/* Reports of submission */}
        <section className="user-illegal">
          <div className="user-box">
            <h3>Report a waste</h3>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form className="report-waste-form" onSubmit={handleSubmit}>
              <label><h4>Type of Waste:</h4></label>
              <select name="type" onChange={handleChange} value={formData.type}>
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
              <textarea name="description" onChange={handleChange} value={formData.description} placeholder="Describe the waste issue..." required></textarea>

              <label><h4>Upload Image:</h4></label>
              <input type="file" onChange={handleImageUpload} accept="image/*" required/>

              <label><h4>Pick Location:</h4></label>
              <input type="text" name="location" onChange={handleChange} value={formData.location} placeholder="Enter location" required />

              <label><h4>Date:</h4></label>
              <input type="date" name="date" onChange={handleChange} value={formData.date} required /> {/* New date input */}

              <label><h4>User:</h4></label>
              <input type="text" name="user" value={formData.user} readOnly /> {/* User field auto-filled */}

              <button type="submit" className={`submit-btn ${isFormComplete ? "active" : ""}`} disabled={!isFormComplete}>
                Submit Report
              </button>
            </form>
          </div>
          {/* ------------------------------------------ */}

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
          {/* -------------------------------------------------------------------- */}
          <div className="user-box-img">
            <div className="waste-img">
              <img src={ws1} alt="" />
            </div>
          </div>
          {/* ------------------------------------------ */}
          <div className="user-box-img">
            <div className="waste-img">
              <img src={ws2} alt="" />
            </div>
          </div>
          {/* ------------------------------------------ */}

          {/* --------------------------------------------------------------------------- */}
        </section>
      </main>

     

     
      
    </div>
  );
};

export default UserReport;