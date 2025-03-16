import React, { useState } from "react";
import {useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import "./Landing.css"; // Import the CSS file for styling
import w1 from "../../assets/ws1.jpeg";
import logo from "../../assets/logo.png";
import Loader from "../Loader"; // Import the Loader component

const Landing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/signin");
    }, 1500); // Simulating a delay for loading
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 1500); // Simulating a delay for loading
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>WELCOME TO WMA, A WASTE MANAGEMENT APPLICATION THAT ENHANCES WASTE MANAGEMENT IN THE COMMUNITY.
        <div className="button-container">
          <button className="sign-in-btn" onClick={handleSignIn}>Sign In</button>
          <button className="sign-up-btn" onClick={handleSignUp}>Sign Up</button>
        </div> 
          <img src={logo} alt="" className="logo-land" /> 
        </h1>
       
       
      </div>
      <div className="image-container">
        <img src={w1} alt="Garbage Truck" className="full-width-image" />
      </div>
    </div>
  );
};

export default Landing;