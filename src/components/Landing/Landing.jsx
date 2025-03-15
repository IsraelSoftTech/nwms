import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Landing.css"; // Import the CSS file for styling
import w1 from "../../assets/ws1.jpeg";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>WELCOME TO WMA, A WASTE MANAGEMENT APPLICATION THAT ENHANCES WASTE MANAGEMENT IN THE COMMUNITY.

        <div className="button-container">
          <Link to="/signin">
            <button className="sign-in-btn">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="sign-up-btn">Sign Up</button>
          </Link>
        </div>
        </h1>
       
      </div>
      <div className="image-container">
       
        <img src={w1} alt="Garbage Truck" className="full-width-image" />
      </div>
    
    </div>
  );
};

export default Landing;