import React, { useState, useEffect, useRef } from "react";
import "./AdminChat.css";
import {
  FaBars,
  FaBell,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaSearch,
  FaGraduationCap,
  FaCommentAlt,
  FaTimes,
  FaPaperPlane,
  FaSmile,
  FaCamera,
} from "react-icons/fa";
import { MdDashboard, MdReportProblem } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import { database, ref, set, get } from "../../firebase";
import EmojiPicker from 'emoji-picker-react'; // Make sure to install this package

const AdminChat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch messages on component mount and set up polling
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = ref(database, 'messages');
        const snapshot = await get(messagesRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const messageArray = Object.entries(data).map(([id, message]) => ({ id, ...message }));
          setMessages(messageArray.sort((a, b) => a.timestamp - b.timestamp));
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    try {
      setLoading(true);
      const messageData = {
        text: newMessage.trim(),
        sender: 'admin',
        timestamp: Date.now(),
        status: 'unread',
        fileUrl: file ? URL.createObjectURL(file) : null,
      };

      const newMessageId = Date.now().toString();
      await set(ref(database, `messages/${newMessageId}`), messageData);
      setNewMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEmojiPick = (emoji) => {
    setNewMessage(prev => prev + emoji.emoji); // Assuming emoji has an 'emoji' property
    setEmojiPickerVisible(false);
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <img src={logo} alt="" />
          <h1>Waste <span style={{color:"#ff6600"}}>Manager</span></h1>
        </div>
        {sidebarOpen && (
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        )}
        <ul className="menu">
          <li>
            <Link to="/admin-dash" className="link-no-style">
              <MdDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin-report" className="link-no-style">
              <FaRegFileAlt /> Reports
            </Link>
          </li>
          <li>
            <Link to="/admin-schedule" className="link-no-style">
              <FaRegCalendarAlt /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/admin-illegal" className="link-no-style">
              <MdReportProblem /> Illegal Dumps
            </Link>
          </li>
          <li>
            <Link to="/admin-education" className="link-no-style">
              <FaGraduationCap /> Education
            </Link>
          </li>
          <li className="active">
            <Link to="/admin-chat" className="link-no-style">
              <FaCommentAlt /> Chat
            </Link>
          </li>
        </ul>
        <button className="logout">
          <FiLogOut /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search messages..." />
          </div>

          <div className="topbar-icons">
            <div className="notif">
              <FaBell />
              <span className="notif-count">1</span>
            </div>
            <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
            <button className="ad-btn">Ad</button>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="chat-container">
          <div className="chat-header">
            <img src="https://i.pravatar.cc/40?img=1" alt="User" className="chat-profile-pic" />
            <div className="chat-user-info">
              <h3>User Chat</h3>
              <p>Online</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'admin' ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {message.fileUrl && (
                    <img src={message.fileUrl} alt="attachment" className="message-image" />
                  )}
                  <p>{message.text}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="button" onClick={handleCameraClick}>
              <FaCamera />
            </button>
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide the input
            />
            <button type="button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
              <FaSmile />
            </button>
            <button type="submit" disabled={loading}>
              <FaPaperPlane />
            </button>
            {emojiPickerVisible && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiPick} />
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminChat;