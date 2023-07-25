import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-dark py-5 text-light">
      <Container>
        <Row>
          <Col lg={3}>
            <h4>Big Basket UAE</h4>
            <p>Montana building 304 karama, Dubai</p>
            <p>Phone: +971 522512453</p>
          </Col>
          <Col lg={3}>
            <h4>Customer Service</h4>
            <ul className="list-unstyled text-light">
              <li>
                <Link to="/contactus" className="text-light">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-light">
                  Delivery FAQ
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-light">
                  Returns
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3}>
            <h4>Information</h4>
            <ul className="list-unstyled text-light">
              <li>
                <Link to="/aboutus" className="text-light">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-light">
                  Returns
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3}>
            <h4>Follow Us</h4>
            <ul className="list-unstyled">
              <li>
                <a href="/#" className="text-light">
                  Facebook
                </a>
              </li>
              <li>
                <a href="/#" className="text-light">
                  Twitter
                </a>
              </li>
              <li>
                <a href="/#" className="text-light">
                  Instagram
                </a>
              </li>
              <li>
                <a href="/#" className="text-light">
                  Pinterest
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col>
            <p className="text-center mb-0">
              &copy; 2023 Big Basket UAE. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
