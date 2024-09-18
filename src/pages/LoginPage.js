// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LoginForm from '../components/LoginForm';
import axios from 'axios';  // Use axios for easier API calls

function LoginPage({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle form-based login
  const handleLogin = async ({ email, phone, password }) => {
    const loginData = email ? { email, password } : { phone, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        setErrorMessage(''); // Clear any previous error messages
        onLogin(data.user);  // Pass the user data to App.js to manage session
        navigate('/');       // Redirect to home page after login
      } else {
        // Handle login failure
        setErrorMessage(data.message || 'Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('There was a problem logging in. Please try again later.');
    }
  };

  // Handle successful Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/google-login', {
        token: credentialResponse.credential,
      });

      const data = response.data;
      if (response.status === 200) {
        setErrorMessage(''); // Clear error message if Google login is successful
        onLogin(data.user); // Pass user data to the parent component (App.js)
        navigate('/'); // Redirect to home page
      } else {
        setErrorMessage('Google login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('There was a problem with Google login. Please try again later.');
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = (error) => {
    console.error('Google login error:', error);
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login</h1>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      <LoginForm onLogin={handleLogin} />

      <div style={styles.googleButton}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}  // Handle Google login success
          onError={handleGoogleFailure}    // Handle Google login failure
          useOneTap
        />
      </div>

      <div style={styles.options}>
        <a href="/forgot-password" style={styles.link}>Forgot Password?</a>
        <a href="/signup" style={styles.link}>Sign Up</a>
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
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    marginBottom: '20px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
  googleButton: {
    marginTop: '20px',

  },
  options: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },

};

export default LoginPage;
