import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";

const firebaseUrl = "https://register-d6145-default-rtdb.firebaseio.com/users.json";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the username from Firebase
    const fetchUsername = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        const storedUsername = localStorage.getItem("username"); // Get the logged-in user's username from localStorage

        if (data) {
          const user = Object.values(data).find(user => user.username === storedUsername);
          if (user) {
            setUsername(user.username);
          } else {
            setError("User not found.");
          }
        }
      } catch (error) {
        setError("Error fetching data.");
      }
      setLoading(false);
    };

    fetchUsername();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-container">
      <div
        className="text-profile"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
      >
        <i className="profile-icon"><FaUserAlt/></i>
        <p style={{ textAlign: "center", fontSize: "14px", color: "black" }}>{username}</p>
      </div>
    </div>
  );
};

export default Profile;