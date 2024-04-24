import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import largeLogo from "../images/logo_medium_horizontal.png";
import smallLogo from "../images/logo_only.png";
import visa from "../images/visa.png";
import mastercard from "../images/mastercard.png";
import instagram from "../images/instagram.png";
import facebook from "../images/facebook.png";
import {
  faFacebook,
  faInstagram,
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="py-5 footer text-light">
      <Container>
        <Row>
          {/* Brand Image and Details */}
          <Col lg={4} md={12} className="mb-4 mb-lg-0">
            {/* Insert your brand image here */}
            <div className="pb-5">
              <Image
                src={largeLogo}
                alt="BigBasket Logo"
                className="logo large-logo"
              />
              <Image
                src={smallLogo}
                alt="BigBasket Logo"
                className="logo small-logo"
              />
            </div>
            <h5 className="text-dark">Big Basket UAE</h5>
            <ul className="list-unstyled">
              <li className="text-dark">Montana building 304 karama, Dubai</li>
              <li className="text-dark">Phone: +971 522512453</li>
            </ul>
          </Col>

          {/* Payment Methods and Social Icons */}
          <Col lg={4} md={12}>
            <h5 className="text-dark">
              We accept all major credit and debit cards
            </h5>
            <div className="payment-icons d-flex justify-content-center gap-2">
              <Image src={visa} alt="visa" className="payment-icon" />
              <Image
                src={mastercard}
                alt="mastercard"
                className="payment-icon"
              />
            </div>
          </Col>
          <Col lg={4} md={12} className="text-lg-right text-md-center">
            <h5 className="text-dark">Follow Us</h5>
            <div className="social-icons d-flex justify-content-center gap-2">
              <Image src={facebook} alt="visa" className="social-icon" />
              <Image src={instagram} alt="mastercard" className="social-icon" />
            </div>
          </Col>
        </Row>

        {/* Additional Links and Info */}
        <hr className="bg-dark" />
        <Row className="justify-content-between">
          <Col lg={3} md={6}>
            <h5 className="text-dark">Customer Service</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/contactus">Contact Us</Link>
              </li>
              <li>
                <Link to="/delivery">Delivery FAQ</Link>
              </li>
              <li>
                <Link to="/returns">Returns</Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-dark">Information</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright Notice */}
        <Row>
          <Col>
            <p className="text-center mb-0 text-dark">
              &copy; {new Date().getFullYear()} Big Basket UAE. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
