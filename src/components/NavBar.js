import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { BsBell } from 'react-icons/bs'; // Importing a notification icon from react-icons
import logo from "../assets/logo2.png"; // Importing the logo

function NavBar({ isLoggedIn, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const navigate = useNavigate();

  // Load the user details (including name or email) from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserDisplayName(parsedUser.fullName || parsedUser.username || parsedUser.email);
    }
  }, [isLoggedIn]);

  // Handle logout
  const handleLogoutClick = () => {
    onLogout(); // This will clear the session in App.js
    navigate('/login');  // Redirect to login after sign-out
  };

  return (
    <Navbar style={{ background: "#38598b", height: '120px', overflow: 'hidden' }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          {/* Logo as Navbar Brand */}
          <img style={{ overflow: 'hidden' }} src={logo} height={130} width={130} alt="AeroOptimize Logo" />
          {/* <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AeroOptimize</span> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: 'white' }}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" style={{ color: 'white' }}>About Us</Nav.Link>
          </Nav>

          {isLoggedIn ? (
            <Nav>
              <Nav.Link as={Link} to="/notification" style={{ color: 'white' }}>
                <BsBell style={{ fontSize: '1.7rem' }} />
              </Nav.Link>
              <NavDropdown title={userDisplayName} id="user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/manage-account">Manage Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Button} onClick={handleLogoutClick}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login" style={{ color: 'white' }}>Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
