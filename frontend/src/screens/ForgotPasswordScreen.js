import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { forgotPassword } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const forgotPasswordState = useSelector((state) => state.forgotPassword);
  const [email, setEmail] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email))
       
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>



            <div className="mt-3">
              <Button type="submit" variant="primary">
                Send Reset Password Email
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={6}>
          {forgotPasswordState.loading && <Loader />}
          {forgotPasswordState.success && <p>{forgotPasswordState.message}</p>}
          {forgotPasswordState.error && <p>{forgotPasswordState.error}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordScreen;
