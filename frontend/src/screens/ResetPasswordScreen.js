import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { resetPassword } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';

const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const resetPasswordState = useSelector((state) => state.resetPassword);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  console.log(token)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the resetPassword action with the required parameters
    dispatch(resetPassword(password,token));
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlSearchParams.get('token');
    setToken(tokenFromURL);

  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2>Reset Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="mt-3">
              <Button type="submit" variant="primary">
                Reset Password
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={6}>
          {resetPasswordState.loading && <Loader />}
          {resetPasswordState.success && <p>{resetPasswordState.message}</p>}
          {resetPasswordState.error && <p>{resetPasswordState.error}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordScreen;
