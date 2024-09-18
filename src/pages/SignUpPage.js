// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_.]+$/;
    return regex.test(username);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Perform basic validation checks
    if (!validateUsername(username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and periods.';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Remove the "+" sign before sending the mobile number to the server
        const sanitizedMobile = mobile.replace(/\D/g, ''); // Keeps only numbers, removes "+"

        const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, username, email, mobile: sanitizedMobile, password }),
        });

        if (response.ok) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message });
        }
      } catch (error) {
        setErrors({ form: 'There was a problem with the signup process. Please try again.' });
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign Up</h1>
      {errors.form && <p style={styles.error}>{errors.form}</p>}
      <form onSubmit={handleSignUp} style={styles.form}>
        <div style={styles.formGroup}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={styles.input}
          />
          {errors.username && <span style={styles.error}>{errors.username}</span>}
        </div>
        <div style={styles.formGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>
        <div style={styles.formGroup}>
          <PhoneInput
            country={'us'}
            value={mobile}
            onChange={setMobile}
            inputStyle={styles.phoneInput}
            containerStyle={styles.phoneInputContainer}
            buttonStyle={styles.phoneButton}
            inputProps={{
              name: 'mobile',
              required: true,
              autoFocus: true,
              placeholder: 'Mobile Number',
            }}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />
          {errors.password && <span style={styles.error}>{errors.password}</span>}
        </div>
        <div style={styles.formGroup}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={styles.input}
          />
          {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
        </div>
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      <div style={styles.options}>
        <span>Already a user? </span><Link to="/login" style={styles.link}>Login</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    textAlign: 'left',
  },
  input: {
    padding: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  phoneInput: {
    width: '100%',
    height: '40px',
    fontSize: '16px',
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneButton: {
    width: '50px',
    height: '40px',
    position: 'absolute',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  options: {
    marginTop: '20px',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  error: {
    color: 'red',
    fontSize: '0.8em',
  }
};

export default SignUpPage;
