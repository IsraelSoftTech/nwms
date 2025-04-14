import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import wst from "../../assets/ws1.jpeg";
import logo from "../../assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  // Function to handle redirection through Loader
  const handleNavigation = (path) => {
    navigate("/", { state: { redirectTo: path } }); // Go to Loader first, then redirect
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <h1>WASTE MANAGER</h1>
        <div className="nav-links">
          <a href="#">Read More</a>
          <button className="signin" onClick={() => handleNavigation("/signin")}>Sign In</button>
          <button className="signup-btn-land" onClick={() => handleNavigation("/signup")}>Sign Up</button>
        </div>
      </nav>

      <div className="hero">
        <div className="section-left">
          <h1>
            A Waste <span className="spacing">Free Community,</span>
            <br />
            <span className="highlight">A Healthy Community</span>
          </h1>
          <p>
            Together, we can keep our region waste free. Waste Manager is an
            application designed to enhance waste management in the community.
            With WM, inhabitants can request waste collection, report illegal
            dumpsites, and manage all types of waste.
          </p>
        </div>

        <div className="section-right">
          <img src={wst} alt="Waste site" className="hero-img" />
        </div>
      </div>

      <footer className="footer">
        <p>
          Designed and Implemented by: <br />
          <span className="club-name">Students’ Tech Club of MPASAT - 2025</span>
        </p>
        <small>All Rights Reserved 2025</small>
      </footer>
    </div>
  );
};

export default Landing;
