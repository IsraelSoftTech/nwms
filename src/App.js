import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import UserDash from "./components/userDash/UserDash";
import AdminDash from "./components/dashBoard/AdminDash";

import AdminReport from "./components/AdminReport/AdminReport";
import UserReport from "./components/userReport/UserReport";
import UserEdu from "./components/UserEdu/UserEdu";
import AdminLegal from "./components/AdminLegal/AdminLegal";
import AllWords from "./components/AllWords";
import Landing from "./components/Landing/Landing";
import AdminSchedule from "./components/AdminSchedule/AdminSchedule";

function App() {
  const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";
  const [adminAdded, setAdminAdded] = useState(false); // Track whether the admin has been added

  const addAdminAccount = async () => {
    const adminData = {
      username: "admin_account",
      password: "admin_password",
      role: "admin",
    };

    try {
      // Fetch all users from the Firebase database
      const response = await fetch(firebaseUrl);
      const users = await response.json();

      // Check if the admin account already exists
      const adminExists =
        users &&
        Object.values(users).some(
          (user) => user.username === adminData.username && user.password === adminData.password
        );

      if (adminExists) {
        console.log("Admin account already exists.");
        return;
      }

      // Add the admin account if it doesn't exist
      const addResponse = await fetch(firebaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });

      if (addResponse.ok) {
        console.log("Admin account added successfully!");
        setAdminAdded(true); // Update the state after adding the admin
      } else {
        console.log("Failed to add admin account.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!adminAdded) {
      addAdminAccount(); // Only call addAdminAccount if it hasn't been added already
    }
  }, [adminAdded]); // Dependency on adminAdded to ensure it only runs once

  return (
    <div>
      <AllWords/>
    <Router>
      <Routes>
        
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/user-dashboard" element={<UserDash />} />
        <Route path="/admin-report" element={<AdminReport />} />
       
        <Route path="/user-report" element={<UserReport />} />
        <Route path="/user-edu" element={<UserEdu />} />
        <Route path="/admin-legal" element={<AdminLegal />} />
        <Route path="/admin-schedule" element={<AdminSchedule />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
