import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Alert, ListGroup, Dropdown } from 'react-bootstrap';
import { FaPlane, FaTag, FaCalendarDay, FaList, FaThLarge, FaBell } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FlightResultsPage.css';  // Custom CSS for additional styles

function FlightResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightData } = location.state || { flightData: [] };  // Fallback if no data
  const [user, setUser] = useState([]);
  const [lowestPrice, setLowestPrice] = useState(null); // State to store the lowest price
  const [view, setView] = useState('card'); // State to toggle between 'card' and 'list' views
  const [sortOrder, setSortOrder] = useState('asc'); // State to sort by price
  const [showAlert, setShowAlert] = useState(false); // State to show/hide alert
  const [alertMessage, setAlertMessage] = useState(''); // State to store alert message

  // Use useMemo to calculate the flights once, only when flightData changes
  const flights = useMemo(() => flightData.results || [], [flightData]);

  // Sort flights based on price and order
  const sortedFlights = useMemo(() => {
    return flights.sort((a, b) => sortOrder === 'asc'
      ? a.totals.total - b.totals.total
      : b.totals.total - a.totals.total
    );
  }, [flights, sortOrder]);

  // Calculate the lowest price flight when the component loads
  useEffect(() => {
    if (sortedFlights.length > 0) {
      const minPrice = Math.min(...sortedFlights.map(flight => flight.totals.total));
      setLowestPrice(minPrice);  // Set the lowest price in state
    }
  }, [sortedFlights]);

  // Check if a user is already logged in from local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleGetNotified = async () => {
    const queryDetails = JSON.parse(localStorage.getItem('flightSearchData')); // Fetch form data from localStorage

    // Check if queryDetails is available
    if (!queryDetails) {
      setAlertMessage('Query details are not available. Please try again.');
      setShowAlert(true);
      return;
    }

    // Ensure user is logged in and has an id
    if (!user?.id) {
      setAlertMessage('Please log in to subscribe to notifications.');
      setShowAlert(true);
      return;
    }

    // Prepare the notification data
    const notificationData = {
      userId: user.id,  // Ensure userId is included
      from: queryDetails.from,
      to: queryDetails.to,
      date: queryDetails.date,
      passengers: queryDetails.adult,  // Assuming "adult" holds the passenger count
      travelClass: queryDetails.type,  // Assuming "type" holds the travel class (Economy/Business)
      currency: queryDetails.currency,
      lowestPrice, // Include the lowest price in the data being sent
    };

    try {
      const response = await fetch('http://localhost:5000/subscribe-flight-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        setAlertMessage('You will be notified when cheaper flights are available!');
        setShowAlert(true);
      } else {
        const errorData = await response.json();
        setAlertMessage('Failed to save flight query: ' + errorData.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error subscribing for notifications:', error);
      setAlertMessage('An error occurred while subscribing to notifications. Please try again.');
      setShowAlert(true);
    }
  };

  // Handle the booking process
  const handleBook = (flight) => {
    const isLoggedIn = localStorage.getItem('user');  // Assuming 'user' is stored in localStorage

    if (isLoggedIn) {
      navigate('/confirmation', { state: { selectedFlight: flight } });
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  return (
    <Container className="mt-5 flight-results-container">
      <div className="d-flex justify-content-between mb-4 align-items-center">
        {/* Get Notified Button with Bell Icon */}
        {flights.length > 0 && (
          <Button
            className="notify-button"
            onClick={handleGetNotified}
            variant="warning"
          >
            <FaBell /> Get Notified
          </Button>
        )}

        {/* Dropdown for View and Sort Options */}
        <div className="d-flex">
          {/* <Dropdown className="me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <FaThLarge /> {view === 'card' ? 'Card View' : 'List View'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setView('card')}><FaThLarge /> Card View</Dropdown.Item>
              <Dropdown.Item onClick={() => setView('list')}><FaList /> List View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <FaTag /> Sort by Price ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortOrder('asc')}>Ascending</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOrder('desc')}>Descending</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Bootstrap Alert */}
      {showAlert && (
        <Alert variant={alertMessage.includes('Failed') ? 'danger' : 'success'} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <h1 className="text-center mb-4">Flight Results</h1>

      {sortedFlights.length > 0 ? (
        view === 'card' ? (
          <Row>
            {sortedFlights.map((flight, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="flight-card">
                  <Card.Body>
                    <Card.Title>
                      <FaPlane className="icon" /> {flight.flight_name} ({flight.flight_code})
                    </Card.Title>
                    <Card.Text>
                      <div>
                        <FaTag className="icon" /> <strong>From:</strong> {flight.departureAirport.label} ({flight.departureAirport.code})
                      </div>
                      <div>
                        <FaTag className="icon" /> <strong>To:</strong> {flight.arrivalAirport.label} ({flight.arrivalAirport.code})
                      </div>
                      <div>
                        <FaCalendarDay className="icon" /> <strong>Stops:</strong> {flight.stops}
                      </div>
                      <div>
                        <strong>Duration:</strong> {flight.duration.text}
                      </div>
                      <div>
                        <strong>Departure:</strong> {new Date(flight.departureAirport.time).toLocaleString()}
                      </div>
                      <div>
                        <strong>Arrival:</strong> {new Date(flight.arrivalAirport.time).toLocaleString()}
                      </div>
                      <div>
                        <strong>Price:</strong> {flight.totals.total.toFixed(2)} {flight.currency}
                      </div>
                      {flight.baggage && (
                        <div>
                          {flight.baggage.cabin && (
                            <div>
                              <strong>Cabin Baggage:</strong> {flight.baggage.cabin.text}
                            </div>
                          )}
                          {flight.baggage.checkIn ? (
                            <div>
                              <strong>Check-in Baggage:</strong> {flight.baggage.checkIn.text}
                            </div>
                          ) : (
                            <div>
                              <strong>Check-in Baggage:</strong> No check-in baggage included
                            </div>
                          )}
                        </div>
                      )}
                    </Card.Text>
                    <Button className="book-button" onClick={() => handleBook(flight)} variant="success">
                      Book
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <ListGroup>
            {sortedFlights.map((flight, index) => (
              <ListGroup.Item key={index} className="flight-list-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <FaPlane className="icon" /> {flight.flight_name} ({flight.flight_code})
                    <br />
                    <FaTag className="icon" /> <strong>From:</strong> {flight.departureAirport.label} ({flight.departureAirport.code})
                    <br />
                    <FaTag className="icon" /> <strong>To:</strong> {flight.arrivalAirport.label} ({flight.arrivalAirport.code})
                    <br />
                    <FaCalendarDay className="icon" /> <strong>Stops:</strong> {flight.stops}
                    <br />
                    <strong>Duration:</strong> {flight.duration.text}
                    <br />
                    <strong>Departure:</strong> {new Date(flight.departureAirport.time).toLocaleString()}
                    <br />
                    <strong>Arrival:</strong> {new Date(flight.arrivalAirport.time).toLocaleString()}
                    <br />
                    <strong>Price:</strong> {flight.totals.total.toFixed(2)} {flight.currency}
                    <br />
                    {flight.baggage && (
                      <div>
                        {flight.baggage.cabin && (
                          <div>
                            <strong>Cabin Baggage:</strong> {flight.baggage.cabin.text}
                          </div>
                        )}
                        {flight.baggage.checkIn ? (
                          <div>
                            <strong>Check-in Baggage:</strong> {flight.baggage.checkIn.text}
                          </div>
                        ) : (
                          <div>
                            <strong>Check-in Baggage:</strong> No check-in baggage included
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button className="book-button" onClick={() => handleBook(flight)} variant="success">
                    Book
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      ) : (
        <Alert variant="info" className="text-center">No flights found for the selected criteria.</Alert>
      )}
    </Container>
  );
}

export default FlightResultsPage;
