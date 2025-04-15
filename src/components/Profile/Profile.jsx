import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = ({ onClose }) => {
  return (
    <div className="profile-modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>×</button>
        <ul className="profile-options">
          <li>
            <FaCog /> <Link to="/settings">Settings</Link>
          </li>
          <li>
            <FaSignOutAlt /> <Link to="/signin">Log out</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;