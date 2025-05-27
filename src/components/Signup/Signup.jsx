import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database, ref, get, set } from "../../firebase"; // Firebase imports
import "./Signup.css";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Button activation state
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Success & Error message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Enable button only when all fields are filled and passwords match
    const { username, firstName, lastName, email, password, confirmPassword } = { ...formData, [name]: value };
    setIsButtonActive(
      username.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword // Only check if passwords match
    );
  };

  // Handle Signup
  const handleSignup = async () => {
    const { username, email, firstName, lastName, password, confirmPassword } = formData;

    // Only validate that passwords match
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    // Check if username or email already exists
    const userRef = ref(database, "users");
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        // Check if username exists
        if (users[username]) {
          setMessageType("error");
          setMessage("❌ Username already exists!");
          return;
        }
        // Check if email exists
        const emailExists = Object.values(users).some(user => user.email === email);
        if (emailExists) {
          setMessageType("error");
          setMessage("❌ Email already exists!");
          return;
        }
      }

      // Save user to Firebase
      await set(ref(database, "users/" + username), {
        username,
        firstName,
        lastName,
        email,
        password, // In a real app, NEVER store passwords in plain text!
      });

      setMessageType("success");
      setMessage("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setMessageType("error");
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* Navbar */}
      <nav className="navbar-sign">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="logo-sign" />
        </div>
        <div className="nav-right">
          <Link to="/signin" className="signin-up">Sign in</Link>
          <Link to="/signup" className="signup-up">Sign up</Link>
        </div>
      </nav>

      {/* Signup Box */}
      <div className="signup-box">
        <h2 className="signup-title">Sign up</h2>

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

        {/* Form Fields */}
        <div className="input-group">
          <label>Username *</label>
          <input type="text" name="username" placeholder="Enter your username" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>First Name *</label>
          <input type="text" name="firstName" placeholder="Enter your first name" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" placeholder="Enter your last name" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Email *</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
        </div>

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

        <div className="input-group password-group">
          <label>Confirm Password *</label>
          <div className="password-wrapper">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} />
            {showConfirmPassword ? (
              <FaEyeSlash className="eye-icon" onClick={() => setShowConfirmPassword(false)} />
            ) : (
              <FaEye className="eye-icon" onClick={() => setShowConfirmPassword(true)} />
            )}
          </div>
        </div>

        <p className="signin-text">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>

        {/* Signup Button */}
        <button className="signup-submit" onClick={handleSignup} disabled={!isButtonActive} style={{ background: isButtonActive ? "#ff6600" : "#ccc" }}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Signup;