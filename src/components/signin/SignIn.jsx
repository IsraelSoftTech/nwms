import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch(firebaseUrl);
      const users = await response.json();
  
      if (users) {
        const userFound = Object.values(users).find(
          (user) => user.username === formData.username && user.password === formData.password
        );
  
        if (userFound) {
          localStorage.setItem("username", userFound.username);
          
          if (userFound.username === "admin_account" && userFound.password === "admin_password") {
            navigate("/admin-dashboard"); // Open AdminDash.jsx
          } else {
            navigate("/user-dashboard"); // Open UserDash.jsx
          }
        } else {
          setMessage("Login failed! Check your username or password.");
        }
      } else {
        setMessage("No users found. Please sign up first.");
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

      <div className="signin-box">
        <h3>Sign In</h3>
        <button className="google-btn">
          <FcGoogle style={{ fontSize: "35px" }} />
          Continue with Google Authenticate
        </button>
        <p className="or-text">Or</p>

        {message && <p className="message" style={{ background: "#FF4C4C" }}>{message}</p>}
        {loading && <div className="spinner"></div>}

        <form onSubmit={handleSignIn}>
          <label>*Username</label>
          <input className="int" type="text" name="username" placeholder="Enter username" onChange={handleChange} required />

          <label>*Password</label>
          <div className="password-wrapper">
            <input className="int"  type={showPassword ? "text" : "password"} name="password" placeholder="Enter Password" onChange={handleChange} required />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="signin-btn" disabled={loading}>Sign In</button>
        </form>

        <p className="forgot-password">Forgot Password?</p>
        <p>Don’t have an account? <Link to="/signup" style={{color:"#408AFD",textDecoration:"none"}}>Sign Up</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
