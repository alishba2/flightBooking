import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState(null);
  const [previousPrices, setPreviousPrices] = useState({});

  // Check if a user is already logged in from local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // Fetch subscriptions when the user changes
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:5000/subscriptions/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log(data, "data subscription");
            setSubscriptions(data);
          } else {
            const errorData = await response.json();
            setError(`Failed to fetch subscriptions: ${errorData.message}`);
          }
        } catch (err) {
          setError('Error fetching subscriptions: ' + err.message);
        }
      }
    };

    fetchSubscriptions();
  }, [user]);

  // Fetch flight prices sequentially
  useEffect(() => {
    const checkPrices = async () => {
      for (const subscription of subscriptions) {
        console.log(subscription, "subscription each data");

        const queryString = `from=${subscription.queryDetails.from}&to=${subscription.queryDetails.to}&date=${subscription.queryDetails.date}&adult=${subscription.queryDetails.passengers}&type=${subscription.queryDetails.travelClass.toLowerCase()}&currency=${subscription.queryDetails.currency}`;

        const options = {
          method: 'GET',
          url: `https://flight-fare-search.p.rapidapi.com/v2/flights/?${queryString}`,
          headers: {
            'x-rapidapi-key': 'fa176da5f0msh86b776644581d11p1941f7jsn975012d9655e',
            'x-rapidapi-host': 'flight-fare-search.p.rapidapi.com',
          },
        };

        try {
          const response = await axios.request(options);
          const flights = response.data; // Adjust according to the response structure
          console.log('Flight details:', flights);

          // Find the minimum price from the flights
          let minPrice = Infinity;
          let minPriceFlight = null;

          for (const flight of flights.results) {
            console.log(flight, "priceeeeeeeeeeeeeee");
            console.log(minPrice, "flight priceeeeeee");
            if (flight.totals.total < minPrice) {
              minPrice = flight.totals.total;
              minPriceFlight = flight;
            }
          }

          console.log(minPrice, subscription?.previousPrice, "price valuees");
          // Check if the minimum price is lower than the subscribed price
          if (minPrice < subscription?.previousPrice) {
            const content = `Flight from ${subscription.queryDetails.from} to ${subscription.queryDetails.to} is now available at a cheaper price. Details have been sent to your email.`;
            console.log(content, "content");

            // Send notification
            try {
              const notificationResponse = await fetch('http://localhost:5000/notifications', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: user.id,
                  content,
                }),
              });

              if (notificationResponse.ok) {

                console.log('Notification sent successfully!');
              } else {
                const notificationError = await notificationResponse.json();
                console.error('Failed to send notification:', notificationError.message);
              }
            } catch (notificationError) {
              console.error('Error sending notification:', notificationError);
            }

            // Send email with flight details
            try {
              const emailResponse = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email,
                  subject: `Flight Price Drop Alert: ${subscription.queryDetails.from} to ${subscription.queryDetails.to}`,
                  text: `Flight from ${subscription.queryDetails.from} to ${subscription.queryDetails.to} is now available at a cheaper price of ${minPrice}. Check the details on the flight search platform.`,
                }),
              });

              if (emailResponse.ok) {

                console.log('Email sent successfully!');
              } else {
                const emailError = await emailResponse.json();
                console.error('Failed to send email:', emailError.message);
              }
            } catch (emailError) {
              console.error('Error sending email:', emailError);
            }

            console.log('Price drop detected:', minPriceFlight);
          }
        } catch (error) {
          // alert("price drop not detected");
          console.error('Error fetching flight prices:', error);
        }
      }
    };

    // Run checkPrices every 5 minutes
    const intervalId = setInterval(() => {
      if (subscriptions.length > 0) {
        checkPrices();
      }
    }, 43200000); // 12 hours in milliseconds


    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [subscriptions, user]);

  return (
    <AuthContext.Provider value={{ user, setUser, subscriptions, error }}>
      {children}
    </AuthContext.Provider>
  );
};
