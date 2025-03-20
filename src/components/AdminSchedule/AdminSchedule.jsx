import React, { useEffect, useState } from "react";
import { FaRegFileAlt, FaTruckPickup } from "react-icons/fa";

import { FiUsers } from "react-icons/fi";

import "./AdminSchedule.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

//import users
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseApp from "../../firebaseConfig";

import Sidebar from "../Sidebar/Sidebar";

import TopNew from "../TopNew/TopNew";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
//abreviate username text

const AdminSchedule = () => {
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
        <TopNew />

        <section className="stats-section">
          <div className="stat-card">
            <FaRegFileAlt className="icon2" />
            <div className="card-count">
              <p>Reports</p>
              <p>21</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTruckPickup className="icon2" />
            <div className="card-count">
              <p>Pending PickUps</p>
              <p>12</p>
            </div>
          </div>
          <div className="stat-card">
            <FiUsers className="icon2" />
            <div className="card-count">
              <p>Users</p>
              <p>{userCount}</p> {/* Dynamically updates the user count */}
            </div>
          </div>
        </section>

        {/* User and Dump Site */}

        <section className="user-illegal">
          {/* -------------------------------------------------------------------- */}
          <div className="user-box-img"></div>

          {/* --------------------------------------------------------------------------- */}
        </section>
      </main>
    </div>
  );
};

export default AdminSchedule;
