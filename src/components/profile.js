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
  const [isEditing, setIsEditing] = useState({ username: false, email: false, password: false });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(firebaseUrl);
      const users = await response.json();
      const currentUser = Object.values(users).find(user => user.username === username);
      
      if (currentUser) {
        setProfileData({
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password,
          image: currentUser.image || null,
        });
      }
    };

    fetchData();
  }, [username]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) { // Limit to 1MB
      setProfileData({ ...profileData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const updatedUsers = await fetch(firebaseUrl).then(res => res.json());
    const userKey = Object.keys(updatedUsers).find(key => updatedUsers[key].username === username);

    if (userKey) {
      const updatedData = {
        ...updatedUsers[userKey],
        username: profileData.username,
        email: profileData.email,
        password: profileData.password,
        image: imagePreview || updatedUsers[userKey].image,
      };

      await fetch(`${firebaseUrl}/${userKey}.json`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      });

      onClose(); // Close profile settings after saving
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