import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import thomasImg from './assets/Thomas.jpg';
import tomasImg from './assets/Tomas.jpg';
import teamFlick from './assets/TeamFlick.jpg';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Thomas Bradford",
      role: "Web Developer",
      bio: "Computer Science student at University of Wisconsin - Madison with a passion for traveling the world.",
      image: thomasImg
    },
    {
      name: "Tomas Sandschafer",
      role: "Web Developer",
      bio: "Computer Science student at University of Wisconsin - Madison with a deep love for exploring different countries and cultures.",
      image: tomasImg
    }
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">About Us</h1>
          <p className="lead text-center mb-5">
            Welcome to our AI Travel Planner! We are passionate about making travel planning effortless and exciting.
          </p>
          <Row className="justify-content-center mb-5">
            <Col md={6}>
              <img src={teamFlick} alt="Team Flick" className="img-fluid rounded" />
            </Col>
          </Row>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to revolutionize the way people plan their trips by leveraging cutting-edge AI technology.
            We believe that everyone deserves a seamless and personalized travel experience, whether you're a seasoned
            traveler or planning your first adventure.
          </p>
          
          <h2>Our Story</h2>
          <p>
            Our journey began while planning a spring break trip to Europe, where we realized how difficult it can be to plan travel on a budget. Inspired by the potential of AI, we built a travel planner that lets users enter simple preferences while the system handles the rest. After just a few weeks of work, we believe we are moving toward changing how people plan their trips.
          </p>
          
          <h2>Meet the Team</h2>
          <Row>
            {teamMembers.map((member, index) => (
              <Col md={6} key={index}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    {member.image && <img src={member.image} alt={member.name} className="img-fluid mb-3" style={{width: '100%', height: '200px', objectFit: 'cover'}} />}
                    <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                    <Card.Text>
                      {member.bio}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
