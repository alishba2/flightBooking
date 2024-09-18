import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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


    </Container>
  );
}

export default AboutPage;
