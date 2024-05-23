import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SuccessIcon from "../images/success.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (sessionId) {
      axiosInstance
        .get(`/payment/status?session_id=${sessionId}`)
        .then((response) => {
          // Extract the payment status from the response data
          const paymentStatus = response.data.payment_status;

          // Update the payment status state
          setPaymentStatus(paymentStatus);
          console.log("Payment status:", paymentStatus);
        })
        .catch((error) => {
          console.error("Error fetching payment status:", error);
        });
    }
  }, [location.search]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

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
