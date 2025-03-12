import React, { useEffect, useState } from "react";
import { FaRegFileAlt,  FaTruckPickup} from "react-icons/fa";


import "./UserEdu.css";


import UserSidebar from "../UserSidebar/UserSidebar";
import Topbar from "../Topbar/Topbar";

const firebaseUrl =
  "https://register-d6145-default-rtdb.firebaseio.com/educational_contents.json";



const UserEdu = () => {




  const [educationalContents, setEducationalContents] = useState([]);
  const [expandedContent, setExpandedContent] = useState(null);



// educational contents
  useEffect(() => {
    const fetchEducationalContents = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        if (data) {
          setEducationalContents(Object.values(data));
        }
      } catch (error) {
        console.error("Error fetching educational content:", error);
      }
    };

    fetchEducationalContents();
    const interval = setInterval(fetchEducationalContents, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleContent = (index) => {
    setExpandedContent(expandedContent === index ? null : index);
  };
// --------------------------------------------------------------------------------------------------------------------
  return (
    <div className="dashboard-container">
  <UserSidebar/>

      <main className="main-content">
    <Topbar/>

    
        <section className="stats-section">
          <div className="stat-card">
            <FaRegFileAlt className="icon2" />
            <h3>Reports</h3>
            <p>21</p>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <h3>Pending PickUps</h3>
            <p>12</p>
          </div>
        </section>

        {/* Educational Content */}
        <section className="content-section">
          <div className="content-box">
            <div className="edu">
              <h3>Educational Contents</h3>
            </div>
            {educationalContents.length === 0 ? (
              <p>No content available. Click the plus icon to add.</p>
            ) : (
              <ul>
              {educationalContents.map((content, index) => (
                <li key={index} onClick={() => toggleContent(index)} style={{ cursor: "pointer" }}>
                  {expandedContent === index 
                    ? content.text 
                    : (typeof content.text === "string" ? content.text.split(".")[0] + "." : "Invalid content")}
                </li>
              ))}
            </ul>
            
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserEdu;
