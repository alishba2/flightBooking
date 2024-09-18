// src/pages/ManageAccountPage.js
import React, { useState, useEffect } from 'react';

function ManageAccountPage({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // For new password change

  // Fetch user details from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser && parsedUser.email) {
      // Fetch user details from the server
      fetch(`http://localhost:5000/user-details?email=${parsedUser.email}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setFullName(data.fullName);
            setUsername(data.username);
            setMobile(data.mobile);
            setEmail(data.email);
            setPassword('********'); // Placeholder for security
          }
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,       // Email is non-editable, used to identify the user
          fullName,
          username,
          mobile,
          password: newPassword || password,  // Use new password if provided
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Changes saved successfully!');
        setIsEditing(false);  // Disable editing mode after saving
      } else {
        alert(`Failed to save changes: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('An error occurred while saving changes. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Manage Your Account</h1>
      <form style={styles.form}>
        {/* Full Name */}
        <div style={styles.formGroup}>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        {/* Username */}
        <div style={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        {/* Mobile */}
        <div style={styles.formGroup}>
          <label>Mobile:</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        {/* Email (non-editable) */}
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            disabled
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.passwordContainer}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        {/* Change Password (optional) */}
        {isEditing && (
          <div style={styles.formGroup}>
            <label>New Password (Optional):</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={styles.input}
            />
          </div>
        )}

        {/* Edit and Save buttons */}
        <div style={styles.buttonContainer}>
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} style={styles.editButton}>Edit</button>
          ) : (
            <button type="button" onClick={handleSaveChanges} style={styles.saveButton}>Save Changes</button>
          )}
        </div>
      </form>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ManageAccountPage;
