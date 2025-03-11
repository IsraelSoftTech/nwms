import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import "./EduContent.css";
import app from "../../firebaseConfig";

const db = getDatabase(app);

const EduContent = () => {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showWarning, setShowWarning] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const contentsRef = ref(db, "educational_contents");
    onValue(contentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContents(Object.entries(data).map(([id, content]) => ({ id, ...content })));
      } else {
        setContents([]);
      }
    });
  }, []);

  const handleSave = () => {
    if (!newContent.trim()) return;
    if (editMode) {
      set(ref(db, `educational_contents/${editMode}`), { text: newContent }).then(() => {
        alert("Content Updated");
        setEditMode(null);
      });
    } else {
      const newContentRef = push(ref(db, "educational_contents"));
      set(newContentRef, { text: newContent }).then(() => {
        alert("Content Created");
      });
    }
    setNewContent("");
    setShowModal(false);
  };

  const handleDelete = (id) => {
    remove(ref(db, `educational_contents/${id}`)).then(() => {
      alert("Content Deleted");
      setShowWarning(null);
    });
  };

  return (
    <div className="content-box">
      <div className="edu">
        <h3>Educational Contents</h3>
        <AiOutlinePlusCircle className="add-icon" onClick={() => setShowModal(true)} />
      </div>

      {contents.length === 0 ? (
        <p>No content available. Click the plus icon to add.</p>
      ) : (
        <ul>
          {contents.map(({ id, text }) => (
            <li key={id} onClick={() => setExpandedId(expandedId === id ? null : id)}>
              <span className="content-text" style={{cursor:"pointer"}}>{expandedId === id ? text : text.split("\n")[0]}</span>
              <div className="editDel">
                <FiEdit className="edit-icon" onClick={(e) => { e.stopPropagation(); setEditMode(id); setNewContent(text); setShowModal(true); }} />
                <FiTrash2 className="delete-icon" onClick={(e) => { e.stopPropagation(); setShowWarning(id); }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Enter content..." />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="modal">
          <div className="modal-content">
            <p style={{color:"red",textAlign:"center"}}>Do you want to delete this content?⚠</p>
            <button onClick={() => handleDelete(showWarning)}>Yes</button>
            <button onClick={() => setShowWarning(null)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EduContent;
