import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import logo from "../../assets/logo.png";

import { FcGoogle } from "react-icons/fc";

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(firebaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setMessage("Account Created Successfully! Redirecting...");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setMessage("Sign-up failed! Try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="head-items">
        <img src={logo} alt="" />
        <h2>Waste Management Application</h2>
      </div>

      <div className="signup-box">
        <h3>Sign Up</h3>
        <button className="google-btn">
          <FcGoogle style={{ fontSize: "35px" }} />
          Continue with Google Authenticate
        </button>
        <p className="or-text" style={{color:"#FE7235"}}>Or</p>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSignUp}>
          <label>*Username</label>
          <input className="int"  type="text" name="username" placeholder="Enter Username" onChange={handleChange} required />

          <label>*Email</label>
          <input className="int"  type="email" name="email" placeholder="Enter Email" onChange={handleChange} required />

          <label>*Password</label>
          <input className="int"  type="password" name="password" placeholder="Enter Password" onChange={handleChange} required />

          <label>*Confirm Password</label>
          <input className="int"  type="password" name="confirm_password" placeholder="Repeat Password" onChange={handleChange} required />

          <button className="signup-btn" disabled={loading}>Sign Up</button>
        </form>

        <p>Already have an account? <Link to="/signin" style={{color:"#408AFD",textDecoration:"none"}}>Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
