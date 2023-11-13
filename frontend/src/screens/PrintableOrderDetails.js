import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const PrintableOrderDetails = ({ order }) => {
  return (
    <>
      <h2>Order Items</h2>
      {order.orderItems.length === 0 ? (
        <p>Order is empty</p>
      ) : (
        <div>
          {order.orderItems.map((item, index) => (
            <div key={index}>
              <Row>
                <Col md={1} sm={2}>
                  {/* Include your image here */}
                </Col>
                <Col md={1} sm={4}>
                  <p>{item.name}</p>
                </Col>
                <Col md={4} sm={5}>
                  <p>
                    {item.noOfProducts} x AED {item.selectedPrice.toFixed(2)} =
                    AED {(item.noOfProducts * item.selectedPrice).toFixed(2)}
                  </p>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      )}

      <h2>Order Summary</h2>
      <Row>
        <Col>Items</Col>
        <Col>AED {order.itemsPrice}</Col>
      </Row>
      <Row>
        <Col>Shipping</Col>
        <Col>{/* Include your shipping details here */}</Col>
      </Row>
      <Row>
        <Col>VAT</Col>
        <Col>AED {order.taxPrice}</Col>
      </Row>
      <Row>
        <Col>Total</Col>
        <Col>AED {order.totalPrice}</Col>
      </Row>
    </>
  );
};

export default PrintableOrderDetails;
