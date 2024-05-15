import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { useSelector } from "react-redux";

const SelectPaymentScreen = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  // State to keep track of the selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleProceedToPayment = async () => {
    if (selectedPaymentMethod === "CashOnDelivery") {
      // Create an order and navigate to the appropriate page

      navigate("/placeorder", {
        state: { paymentMethod: "Cash on Delivery" },
      });
    } else if (selectedPaymentMethod === "BringSwipingMachine") {
      const order = await createOrder({
        orderItems: cartItems.cartItems,
        shippingAddress: cartItems.shippingAddress,
        paymentMethod: "Bring Swiping Machine",
        itemsPrice: cartItems.itemsPrice,
        shippingPrice: cartItems.shippingPrice,
        taxPrice: cartItems.taxPrice,
        totalPrice: cartItems.totalPrice,
      });
      navigate("/placeorder", {
        state: { paymentMethod: "Bring Swiping Machine" },
      });
    } else if (selectedPaymentMethod === "CardPayment") {
      navigate("/placeorder", {
        state: { paymentMethod: "Card Payment" },
      });
    }
  };

  return (
    <div>
      <h1>Select Payment Method</h1>
      <Button
        className="my-3 border"
        variant="light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <CheckoutSteps step1 step2 step3 />
      <Container className="text-left my-5">
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <Form style={{ width: "100%" }}>
            <div className="d-flex justify-content-center flex-column">
              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  className="custom-radio"
                  label="&nbsp;&nbsp; Card Payment"
                  name="paymentMethod"
                  value="CardPayment"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>
              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  className="custom-radio"
                  label="&nbsp;&nbsp; Bring Swiping Machine"
                  name="paymentMethod"
                  value="BringSwipingMachine"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>

              <Form.Group className="text-left mb-2">
                <Form.Check
                  type="radio"
                  className="custom-radio"
                  label="&nbsp;&nbsp; Cash on Delivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  onChange={handlePaymentMethodChange}
                />
              </Form.Group>
            </div>

            {selectedPaymentMethod && (
              <Button
                onClick={handleProceedToPayment}
                variant="success"
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
