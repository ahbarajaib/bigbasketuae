import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrder } from "../actions/orderActions";
import uaeFlag from "../images/uaeFlag.png";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  //const location = useLocation()
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  //const redirect = location.search ? location.search.split('=')[1] : '/'
  // const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrder());
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [dispatch, userInfo, user, navigate]);
  function formatDateTime(dateTimeStr) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = new Date(dateTimeStr).toLocaleString(
      "en-GB",
      options
    );
    return formattedDate;
  }

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Allow only digits to be entered
    const filteredInput = input.replace(/[^\d]/g, "");
    if (filteredInput.length <= 10) {
      setPhoneNumber(filteredInput);
    }
  };

  const filteredAndSortedOrders = orders
    ? orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const submitHandler = (e) => {
    e.preventDefault();
    // Validate phone number length and content
    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Phone number must be exactly 10 digits and numeric.");
      return; // Stop submission if validation fails
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({ id: user._id, name, email, phoneNumber, password })
      );
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
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
            <Form.Label>Phone Number (10 digits required)</Form.Label>
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
                onChange={handlePhoneNumberChange}
                pattern="\d*"
                maxLength="10"
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

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>PAYMENT</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>AED {order.totalPrice}</td>
                  <td>{order.status}</td>
                  <td
                    style={{
                      backgroundColor:
                        order.paymentMethod === "Cash on Delivery"
                          ? "#ffc107" // Yellow for COD
                          : order.paymentMethod === "Bring Swiping Machine"
                          ? "#007bff" // Blue for Swipe
                          : order.paymentMethod === "Card Payment" &&
                            order.isPaid
                          ? "#28a745" // Green for Paid
                          : order.paymentMethod === "Card Payment" &&
                            !order.isPaid
                          ? "#dc3545" // Red for Failed
                          : "transparent", // Default background color
                      color:
                        order.paymentMethod === "Bring Swiping Machine"
                          ? "#fff"
                          : "#000", // White text for Swipe, black for others
                    }}
                  >
                    {order.paymentMethod === "Cash on Delivery"
                      ? "COD"
                      : order.paymentMethod === "Bring Swiping Machine"
                      ? "Swipe"
                      : order.paymentMethod === "Card Payment" && order.isPaid
                      ? "Paid"
                      : order.paymentMethod === "Card Payment" && !order.isPaid
                      ? "Failed"
                      : order.paymentMethod}
                  </td>
                  <td
                    style={{
                      backgroundColor: order.isDelivered
                        ? "lightgreen"
                        : "lightcoral",
                    }}
                  >
                    {order.isDelivered ? "Delivered" : "Not Delivered"}
                  </td>
                  <td>
                    <LinkContainer to={`/orders/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
