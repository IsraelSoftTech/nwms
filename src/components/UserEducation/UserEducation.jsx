import React, { useState, useEffect } from 'react';
import './UserEducation.css';
import {
  FaBars,
  FaBell,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaSearch,
  FaGraduationCap,
  FaCommentAlt,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdClose, MdDashboard, MdReportProblem } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import { database, ref, get } from "../../firebase";

const UserEducation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const [contentCount, setContentCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  // Fetch contents on component mount
  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const educationRef = ref(database, 'education');
      const snapshot = await get(educationRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const contentArray = Object.entries(data).map(([id, content]) => ({ 
          id, 
          ...content,
          isRead: false // Initialize all contents as unread
        }));
        setContents(contentArray.sort((a, b) => b.timestamp - a.timestamp));
        setContentCount(contentArray.length);
        setUnreadCount(contentArray.length);
        setReadCount(0);
      } else {
        setContents([]);
        setContentCount(0);
        setUnreadCount(0);
        setReadCount(0);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      setError('Failed to load contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    // Mark content as read
    if (!content.isRead) {
      const updatedContents = contents.map(c => 
        c.id === content.id ? { ...c, isRead: true } : c
      );
      setContents(updatedContents);
      setReadCount(prev => prev + 1);
      setUnreadCount(prev => prev - 1);
    }
  };

  const closeContent = () => {
    setSelectedContent(null);
  };

  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Error Message Component
  const ErrorMessage = () => (
    <div className="error-message">
      {error}
    </div>
  );

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
       
          <h1>Waste <span style={{color:"#ff6600"}}>Manager</span></h1>
        </div>
        {sidebarOpen && (
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        )}
        <ul className="menu">
          <li>
            <Link to="/user-dash" className="link-no-style">
              <MdDashboard  /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/user-report" className="link-no-style">
              <FaRegFileAlt /> Reports
            </Link>
          </li>
          <li>
            <Link to="/user-schedule" className="link-no-style">
              <FaRegCalendarAlt /> Schedule
            </Link>
          </li>
          <li>
            <Link to="/user-illegal" className="link-no-style">
              <MdReportProblem /> Illegal Dumps
            </Link>
          </li>
          <li className="active">
            <Link to="/user-education" className="link-no-style">
              <FaGraduationCap className="side-icon"/> Education
            </Link>
          </li>
          <li>
            <Link to="/user-chat" className="link-no-style">
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
        {error && <ErrorMessage />}
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search contents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-icons">
            <div className="notif">
              <FaBell />
              <span className="notif-count">1</span>
            </div>
            <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
            <button className="ad-btn">Us</button>
          </div>
        </header>

        <div className="education-container">
          {/* Cards Container */}
          <div className="cards-container">
            {/* Educational Contents Card */}
            <div className="content-card educational">
              <div className="card-header">
                <div className="icon-title">
                  <div className="content-icon">
                    <FaGraduationCap />
                  </div>
                  <h3>Educational Contents</h3>
                </div>
                <div className="title-count">
                  <h3>{contentCount}</h3>
                  <span className="count">Contents</span>
                </div>
              </div>
            </div>

            {/* Read/Unread Contents Card */}
            <div className="content-card read-status">
              <div className="card-header">
                <div className="icon-title">
                  <div className="content-icon">
                    <FaEye />
                  </div>
                  <h3>Read Contents</h3>
                </div>
                <div className="title-count">
                  <div className="status-count">
                    <span className="reading">Read: {readCount} </span>
                    <span className="to-be-read">Unread: {unreadCount} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Display */}
          {selectedContent ? (
            <div className="content-display" onClick={closeContent}>
              <div className="selected-content" onClick={(e) => e.stopPropagation()}>
                <div className="content-header">
                  <h2>{selectedContent.title}</h2>
                  <button onClick={closeContent} className="close-btn"><MdClose/></button>
                </div>
                <div className="content-body">
                  {selectedContent.fileUrl ? (
                    <video width="400" controls autoPlay>
                      <source src={selectedContent.fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-content">
                      {selectedContent.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="content-list">
              {filteredContents.map((content) => (
                <div
                  key={content.id}
                  className={`content-item ${content.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleContentClick(content)}
                >
                  <div className="item-info">
                    <h3>{content.title}</h3>
                    <p>{new Date(content.timestamp).toLocaleDateString()}</p>
                    {content.isRead ? (
                      <FaEye className="read-icon" />
                    ) : (
                      <FaEyeSlash className="unread-icon" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserEducation;