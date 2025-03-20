import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaCheckCircle, FaTruckPickup, FaSpinner, FaPaperPlane, FaTimesCircle } from "react-icons/fa";
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
  const [viewedReports, setViewedReports] = useState({});

  const db = getDatabase();

  useEffect(() => {
    // Fetch submitted reports
    const reportsRef = ref(db, 'submittedReports/');
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedReports(Object.values(data));
      }
    });

    // Fetch viewed reports
    const viewedRef = ref(db, 'viewedReports/');
    onValue(viewedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setViewedReports(data);
      }
    });
  }, [db]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result // This will be the base64 string
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: value,
        };

        // Generate Google Map Link when location changes
        if (name === "location") {
          newFormData.googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
        }

        return newFormData;
      });
    }
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
            <div className="card-count">
            <p>Total Reports</p>
            <p>{submittedReports.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <div className="card-count">
            <p>Pending Pick-ups</p>
            <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="icon2" />
            <div className="card-count">
            <p>Completed Pick-ups</p>
            <p>10</p>
            </div>
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
            <div className="report-status-table">
              <table>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Date Submitted</th>
                    <th>View</th>
                    <th>Pending</th>
                    <th>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.date}</td>
                      <td>
                        <div className="status-icon viewed">
                          {viewedReports[report.id] ? (
                            <FaCheckCircle style={{ color: '#22C55E' }} />
                          ) : (
                            <FaTimesCircle style={{ color: '#EF4444' }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="status-icon pending">
                          {report.status === 'pending' ? (
                            <FaCheckCircle style={{ color: '#22C55E' }} />
                          ) : (
                            <FaTimesCircle style={{ color: '#EF4444' }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="status-icon resolved">
                          {report.status === 'resolved' ? (
                            <FaCheckCircle style={{ color: '#22C55E' }} />
                          ) : (
                            <FaTimesCircle style={{ color: '#EF4444' }} />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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