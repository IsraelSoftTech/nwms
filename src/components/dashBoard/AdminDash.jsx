import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaTruckPickup } from "react-icons/fa";

import { FiUsers } from "react-icons/fi";

import "./AdminDash.css";

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
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseApp from "../../firebaseConfig";
import CustomAreaChart from "../recharts/CustomAreaChart";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

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
  //Count users
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const db = getDatabase(firebaseApp);
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserCount(Object.keys(data).length);
      } else {
        setUserCount(0);
      }
    });
  }, []);
  //--------------------------------------

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <Topbar />

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
          <div className="stat-card">
            <FiUsers className="icon2" />
            <h3>Users</h3>
            <p>{userCount}</p> {/* Dynamically updates the user count */}
          </div>
        </section>

        {/* Educational Content */}
        <section className="content-section">
          <EduContent />
          <div className="graph-box">
            <div className="graph-placeholder">
              <CustomAreaChart />
            </div>
          </div>
        </section>

        {/* User and Dump Site */}

        <section className="user-illegal">
          <div className="newUser" style={{ overflowY: "hidden" }}>
            {" "}
            <Users />
          </div>

          <div className="user-box">
            <h3>Illegal Dump Sites</h3>
            <div className="graph-placeholder"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDash;
