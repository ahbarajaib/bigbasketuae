import React, { useState, useEffect } from "react";

import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ListGroup, Image, Card, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, deliverOrder } from "../actions/orderActions";

import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = (history) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  //loadingPay is just a rename because its used above
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    //calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      (order.itemsPrice = order.orderItems.reduce(
        (acc, item) => acc + item.selectedPrice * item.noOfProducts,
        0
      ))
    );
    order.shippingPrice = addDecimals(order.shippingPrice);
    order.taxPrice = addDecimals(order.taxPrice);
    order.totalPrice = addDecimals(order.totalPrice);
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!order || successPay || successDeliver) {
      //if you don't do below the pay will keep refreshing

      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      setSdkReady(true);
    }
  }, [id, dispatch, successPay, successDeliver, order, navigate, userInfo]);

  const successPaymentHandler = async () => {
    if (order.paymentMethod === "Cash on Delivery") {
      navigate(`/orders/${id}/cod`);
    } else {
      navigate(`/orders/${id}/payment`);
    }
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const location = useLocation();
  const { paymentMethod } = location.state || {};

  const isCashOnDelivery = paymentMethod === "Cash on Delivery";
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              {/* user: name and email was added in .populate in getOrderById function */}
              <p>
                {" "}
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}{" "}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.paymentMethod !== "Cash on Delivery" && (
                <div>
                  {!order.isPaid ? (
                    <Message variant="danger">Not paid</Message>
                  ) : (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  )}
                </div>
              )}
              {/* Conditional rendering of info message for Cash on Delivery */}
              {/* Conditional rendering of info message for Cash on Delivery */}
              {order.paymentMethod === "Cash on Delivery" && (
                <Message variant="info">Cash on Delivery</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={process.env.REACT_APP_API_URL + item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.noOfProducts} x AED{" "}
                          {item.selectedPrice.toFixed(2)} = AED{" "}
                          {item.noOfProducts * item.selectedPrice.toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>AED {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>AED {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>AED {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>AED {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && order.paymentMethod != "Cash on Delivery" && (
                <div>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <div>
                      <div className="d-grid gap-2">
                        <Button
                          type="button"
                          className="button-primary btn-block"
                          onClick={successPaymentHandler}
                        >
                          Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {loadingDeliver && <Loader />}
              {/* Mark As Delivered button */}
              {userInfo.isAdmin &&
                ((order.isPaid && !order.isDelivered) ||
                  (!order.isPaid &&
                    order.paymentMethod === "Cash on Delivery")) && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default OrderScreen;
