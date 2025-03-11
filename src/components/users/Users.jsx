import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import firebaseApp from "../../firebaseConfig"; // Ensure this file exports your initialized Firebase app

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const db = getDatabase(firebaseApp);
  const usersRef = ref(db, "users");

  // Fetch users from Firebase
  useEffect(() => {
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      }
    });
  },);

  // Handle edit
  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
    setShowEditModal(true);
  };

  // Handle save
  const handleSave = async () => {
    await update(ref(db, `users/${editUserId}`), editedUser);
    setEditUserId(null);
    setShowEditModal(false);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    await remove(ref(db, `users/${userToDelete}`));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <section >
      <div className="user-box">
        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <div className="editDel">
                    <FiEdit className="edit-icon" onClick={() => handleEdit(user)} />
                    <FiTrash2
                      className="delete-icon"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setUserToDelete(user.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p style={{color:"red"}}>Do you want to delete this user?</p>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Edit User</h4>
            <input
              type="text" style={{color:"black"}}
              value={editedUser.username || ""}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              placeholder="Enter Name"
            />
            <input
              type="email" style={{color:"black"}}
              value={editedUser.email || ""}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              placeholder="Enter Email"
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Users;
