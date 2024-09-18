import React, { useEffect, useState } from 'react';
import { Spinner, Container, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userId = user.id; // Adjust based on the structure of your stored user data

        try {
          const response = await fetch(`http://localhost:5000/notifications/${userId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setNotifications(data.notifications);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No user data found');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">Error: {error}</p>;
  }

  return (
    <Container className="mt-10">
      <h1 className="text-start mb-4 mt-6">Notifications</h1> {/* Removed text-center class */}
      {notifications.length === 0 ? (
        <p className="text-center">No notifications found.</p>
      ) : (
        <ListGroup variant="flush">
          {notifications.map((notification) => (
            <ListGroup.Item key={notification._id} className="mb-3">
              <p className="mb-1">{notification.content}</p>
              <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
