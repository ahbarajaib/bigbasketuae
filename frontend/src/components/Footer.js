import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-dark py-5 text-light">
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h5>We accept all major credit and debit cards</h5>
            <i
              class="fa-brands fa-cc-visa "
              style={{ "font-size": "48px" }}
            ></i>
            &nbsp;
            <i
              class="fa-brands fa-cc-mastercard "
              style={{ "font-size": "48px" }}
            ></i>
          </div>
        </Row>

        <Row className="flex-column flex-lg-row justify-content-center">
          <Col lg={3} sm={12}>
            <h4>Big Basket UAE</h4>
            <p>Montana building 304 karama, Dubai</p>
            <p>Phone: +971 522512453</p>
          </Col>
          <Col lg={3} sm={12}>
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
          <Col lg={3} sm={12}>
            <h4>Information</h4>
            <ul className="list-unstyled text-light">
              <li>
                <Link to="/aboutus" className="text-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} sm={12}>
            <h4>Follow Us</h4>
            <ul className="list-unstyled m-auto">
              <li>
                <FontAwesomeIcon icon={faFacebook} />
                &nbsp;
                <a
                  href="https://www.facebook.com/people/Bigbasketuaecom/61550970719817/?mibextid=LQQJ4d"
                  className="text-light"
                  target="_blank" // Add target="_blank" to open in a new tab
                  rel="noopener noreferrer" // Add rel="noopener noreferrer" for security
                >
                  Facebook
                </a>
              </li>
              <li>
                <FontAwesomeIcon icon={faInstagram} />
                &nbsp;
                <a
                  href="https://www.instagram.com/bigbasketuaeonlinegrocery/?igsh=OWJtdnBpNTVlemI0&utm_source=qr"
                  className="text-light"
                  target="_blank" // Add target="_blank" to open in a new tab
                  rel="noopener noreferrer" // Add rel="noopener noreferrer" for security
                >
                  Instagram
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
