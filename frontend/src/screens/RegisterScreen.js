import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import uaeFlag from "../images/uaeFlag.png";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";
  // const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    // Remove any non-digit characters from the phone number
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    // Limit the phone number to a maximum of 10 digits
    const limitedPhoneNumber = cleanedPhoneNumber.substring(0, 10);
    setPhoneNumber(limitedPhoneNumber);

    //location removed from below
  }, [userInfo, phoneNumber, redirect, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    //DISPATCH REGISTER
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, phoneNumber, password));
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <img
                src={uaeFlag} // Replace with actual path to the UAE flag image
                alt="UAE Flag"
                style={{ width: "20px", height: "auto" }}
              />
              &nbsp;+971
            </span>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className="mt-3" type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
