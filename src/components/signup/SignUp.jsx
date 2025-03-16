import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { FcGoogle } from "react-icons/fc";
import Loader from "../Loader"; // Import the Loader component

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
  const [emailExists, setEmailExists] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkEmailExists = async () => {
      if (formData.email) {
        const response = await fetch(firebaseUrl);
        const users = await response.json();
        const emailInUse = Object.values(users).some(user => user.email === formData.email);
        setEmailExists(emailInUse);
      } else {
        setEmailExists(false);
      }
    };
    checkEmailExists();
  }, [formData.email]);

  const validatePassword = (password) => {
    const hasNumbers = /\d/;
    const hasLetters = /[a-zA-Z]/;
    return password.length >= 8 && hasNumbers.test(password) && hasLetters.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader immediately
    setMessage("");
    setIsSuccess(false); // Reset success state

    if (emailExists) {
      setMessage("Email already exists!");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // Clear error message after 3 seconds
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage("Password must be at least 8 characters long and contain both letters and numbers.");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // Clear error message after 3 seconds
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match!");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // Clear error message after 3 seconds
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
        setLoading(false);
        setIsSuccess(true);
        setMessage("Account Created Successfully!"); // Set success message
        setTimeout(() => {
          navigate("/signin");
        }, 4000);
      } else {
        setMessage("Sign-up failed! Try again.");
        setLoading(false);
        setTimeout(() => setMessage(""), 3000); // Clear error message after 3 seconds
      }
    } catch (error) {
      setMessage("An error occurred. Try again later.");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // Clear error message after 3 seconds
    }
  };

  const handleSignInRedirect = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setLoading(true); // Show loader immediately
    setTimeout(() => {
      navigate("/signin"); 
      setLoading(false);
    }, 1500); // Give some time for the loader to show
  };

  // Check if the button should be disabled
  const isButtonDisabled = 
    !formData.username || 
    !formData.email || 
    !formData.password || 
    !formData.confirm_password || 
    (!validatePassword(formData.password) || 
    (formData.password !== formData.confirm_password && message !== "Email already exists!"));

  if (loading) {
    return <Loader />; // Show loader if loading state is true
  }

  return (
    <div className="container">
      <div className="head-items">
        <h2>Waste Management Application</h2>
      </div>

      <div className="signup-box">
        <h3>Sign Up</h3>
        <button className="google-btn">
          <FcGoogle style={{ fontSize: "35px" }} />
          Continue with Google Authenticate
        </button>
        <p className="or-text" style={{ color: "#FE7235" }}>Or</p>

        {(message && !isSuccess) && <p className="message error">{message}</p>}
        {isSuccess && (
          <div className="success-message">
            Account Created Successfully!
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <label>*Username</label>
          <input
            className="int"
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            required
          />

          <label>*Email</label>
          <input
            className="int"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />

          <label>*Password</label>
          <input
            className="int"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />

          <label>*Confirm Password</label>
          <input
            className="int"
            type="password"
            name="confirm_password"
            placeholder="Repeat Password"
            onChange={handleChange}
            required
          />

          <button 
            className="signup-btn" 
            disabled={isButtonDisabled} 
            style={{ backgroundColor: isButtonDisabled ? 'grey' : '#FE7235' }}
          >
            Sign Up
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/signin" onClick={handleSignInRedirect} style={{ color: "#408AFD", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;