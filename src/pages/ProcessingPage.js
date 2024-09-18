import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure queryDetails and flightData from location.state (make sure these exist)
  const { flightData, queryDetails } = location.state || { flightData: [], queryDetails: {} };

  useEffect(() => {
    if (flightData && flightData.length > 0) {
      // Process the flight data for rendering
      const processedFlights = flightData.map(flight => ({
        id: flight.id,
        airline: flight.flight_name,
        flightCode: flight.flight_code,
        stops: flight.stops,
        cabinType: flight.cabinType,
        departure: {
          airport: flight.departureAirport.label,
          city: flight.departureAirport.city,
          country: flight.departureAirport.country.label,
          time: flight.departureAirport.time,
        },
        arrival: {
          airport: flight.arrivalAirport.label,
          city: flight.arrivalAirport.city,
          country: flight.arrivalAirport.country.label,
          time: flight.arrivalAirport.time,
        },
        duration: flight.duration.text,
        price: flight.totals.total,
        currency: flight.currency,
      }));

      // Navigate to the FlightResultsPage with processedFlights and queryDetails
      navigate('/results', { state: { processedFlights, queryDetails } });
    } else {
      // If no flight data, navigate back to homepage or show an error
      navigate('/');
    }
  }, [flightData, queryDetails, navigate]);

  return (
    <div>
      <h1>Processing Flight Data...</h1>
      {/* Optionally, you can add a loader here */}
    </div>
  );
}

export default ProcessingPage;
