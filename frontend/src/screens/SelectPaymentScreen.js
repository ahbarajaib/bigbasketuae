import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { useSelector } from "react-redux";

const SelectPaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // State to keep track of the selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleProceedToPayment = async () => {
    if (selectedPaymentMethod === "CashOnDelivery") {
      // Create an order and navigate to the appropriate page
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
    } else if (selectedPaymentMethod === "BringSwipingMachine") {
      const order = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: "Bring Swiping Machine",
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });

      navigate("/placeorder", {
        state: { paymentMethod: "Bring Swiping Machine" },
      });
    } else if (selectedPaymentMethod === "CardPayment") {
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
    }
  };

  return (
    <div>
      <h1>Select Payment Method</h1>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <CheckoutSteps step1 step2 step3 />
      <Container className="text-left my-5">
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <Form style={{ width: "100%" }}>
            <div className="d-flex justify-content-center flex-column">
              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  label="Card Payment"
                  name="paymentMethod"
                  value="CardPayment"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>
              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  label="Bring Swiping Machine"
                  name="paymentMethod"
                  value="BringSwipingMachine"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>

              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  label="Cash on Delivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>
            </div>

            {selectedPaymentMethod && (
              <Button
                onClick={handleProceedToPayment}
                variant="primary"
                className="btn-block mt-3"
                style={{ width: "200px" }}
              >
                Proceed to Payment
              </Button>
            )}
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default SelectPaymentScreen;
