import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

import Loader from "../Loader";
import logo from "../../assets/logo.png"
import w1 from "../../assets/ws1.jpeg"
const Landing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/signin");
    }, 1500);
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 1500);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-w"><img src={logo}/></span>
           
          </div>
          <h1>Waste Manager</h1>
        </div>
        
        <div className="nav-center">
          <a href="#read">Read More</a>
         
        </div>
        
        <div className="auth-buttons">
          <button className="sign-in" onClick={handleSignIn}>Sign In</button>
          <button className="sign-up" onClick={handleSignUp}>Sign Up</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="heading-container">
            <h1>
              <span className="heading-dark">A Waste Free Community,</span>
              <span className="heading-blue">A Healthy Community</span>
            </h1>
          </div>

          <div className="description">
            <p>
              Together, we can keep our region waste free.
              Waste Manager is an application designed and to
              enhance waste management in the community.
              With WM, inhabitants can request for waste colle-
              ction, report illegal dumpsites, get all their wastes
              of all types managed.
            </p>
          </div>

          <div className="image-container">
            <img src={w1} alt="Waste dump site" />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <h2>Designed and Implemented by:</h2>
          <h3>Students' Tech Club of{'\n'}MPASAT - 2025</h3>
          <p>All Rights Reserved 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 