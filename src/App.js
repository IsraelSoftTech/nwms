import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import Landing from "./components/LandingPage/Landing";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import AdminDash from "./components/AdminDash/AdminDash";
import UserDash from "./components/UserDash/UserDash";
import AdminReport from "./components/AdminReport/AdminReport";
import UserReport from "./components/UserReport/UserReport";
import AdminEducation from "./components/AdminEducation/AdminEducation";
import UserEducation from "./components/UserEducation/UserEducation";
import AdminChat from "./components/AdminChat/AdminChat";
import UserChat from "./components/UserChat/UserChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dash" element={<AdminDash />} />
        <Route path="/user-dash" element={<UserDash />} />
        <Route path="/admin-report" element={<AdminReport/>} />
        <Route path="/user-report" element={<UserReport/>} />
        <Route path="/admin-education" element={<AdminEducation/>} />
        <Route path="/user-education" element={<UserEducation/>} />
        <Route path="/admin-chat" element={<AdminChat/>} />
        <Route path="/user-chat" element={<UserChat/>} />
      </Routes>
    </Router>
  );
}

export default App;
