import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import { getDatabase, ref, onValue, set } from "firebase/database";
import "./Notify.css";

const Notify = ({ onClose, onNotificationClick, isAdmin }) => {
  const [showAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    // Fetch notifications from Firebase
    const notificationsRef = ref(db, 'notifications/');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort by timestamp (newest first)
        const notificationsArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(notificationsArray);
      }
    });
  }, [db]);

  // Function to format time ago
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = Math.floor(seconds / 31536000);
    
    if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    return "Just now";
  };

  // Function to handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await set(ref(db, `notifications/${notification.id}/read`), true);
      // Navigate to the report
      onNotificationClick(notification.reportId);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  // Determine the displayed notifications based on the showAll state and admin status
  const displayedNotifications = isAdmin ? (showAll ? notifications : notifications.slice(0, 6)) : [];

  return (
    <div className={`notify-box ${displayedNotifications.length > 6 ? 'scrollable' : ''}`}>
      <div className="notify-header">
        <h3>Notifications</h3>
        <MdSettings className="settings-icon" />
      </div>
      <div className="notify-list">
        {isAdmin ? (
          displayedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notify-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: 'pointer' }}
            >
              <img src={notification.image} alt="User" className="notify-avatar" />
              <div className="notify-content">
                <p>{notification.message}</p>
                <span>{getTimeAgo(notification.timestamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotifyWrapper({ onClose, onNotificationClick, isAdmin }) {
  return <Notify onClose={onClose} onNotificationClick={onNotificationClick} isAdmin={isAdmin} />;
}