import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database, ref, get } from "../../firebase"; // Firebase imports
import "./Signin.css";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Signin = () => {
  const navigate = useNavigate();

  // Form state
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Button activation state
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Success & Error message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    // Activate button only if both fields have values
    setIsButtonActive(credentials.username.trim() !== "" && credentials.password.trim() !== "");
  };

  // Handle Sign-in
  const handleSignin = async () => {
    const { username, password } = credentials;

    // Check if user is an admin
    if (username === "admin_account" && password === "admin1234") {
      setMessageType("success");
      setMessage("✅ Admin login successful! Redirecting...");
      setTimeout(() => navigate("/admin-dash"), 2000);
      return;
    }

    // Check if user exists in Firebase database
    const userRef = ref(database, "users/" + username);

    try {
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        setMessageType("error");
        setMessage("⚠️ Username not found!");
        return;
      }

      const userData = snapshot.val();
      if (userData.password !== password) {
        setMessageType("error");
        setMessage("❌ Incorrect password. Try again.");
        return;
      }

      setMessageType("success");
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/user-dash"), 2000);
    } catch (error) {
      setMessageType("error");
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="signin-container">
      {/* Navbar */}
      <nav className="navbar-sign">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="logo-sign" />
        </div>
        <div className="nav-right">
          <Link to="/signin" className="signin-in">Sign in</Link>
          <Link to="/signup" className="signup-in">Sign up</Link>
        </div>
      </nav>

      {/* Sign-in Box */}
      <div className="signin-box">
        <h2 className="signin-title">Sign in</h2>

        {/* Google Authentication Button */}
        <button className="google-auth">
          <FaGoogle className="google-logo" />
          Continue with Google authenticate
        </button>

        <div className="separator">
          <span className="line"></span>
          <span className="or">Or</span>
          <span className="line"></span>
        </div>

        {/* Success/Error Message */}
        {message && <div className={`message-box ${messageType}`}>{message}</div>}

        {/* Username Field */}
        <div className="input-group">
          <label>Username *</label>
          <input type="text" name="username" placeholder="Enter your username" onChange={handleChange} />
        </div>

        {/* Password Field */}
        <div className="input-group password-group">
          <label>Password *</label>
          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" onChange={handleChange} />
            {showPassword ? (
              <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye className="eye-icon" onClick={() => setShowPassword(true)} />
            )}
          </div>
        </div>

        {/* Sign up link */}
        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        {/* Sign-in Button */}
        <button className="signin-submit" onClick={handleSignin} disabled={!isButtonActive} style={{ background: isButtonActive ? "#ff6600" : "#ccc" }}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Signin;
