import React, { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ListGroup, Image, Card, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, deliverOrder } from "../actions/orderActions";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../images/logo_only.png";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_REQUEST,
} from "../constants/orderConstants";

const OrderScreen = (history) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const printRef = useRef();
  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const coordinates = order?.shippingAddress?.coordinates || {};
  const { latitude: Lat, longitude: Lng } = coordinates;

  // Add a check for order and shippingAddress
  const shippingAddress = order?.shippingAddress || {};

  // Now you can use building, address, city, country, Lat, and Lng safely

  // Now you can use building, address, city, country, Lat, and Lng safely

  //loadingPay is just a rename because its used above

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
    order.totalPrice = addDecimals(order.totalPrice);
    order.discountAmount = addDecimals(order.discountAmount);
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!order || successDeliver) {
      //if you don't do below the pay will keep refreshing

      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      setSdkReady(true);
    }
  }, [id, dispatch, successDeliver, order, navigate, userInfo]);

  const successPaymentHandler = async () => {
    if (
      order.paymentMethod === "Cash on Delivery" ||
      order.paymentMethod === "Bring Swiping Machine"
    ) {
      navigate(`/orders/${id}/`);
    } else {
      navigate(`/orders/${id}/payment`);
    }
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
        
          <title>&nbsp;</title>
          <style>
          
            body {
              font-family: 'Arial', sans-serif;
            }
            #logo {
              max-width: 50px;
              height: auto;
              float: right;
              margin-right: 20px; /* Adjust the margin as needed */
            }
          
            /* Additional print styles */
            .shipping-details,
            .payment-method,
            .order-items,
            .order-summary {
              margin-bottom: 20px;
            }
            .shipping-details h2,
            .payment-method h2,
            .order-summary h2 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            .shipping-details p {
              margin: 5px 0;
            }
            .shipping-details a {
              color: black !important;
            }
            .order-items a {
              color: black !important;
            }
            .order-items table,
            .order-summary table {
              width: 100%;
              border-collapse: collapse;
            }
            .order-items th, .order-items td,
            .order-summary th, .order-summary td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .order-summary th {
              background-color: #f2f2f2;
            }
            .order-summary strong {
              font-weight: bold;
            }
            .right-side{
              text-align: left;
              
            }
            h1{
              text-align: center;
            }
            .right-side p {
              margin: 5px; /* Reset margin for <p> elements */
              padding: 0; /* Reset padding for <p> elements */
            }
          
            /* Add more styles as needed */
          </style>
        </head>
        <body>
        <div class="right-side">
          <img id="logo" src=${logo} alt="logo" />
            <p>Big Basket UAE</p>
            <p><strong>SHAHI KOHINOOR FOODSTUFF TRADING LLC</strong></p>
            <p>Bur Dubai, Meena Bazaar Plaza, Dubai, UAE </p>
            <p>Phone: <strong>+971 522512453</strong></p>
            <p>TRN No: <strong>104142142900003</strong></p>
            
            </div>
            <br />
            
          <div class="shipping-details">
          <h1>INVOICE</h1>
            <h2>Shipping</h2>
            <p>Order No: <strong>${order._id}</strong></p>
            <p><strong>Name:</strong> ${order.user.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${
              order.user.email
            }" class="clickable">${order.user.email}</a></p>
            ${
              order.user.phoneNumber
                ? `<p><strong>Phone:</strong> <a href="tel:${order.user.phoneNumber}" class="clickable">${order.user.phoneNumber}</a></p>`
                : ""
            }
            <p><strong>Address:</strong> ${order.shippingAddress.building}, ${
      order.shippingAddress.address
    }, ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
          </div>
  
          <div class="payment-method">
            <h2>Payment Method</h2>
            <p><strong>Method:</strong> ${order.paymentMethod}</p>
            
          </div>
  
          <div class="order-items">
            <h2 >Order Items </h2>
            ${
              order.orderItems.length === 0
                ? '<div class="message">Order is empty</div>'
                : "<table>" +
                  "<thead>" +
                  "<tr>" +
                  "<th>Product</th>" +
                  "<th>Quantity</th>" +
                  "<th>Price</th>" +
                  "<th>Total</th>" +
                  "</tr>" +
                  "</thead>" +
                  "<tbody>" +
                  order.orderItems
                    .map(
                      (item, index) =>
                        "<tr>" +
                        `<td><a href="/product/${item.product}">${item.name}</a></td>` +
                        `<td>${item.noOfProducts}</td>` +
                        `<td>AED ${item.selectedPrice.toFixed(2)}</td>` +
                        `<td>AED ${(
                          item.noOfProducts * item.selectedPrice
                        ).toFixed(2)}</td>` +
                        "</tr>"
                    )
                    .join("") +
                  "</tbody>" +
                  "</table>"
            }
          </div>
          <div class="order-summary">
          <h2>Order Summary</h2>
          <table>
            <tr>
              <td>Items</td>
              <td>AED ${order.itemsPrice}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>- AED ${order.discountAmount} OFF</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>
                ${
                  order && order.shippingPrice
                    ? Math.abs(order.shippingPrice) < 0.01
                      ? '<strong><span style="color: green">FREE</span></strong>'
                      : `AED ${order.shippingPrice}`
                    : "<span>Shipping price is not available</span>"
                }
              </td>
            </tr>
          
            <tr>
              <td>Total</td>
              <td><strong>AED ${order.totalPrice}</strong></td>
            </tr>
          </table>
        </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };
  const openGoogleMaps = () => {
    if (order && order.shippingAddress && order.shippingAddress.coordinates) {
      const { latitude, longitude } = order.shippingAddress.coordinates;

      // Create a Google Maps link
      const mapsUrl = `https://www.google.com/maps/place/${latitude},${longitude}`;

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // If the user is on a mobile device, open a list of applications to share the link
        if (navigator.share) {
          navigator
            .share({
              title: "Check out the location on Google Maps",
              text: "Location shared via Big Basket UAE",
              url: mapsUrl,
            })
            .then(() => console.log("Successful share"))
            .catch((error) => console.log("Error sharing:", error));
        } else {
          // If navigator.share is not supported, you can provide a fallback behavior
          alert("Share this location:\n" + mapsUrl);
        }
      } else {
        // If the user is on a desktop, provide the link that can be copied
        navigator.clipboard
          .writeText(mapsUrl)
          .then(() => {
            // Display a success message
            alert("Location link copied to clipboard.");
          })
          .catch((error) => {
            // Display an error message if copying to clipboard fails
            console.error("Failed to copy location link to clipboard:", error);
          });
      }
    }
  };

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
                <a href={`mailto:${order.user.email}`} className="clickable">
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Phone: </strong>
                {order.user.phoneNumber ? (
                  <a
                    href={`tel:${order.user.phoneNumber}`}
                    className="clickable"
                  >
                    {order.user.phoneNumber}
                  </a>
                ) : (
                  <span>{order.user.phoneNumber}</span>
                )}
              </p>

              <p>
                <strong>Address: </strong>
                {order.shippingAddress.building},&nbsp;
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country},
              </p>
              {/* New button to open Google Maps */}
              {userInfo &&
                (userInfo.isAdmin ||
                  userInfo.isManager ||
                  userInfo.isCourier) &&
                order.shippingAddress.coordinates && (
                  <Button
                    className="mb-3"
                    onClick={openGoogleMaps}
                    variant="outline-primary"
                  >
                    Open in Google Maps
                  </Button>
                )}
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
              {order.paymentMethod !== "Cash on Delivery" &&
                order.paymentMethod !== "Bring Swiping Machine" && (
                  <div>
                    {!order.isPaid ? (
                      <Message variant="danger">Not paid</Message>
                    ) : (
                      <Message variant="success">
                        Paid on {order.paidAt}
                      </Message>
                    )}
                  </div>
                )}
              {/* Conditional rendering of info message for Cash on Delivery */}
              {order.paymentMethod === "Cash on Delivery" && (
                <Message variant="info">Cash on Delivery</Message>
              )}
              {/* Conditional rendering of info message for Bring Swiping Machine */}
              {order.paymentMethod === "Bring Swiping Machine" && (
                <Message variant="info">Bring Swiping Machine</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 ref={printRef}>
                Order Items{" "}
                <Button onClick={handlePrint} variant="success">
                  Print &nbsp;
                  <FontAwesomeIcon icon={faPrint} />
                </Button>
              </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} sm={2}>
                          <Image
                            src={process.env.REACT_APP_API_URL + item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={1} sm={4}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} sm={5}>
                          {item.noOfProducts} x AED{" "}
                          {item.selectedPrice.toFixed(2)} = AED{" "}
                          {(item.noOfProducts * item.selectedPrice).toFixed(2)}
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
              {order.discountAmount > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Discount</Col>
                    <Col>- AED {order.discountAmount} OFF</Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    {order && order.shippingPrice ? (
                      Math.abs(order.shippingPrice) < 0.01 ? (
                        <strong>
                          <span style={{ color: "green" }}>FREE</span>
                        </strong>
                      ) : (
                        `AED ${order.shippingPrice}`
                      )
                    ) : (
                      // Handle the case where order is not properly initialized
                      <span>Shipping price is not available</span>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>AED {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid &&
                order.paymentMethod !== "Cash on Delivery" &&
                order.paymentMethod !== "Bring Swiping Machine" && (
                  <ListGroup.Item>
                    <div>
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <div className="d-grid gap-2">
                          <Button
                            type="button"
                            className="btn btn-lg btn-block btn-custom border-0"
                            onClick={successPaymentHandler}
                          >
                            Place Order
                          </Button>
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                )}
              {loadingDeliver && <Loader />}
              {/* Mark As Delivered button */}
              {userInfo &&
                userInfo.isAdmin && // Add a check for userInfo
                ((order.isPaid && !order.isDelivered) ||
                  (!order.isPaid &&
                    (order.paymentMethod === "Cash on Delivery" ||
                      order.paymentMethod === "Bring Swiping Machine"))) && (
                  <Button
                    variant="success"
                    disabled={order.isDelivered}
                    className="btn btn-lg btn-block border-0 m-2"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default OrderScreen;
