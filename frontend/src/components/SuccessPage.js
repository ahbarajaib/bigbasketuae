import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SuccessIcon from "../images/success.png";

const SuccessPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} className="text-center">
          <div className="checkmark-animation">
            <img src={SuccessIcon} alt="Success" className="checkmark-icon" />
            <h2 className="success-message">Payment Successful!</h2>
          </div>
          <p className="mt-3">Your order has been successfully processed.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;
