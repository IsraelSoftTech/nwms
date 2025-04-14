import React, { useState, useEffect } from 'react';
import './AdminEducation.css';
import {
  FaBars,
  FaBell,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaSearch,
  FaGraduationCap,
  FaCommentAlt,
  FaTimes,
  FaTrash,
  FaEdit,
  FaPlay
} from "react-icons/fa";
import { MdDashboard, MdReportProblem } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import { database, ref, set, get } from "../../firebase";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminEducation = () => {
  const [showAddContent, setShowAddContent] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [contents, setContents] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const storage = getStorage(); // Initialize Firebase Storage

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
        const contentArray = Object.entries(data).map(([id, content]) => ({ id, ...content }));
        setContents(contentArray.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setContents([]);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      setError('Failed to load contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contentData = {
        title: title.trim(),
        content: content.trim(),
        timestamp: Date.now(),
        status: 'unread'
      };

      if (editingContent) {
        // Update existing content
        await set(ref(database, `education/${editingContent.id}`), contentData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Add new content
        const newContentId = Date.now().toString();
        await set(ref(database, `education/${newContentId}`), contentData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      // Reset form
      setTitle('');
      setContent('');
      setShowAddContent(false);
      setEditingContent(null);
      await fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoFile) {
      setError('Please provide a title and select a video file');
      return;
    }

    try {
      setLoading(true);
      const storageRefPath = storageRef(storage, `videos/${videoFile.name}`);

      // Upload the video file to Firebase Storage
      await uploadBytes(storageRefPath, videoFile);
      const videoURL = await getDownloadURL(storageRefPath); // Get the downloadable URL

      const videoData = {
        title: videoTitle.trim(),
        fileUrl: videoURL, // Save the downloadable URL
        timestamp: Date.now(),
      };

      const newVideoId = Date.now().toString();
      await set(ref(database, `education/${newVideoId}`), videoData); // Save as content
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setVideoTitle('');
      setVideoFile(null);
      setShowAddVideo(false);
      await fetchContents();
    } catch (error) {
      console.error('Error saving video:', error);
      setError('Failed to save video. Please try again.');
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      setLoading(true);
      await set(ref(database, `education/${id}`), null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (content) => {
    setEditingContent(content);
    setTitle(content.title);
    setContent(content.content);
    setShowAddContent(true);
    setError(null);
  };

  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Success Message Component
  const SuccessMessage = () => (
    <div className="success-message">
      Content {editingContent ? 'updated' : 'added'} successfully!
    </div>
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
              <MdDashboard  /> Dashboard
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
          <li className="active">
            <Link to="/admin-education" className="link-no-style">
              <FaGraduationCap className="side-icon"/> Education
            </Link>
          </li>
          <li>
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
        {showSuccess && <SuccessMessage />}
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
                  <h3>Create readable Contents</h3>
                </div>
                <div className="title-count">
                  <h3>{filteredContents.length}</h3>
                  <span className="count">Contents</span>
                </div>
              </div>
              <button 
                className="add-content-btn" style={{marginTop:"30px"}}
                onClick={() => {
                  setShowAddContent(true);
                  setEditingContent(null);
                  setTitle('');
                  setContent('');
                  setError(null);
                }}
              >
                + Add New Content
              </button>
            </div>
            {/* Video Content Button */}
            <div className="content-card educational">
              <div className="card-header">
                <div className="icon-title">
                  <div className="content-icon">
                    <FaGraduationCap />
                  </div>
                  <h3>Create Video Contents</h3>
                </div>
                <div className="title-count">
                  <h3>{filteredContents.filter(content => content.fileUrl).length}</h3>
                  <span className="count">Videos</span>
                </div>
              </div>
              <button 
                className="add-content-btn" style={{marginTop:"30px"}}
                onClick={() => {
                  setShowAddVideo(true);
                  setVideoTitle('');
                  setVideoFile(null);
                  setError(null);
                }}
              >
                + Add Video Content
              </button>
            </div>
          </div>

          {/* Add/Edit Content Form */}
          {showAddContent && (
            <div className="content-form">
              <h2>{editingContent ? 'Edit Content' : 'Add New Content'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-fields">
                  <input
                    type="text"
                    className="content-input"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="content-textarea"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddContent(false);
                      setEditingContent(null);
                      setTitle('');
                      setContent('');
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingContent ? 'Update' : 'Save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Video Form */}
          {showAddVideo && (
            <div className="content-form">
              <h2>Add New Video</h2>
              <form onSubmit={handleVideoSubmit}>
                <div className="form-fields">
                  <input
                    type="text"
                    className="content-input"
                    placeholder="Video Title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddVideo(false);
                      setVideoTitle('');
                      setVideoFile(null);
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Video'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contents List */}
          <div className="contents-list-container">
            <h2>All Contents</h2>
            {loading ? (
              <div className="loading">Loading contents...</div>
            ) : filteredContents.length === 0 ? (
              <div className="no-contents">No contents found</div>
            ) : (
              <div className="contents-list">
                {filteredContents.map((content, index) => (
                  <div 
                    key={content.id} 
                    className={`content-item ${index % 2 === 0 ? 'alternate' : ''}`}
                  >
                    <div className="content-title">
                      <h3>{content.title}</h3>
                      <p>{new Date(content.timestamp).toLocaleDateString()}</p>
                      {content.fileUrl && (
                        <button className="play-btn" onClick={() => {
                          const videoElement = document.createElement('video');
                          videoElement.src = content.fileUrl;
                          videoElement.controls = true;
                          videoElement.style.width = '100%';
                          videoElement.style.maxHeight = '400px';
                          const videoContainer = document.createElement('div');
                          videoContainer.appendChild(videoElement);
                          const modal = document.createElement('div');
                          modal.style.position = 'fixed';
                          modal.style.top = '0';
                          modal.style.left = '0';
                          modal.style.width = '100%';
                          modal.style.height = '100%';
                          modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                          modal.style.display = 'flex';
                          modal.style.alignItems = 'center';
                          modal.style.justifyContent = 'center';
                          modal.appendChild(videoContainer);
                          modal.onclick = () => document.body.removeChild(modal);
                          document.body.appendChild(modal);
                          videoElement.play();
                        }}>
                          <FaPlay /> Watch
                        </button>
                      )}
                    </div>
                    <div className="content-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleContentClick(content)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(content.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEducation;