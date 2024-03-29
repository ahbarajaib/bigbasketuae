import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const ContactUs = () => {
  return (
    <section className="bg-light py-5">
      <Container>
        <Row>
          <Col lg={8}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns, please feel free to contact
              us using the information below:
            </p>
            <ul className="list-unstyled">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@bigbasketuae.com">
                  support@bigbasketuae.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+971-522-512-2453">+971 522512453</a>
              </li>
            </ul>
          </Col>
          <Col lg={4}>
            <img
              src="contact-us-image.jpg"
              alt="Contact Us"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactUs;
