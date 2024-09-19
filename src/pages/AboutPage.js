import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaRocket, FaCogs, FaChartLine } from 'react-icons/fa'; // Example icons
import "./AboutPage.scss";

function AboutPage() {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-primary text-center mb-4">About Us</h1>
          <p className="lead text-center mb-5">
            Welcome to <span className="fw-bold text-primary">AeroOptimize</span>! We provide cutting-edge solutions to optimize aerospace engineering workflows and streamline flight operations.
          </p>
        </Col>
      </Row>

      <Row className="mb-4 mission">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title className="text-secondary">Our Mission</Card.Title>
              <Card.Text>
                Our mission is to optimize every aspect of aerospace operations, from flight planning to maintenance. We provide advanced tools for data analysis, workflow automation, and real-time decision-making to ensure that engineers and operators can achieve the highest levels of performance and safety.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Benefits Section */}
      <Row className="mb-5 benefits">
        <Col md={4}>
          <Card className="benefit-card">
            <Card.Body className="text-center">
              <FaRocket size={40} className="benefit-icon" />
              <Card.Title>Faster Operations</Card.Title>
              <Card.Text>
                Streamline flight operations with advanced tools designed to increase speed and reduce inefficiencies.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="benefit-card">
            <Card.Body className="text-center">
              <FaCogs size={40} className="benefit-icon" />
              <Card.Title>Automated Workflows</Card.Title>
              <Card.Text>
                Automate repetitive tasks and focus on the important aspects of aerospace engineering with ease.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="benefit-card">
            <Card.Body className="text-center">
              <FaChartLine size={40} className="benefit-icon" />
              <Card.Title>Data-Driven Insights</Card.Title>
              <Card.Text>
                Make informed decisions with real-time data and analytics at your fingertips for better outcomes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
