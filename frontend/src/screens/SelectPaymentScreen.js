import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { useSelector } from "react-redux";

const SelectPaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const handleCashOnDelivery = async () => {
    const order = await createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: "Cash on Delivery",
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    navigate("/placeorder", {
      state: { paymentMethod: "Cash on Delivery" },
    });
  };

  const handleCardPayment = async () => {
    const order = await createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: "Card Payment",
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    navigate("/placeorder", {
      state: { paymentMethod: "Card Payment" },
    });
  };

  return (
    <div>
      <h1>Select Payment Method</h1>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <CheckoutSteps step1 step2 step3 />
      <Container className="text-center my-5">
        <div className="d-flex flex-column align-items-center">
          <Button
            onClick={handleCashOnDelivery}
            variant="outline-primary"
            className="btn-block mb-2"
            style={{ width: "200px" }} // Set a custom width for the button
          >
            Cash on Delivery
          </Button>
          <Button
            onClick={handleCardPayment}
            variant="outline-primary"
            className="btn-block"
            style={{ width: "200px" }} // Set a custom width for the button
          >
            Card Payment
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default SelectPaymentScreen;
