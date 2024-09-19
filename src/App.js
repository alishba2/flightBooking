// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';  // Stripe Integration
import { loadStripe } from '@stripe/stripe-js';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google OAuth Provider
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ProcessingPage from './pages/ProcessingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import Footer from "./components/footer";
import UpdatesPage from './pages/UpdatesPage';
import ManageAccountPage from './pages/ManageAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage';
import FlightResultsPage from './pages/FlightResultsPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ConfirmBooking from './pages/ConfirmBooking';
import Confirmation from './pages/Confirmation';
import { AuthProvider } from './context/AuthContext';
import NotificationsPage from './pages/NotificationsPage';
// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51Psj5C07GQO3xPIPjilUjOsVlVATNoTL4thduc4ZIK3USagAzLrl8xTYHva4j0jB44ZoyxzZiSUJ9B6Aa5ELStwc00M4LELpCy');

// Initialize Google OAuth Client ID
const clientId = '785108943658-4g9405tqmbl633dqf6l29qccvu8o1p3r.apps.googleusercontent.com'; // Replace with your Google Client ID

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if a user is already logged in from local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
    }
  }, []);

  // Handle login and store user data (for both Google and email/password login)
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
  };

  // Handle logout and clear user data
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // Clear user data from local storage
  };

  return (
    <GoogleOAuthProvider clientId={clientId}> {/* Wrap the app in GoogleOAuthProvider */}
      <Router>
        <AuthProvider>

          <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/manage-account" element={<ManageAccountPage user={user} />} />
            <Route path='/notification' element={<NotificationsPage />} />

            {/* The FlightResultsPage route */}
            <Route path="/results" element={<FlightResultsPage />} />

            {/* Confirmation and Payment Routes */}
            <Route
              path="/confirmation"
              element={
                <Elements stripe={stripePromise}>
                  <Confirmation />
                </Elements>
              }
            />

            <Route
              path="/confirm-booking"
              element={
                <Elements stripe={stripePromise}>
                  <ConfirmBooking />
                </Elements>
              }
            />
          </Routes>

          <Footer />

        </AuthProvider>

      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
