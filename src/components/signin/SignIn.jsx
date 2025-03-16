import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Loader from "../Loader"; // Import the Loader component

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
    setLoading(true); // Show loader immediately
    setMessage("");

    try {
      const response = await fetch(firebaseUrl);
      const users = await response.json();

      if (users) {
        const userFound = Object.values(users).find(
          (user) => user.username.trim() === formData.username.trim() && user.password === formData.password
        );

        if (userFound) {
          localStorage.setItem("username", userFound.username);
          
          setTimeout(() => {
            if (userFound.username === "admin_account") {
              navigate("/admin-dashboard");
            } else {
              navigate("/user-dashboard");
            }
            setLoading(false);
          }, 1500);
        } else {
          setTimeout(() => {
            setMessage("Login failed! Check your username or password.");
            setLoading(false);
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setMessage("No users found. Please sign up first.");
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      setTimeout(() => {
        setMessage("An error occurred. Try again later.");
        setLoading(false);
      }, 1500);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true); // Show loader immediately
    setTimeout(() => {
      navigate("/signin"); // Simulate Google sign-in success
      setLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    setLoading(true); // Show loader immediately
    setTimeout(() => {
      // Redirect or show forgot password logic
      setLoading(false);
      alert("Forgot Password functionality to be implemented.");
    }, 1500);
  };

  const handleSignUpRedirect = () => {
    setLoading(true); // Show loader immediately
    setTimeout(() => {
      navigate("/signup"); // Redirect to signup page
      setLoading(false);
    }, 1500);
  };

  const isButtonDisabled = !formData.username || !formData.password;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className="head-items">
        <h2>Waste Management Application</h2>
      </div>

      <div className="signin-box">
        <h3>Sign In</h3>
        <button className="google-btn" onClick={handleGoogleSignIn}>
          <FcGoogle style={{ fontSize: "35px" }} />
          Continue with Google Authenticate
        </button>
        <p className="or-text">Or</p>

        {message && <p className="message" style={{ background: "#FF4C4C" }}>{message}</p>}

        <form onSubmit={handleSignIn}>
          <label>*Username</label>
          <input
            className="int"
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={handleChange}
            required
          />

          <label>*Password</label>
          <div className="password-wrapper">
            <input
              className="int"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button 
            className="signin-btn" 
            disabled={loading} 
            style={{ background: isButtonDisabled ? 'grey' : '#FE7235' }}
          >
            Sign In
          </button>
        </form>

        <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</p>
        <p>
          Don’t have an account?{" "}
          <span onClick={handleSignUpRedirect} style={{ color: "#408AFD", cursor: "pointer" }}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;