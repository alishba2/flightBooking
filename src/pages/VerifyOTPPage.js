import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, mobile } = location.state;  // Get email and mobile from the previous page

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      // Send both email and mobile in the payload
      const payload = { email, mobile, otp };

      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // If OTP is verified, navigate to reset password page with the email
        navigate('/reset-password', { state: { email } });
      } else {
        // Handle incorrect OTP
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('There was a problem verifying the OTP. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Verify OTP</h1>
      <form onSubmit={handleVerifyOTP} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Enter OTP:</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Verify OTP</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
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
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default VerifyOTPPage;
