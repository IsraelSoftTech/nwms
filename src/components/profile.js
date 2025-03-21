import React, { useState, useEffect } from "react";
import "./profile.css";
import { FaCamera, FaPen } from "react-icons/fa";
import {MdClose} from "react-icons/md"

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const Profile = ({ username, onClose }) => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
    image: null,
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState({ username: false, email: false, password: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const users = await response.json();
        const currentUser = Object.values(users).find(user => user.username === username);
        
        if (currentUser) {
          const userData = {
            username: currentUser.username,
            email: currentUser.email,
            password: currentUser.password,
            image: currentUser.image || null,
          };
          setProfileData(userData);
          setOriginalData(userData); // Store original data for comparison
        }
      } catch (error) {
        setMessage({ text: "Error fetching user data", type: "error" });
      }
    };

    fetchData();
  }, [username]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" }); // Clear any existing messages
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) { // 1MB limit
        setMessage({ text: "Image size should not exceed 1MB", type: "error" });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMessage({ text: "Please select an image file", type: "error" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          image: reader.result // Store base64 string
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(originalData) !== JSON.stringify(profileData);
  };

  const handleSave = async () => {
    try {
      if (!hasChanges()) {
        setMessage({ text: "No changes made", type: "info" });
        return;
      }

      const response = await fetch(firebaseUrl);
      const users = await response.json();
      const userKey = Object.keys(users).find(key => users[key].username === username);

      if (userKey) {
        const updatedData = {
          ...users[userKey],
          username: profileData.username,
          email: profileData.email,
          password: profileData.password,
          image: profileData.image // Store the base64 image string
        };

        const updateResponse = await fetch(`${firebaseUrl.slice(0, -5)}/${userKey}.json`, {
          method: "PUT",
          body: JSON.stringify(updatedData),
          headers: { "Content-Type": "application/json" },
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update profile');
        }

        // Update localStorage with new username and profile image
        localStorage.setItem("username", profileData.username);
        localStorage.setItem("profileImage", profileData.image || "");
        
        setMessage({ text: "Profile updated successfully", type: "success" });
        setOriginalData(profileData);
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setMessage({ text: "Error updating profile", type: "error" });
    }
  };

  return (
    <div className="profile-box">
      <MdClose className="close-icon" onClick={onClose} />
      <div className="profile-header">
        <div className="profile-image">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" />
          ) : (
            <div className="default-image"> {profileData.username.charAt(0)} </div>
          )}
          <label className="camera-icon">
            <FaCamera />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <h2>Profile Settings</h2>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-field">
        <label>Username</label>
        {isEditing.username ? (
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
          />
        ) : (
          <div className="profile-value">
            {profileData.username}
            <FaPen onClick={() => handleEditToggle("username")} />
          </div>
        )}
      </div>
      <div className="profile-field">
        <label>Email</label>
        {isEditing.email ? (
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        ) : (
          <div className="profile-value">
            {profileData.email}
            <FaPen onClick={() => handleEditToggle("email")} />
          </div>
        )}
      </div>
      <div className="profile-field">
        <label>Password</label>
        {isEditing.password ? (
          <input
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleChange}
          />
        ) : (
          <div className="profile-value">
            {profileData.password}
            <FaPen onClick={() => handleEditToggle("password")} />
          </div>
        )}
      </div>
      <button className="save-profile-btn" onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default Profile;