import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Custom styles
import { FaPlane, FaShieldAlt, FaCalendarCheck } from 'react-icons/fa'; // Importing react-icons

function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [adult, setAdult] = useState(1);
  const [type, setType] = useState('Economy');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear any previous error

    const formData = {
      from,
      to,
      date,
      adult,
      type,
      currency,
    };

    localStorage.setItem('flightSearchData', JSON.stringify(formData));

    const queryString = `from=${from}&to=${to}&date=${date}&adult=${adult}&type=${type.toLowerCase()}&currency=${currency}`;

    const options = {
      method: 'GET',
      url: `https://flight-fare-search.p.rapidapi.com/v2/flights/?${queryString}`,
      headers: {
        'x-rapidapi-key': 'f65353d2bcmsh2c337edd6b75b91p118ba4jsn0d6da9b33674',
        'x-rapidapi-host': 'flight-fare-search.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response, 'response');
      navigate('/results', { state: { flightData: response.data } });
    } catch (error) {
      console.error('Failed to fetch flight data:', error);
      setError('Failed to fetch flight data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <>


      <div className='home-body'>
        <div className="overlay"></div>
        <div className="content-container">
          <h2>Welcome to AeroOptimize</h2>
          <p>Search for your flights now!</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group-row">
              <div className="form-group">
                {/* <label>From</label> */}
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From (e.g. ISB)"
                  required
                />
              </div>
              <div className="form-group">
                {/* <label>To</label> */}
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To (e.g. LHR)"
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                {/* <label>Date</label> */}
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                {/* <label>Adults</label> */}
                <input
                  type="number"
                  value={adult}
                  onChange={(e) => setAdult(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                {/* <label>Class</label> */}
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="form-group">
                {/* <label>Currency</label> */}
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  Search Flights
                </>
              )}
            </button>

          </form>

        </div>


      </div>
      <section className="why-choose-us">
        <h3>Why Choose Us</h3>
        <div className="benefits">
          <div className="benefit">
            <FaPlane className="icon" />
            <h4>Best Price Guarantee</h4>
            <p>We ensure you get the best deals on your flight bookings.</p>
          </div>
          <div className="benefit">
            <FaShieldAlt className="icon" />

            <h4>Safe and Secure</h4>
            <p>Your information is protected with the highest security standards.</p>
          </div>
          <div className="benefit">
            <FaCalendarCheck className="icon" />
            <h4>Flexible Bookings</h4>
            <p>Make changes to your flight bookings easily and hassle-free.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h3>What Our Customers Say</h3>
        <div className="review-list">
          <div className="review">
            <p>"AeroOptimize made booking my flight so easy! Highly recommend."</p>
            <p>- Sarah W.</p>
          </div>
          <div className="review">
            <p>"The best customer service I've experienced in a long time!"</p>
            <p>- John D.</p>
          </div>
          <div className="review">
            <p>"I found the best flight prices, and it was so quick."</p>
            <p>- Emma R.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
