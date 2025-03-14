import React, { useState } from "react";
import { MdSettings } from "react-icons/md";
import "./Notify.css";

const Notify = ({ notifications, onClose }) => {
  const [showAll] = useState(false);

  // Determine the displayed notifications based on the showAll state
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 6);

  return (
    <div className={`notify-box ${displayedNotifications.length > 6 ? 'scrollable' : ''}`}>
      <div className="notify-header">
        <h3>Notifications</h3>
        <MdSettings className="settings-icon" />
      </div>
      <div className="notify-list">
        {displayedNotifications.map((notification, index) => (
          <div key={index} className="notify-item">
            <img src={notification.image} alt="User" className="notify-avatar" />
            <div className="notify-content">
              <p>{notification.message}</p>
              <span>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default notifications data
const notifications = [
  { 
    image: "path/to/avatar1.jpg", 
    message: "Brigid Dawson followed you", 
    time: "4 hours ago" 
  },
  { 
    image: "path/to/avatar2.jpg", 
    message: "John Dwyer liked your post", 
    time: "Yesterday" 
  },
  { 
    image: "path/to/avatar3.jpg", 
    message: "Tim Hellman liked your post", 
    time: "Tuesday" 
  },
  { 
    image: "path/to/avatar4.jpg", 
    message: "Running low on storage space", 
    time: "Monday" 
  },
  { 
    image: "path/to/avatar5.jpg", 
    message: "Shannon Shaw commented on your post", 
    time: "4 days ago" 
  },
  { 
    image: "path/to/avatar6.jpg", 
    message: "Alice Smith mentioned you", 
    time: "3 days ago" 
  },
  { 
    image: "path/to/avatar7.jpg", 
    message: "Bob Johnson liked your comment", 
    time: "1 day ago" 
  },
  // Add more notifications as needed
];

export default function NotifyWrapper({ onClose }) {
  return <Notify notifications={notifications} onClose={onClose} />;
}