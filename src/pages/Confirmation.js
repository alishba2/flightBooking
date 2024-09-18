import React from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './ConfirmBooking.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Psj5C07GQO3xPIPjilUjOsVlVATNoTL4thduc4ZIK3USagAzLrl8xTYHva4j0jB44ZoyxzZiSUJ9B6Aa5ELStwc00M4LELpCy');

function Confirmation() {
  const location = useLocation();
  const { selectedFlight } = location.state || {};

  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (!selectedFlight) {
    return <div>No flight selected.</div>;
  }

  const handlePayment = async () => {
    const stripe = await stripePromise;

    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: selectedFlight.totals.total * 100, // Send price in cents
          currency: selectedFlight.currency,
        }),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error('Failed to create Stripe session');
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error('Error redirecting to Stripe:', result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="confirmation-container">
      <h1>Confirm Your Booking</h1>

      <div className="confirmation-content">
        {/* Left side: User and flight information */}
        <div className="flight-summary">
          <div className="user-info">
            <p><strong>Booked by:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="flight-details">
            <h2>{selectedFlight.flight_name} ({selectedFlight.flight_code})</h2>
            <p><strong>From:</strong> {selectedFlight.departureAirport.label} ({selectedFlight.departureAirport.code})</p>
            <p><strong>To:</strong> {selectedFlight.arrivalAirport.label} ({selectedFlight.arrivalAirport.code})</p>
            <p><strong>Departure:</strong> {new Date(selectedFlight.departureAirport.time).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(selectedFlight.arrivalAirport.time).toLocaleString()}</p>
            <p><strong>Price:</strong> {selectedFlight.totals.total.toFixed(2)} {selectedFlight.currency}</p>
          </div>
        </div>

        {/* Right side: Payment button */}
        <div className="payment-form">
          <h2>Payment Information</h2>
          <button onClick={handlePayment}>Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
