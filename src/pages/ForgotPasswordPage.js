import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';  // Using the PhoneInput package for formatted input

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  // Function to handle OTP via Email after checking both email and mobile in the database
  const handleEmailOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/forgot-password-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mobile }),  // Send both email and mobile to the backend
      });

      if (response.ok) {
        // Proceed to OTP verification if both email and mobile are correct
        navigate('/verify-otp', { state: { email } });
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('There was a problem. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Forgot Password</h1>
      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Mobile Number:</label>
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
            }}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={handleEmailOtp} style={styles.button}>
            Receive OTP via Email
          </button>
        </div>
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
  phoneInput: {
    width: '100%',
    paddingLeft: '50px',
    paddingRight: '10px',
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',  // Center the button since there's only one now
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

export default ForgotPasswordPage;
