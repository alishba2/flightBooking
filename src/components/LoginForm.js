// src/components/LoginForm.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm({ onLogin }) {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the loading spinner

    try {
      if (loginMethod === 'email') {
        await onLogin({ email, password }); // Pass the entered email and password
      } else {
        await onLogin({ phone, password }); // Pass the entered phone and password
      }

      // Reload the page after a successful login
      window.location.reload();
    } catch (error) {
      // Handle any errors here
      console.error("Login failed:", error);
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 border rounded shadow-sm bg-light">
      <div className="mb-3">
        <div className="row">
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="emailLogin"
                value="email"
                checked={loginMethod === 'email'}
                onChange={() => setLoginMethod('email')}
              />
              <label className="form-check-label" htmlFor="emailLogin">
                Login with Email
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="phoneLogin"
                value="phone"
                checked={loginMethod === 'phone'}
                onChange={() => setLoginMethod('phone')}
              />
              <label className="form-check-label" htmlFor="phoneLogin">
                Login with Phone
              </label>
            </div>
          </div>
        </div>
      </div>

      {loginMethod === 'email' && (
        <div className="mb-3">
          <input
            type="email"
            id="emailInput"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </div>
      )}

      {loginMethod === 'phone' && (
        <div className="mb-3">
          <input
            type="tel"
            id="phoneInput"
            className="form-control"
            placeholder='Phone Number'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <input
          type="password"
          id="passwordInput"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        style={{ background: '#28a745', border: '1px solid #28a745' }}
        disabled={loading} // Disable the button while loading
      >
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
