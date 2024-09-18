import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Assuming you have custom styles

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
      setError('Failed to fetch flight data. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className='home-body'>
      <Container className="homepage-container mt-5">
        <Row className="justify-content-center">
          <Col className='column' md={8}>
            <Card className="shadow p-4 home-card">
              <h1 className="text-center mb-4">Search Flights</h1>
              {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formFrom">
                      <Form.Label>From</Form.Label>
                      <Form.Control
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="From (e.g. ISB)"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formTo">
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="To (e.g. LHR)"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formAdult">
                      <Form.Label>Adults</Form.Label>
                      <Form.Control
                        type="number"
                        value={adult}
                        onChange={(e) => setAdult(e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formType">
                      <Form.Label>Class</Form.Label>
                      <Form.Control
                        as="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="Economy">Economy</option>
                        <option value="Business">Business</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formCurrency">
                      <Form.Label>Currency</Form.Label>
                      <Form.Control
                        as="select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button style={{ background: '#28a745', border: '1px solid #28a745' }} variant="primary" type="submit" className="mt-3" disabled={loading}>
                    {loading ? <Spinner animation="border" /> : 'Search Flights'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
