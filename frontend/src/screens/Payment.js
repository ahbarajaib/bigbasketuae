import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { getOrderDetails } from "../actions/orderActions";

function Payment() {
  const { id } = useParams();
  const dispatch = useDispatch();
  // Fetch the order details
  useEffect(() => {
    dispatch(getOrderDetails(id)).then(() => {
      setOrderDetailsLoaded(true);
    });
  }, [dispatch, id]);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;
  console.log(orderDetails);
  const totalPrice = orderDetails.order ? orderDetails.order.totalPrice : null;

  console.log(totalPrice);
  const orderPay = useSelector((state) => state.orderPay);
  const { success } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;
  const [orderDetailsLoaded, setOrderDetailsLoaded] = useState(false);

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    console.log("Order Details:", orderDetails);
    console.log("Total Price:", totalPrice);

    fetch(
      `${process.env.REACT_APP_API_URL}/api/config/stripe?${Date.now()}`
    ).then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, [dispatch, id, success, successDeliver, order, orderDetails, totalPrice]);

  useEffect(() => {
    if (totalPrice !== null) {
      fetch(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
        method: "POST",
        body: JSON.stringify({ totalPrice }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (result) => {
        var { clientSecret } = await result.json();
        setClientSecret(clientSecret);
      });
    }
  }, [id, totalPrice]);

  return (
    <>
      <Container className="mt-4" md={8} lg={8}>
        <div className="card">
          <h1 className="ml-md-4 ml-lg-4">Secure Payment</h1>
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm id={id} />
            </Elements>
          )}
        </div>
      </Container>
    </>
  );
}

export default Payment;
