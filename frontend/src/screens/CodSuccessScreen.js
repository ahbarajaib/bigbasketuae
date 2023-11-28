import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../actions/orderActions";
import Loader from "../components/Loader";

const CodSuccessScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch the order details
  useEffect(() => {
    dispatch(getOrderDetails(id)).then(() => {
      setOrderDetailsLoaded(true);
    });
  }, [dispatch, id]);

  // Get the order details from the Redux store
  const orderDetails = useSelector((state) => state.orderDetails);

  const { order } = orderDetails;

  // State to hold the payment method
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderDetailsLoaded, setOrderDetailsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Extract and set the payment method when the order details are available
  useEffect(() => {
    if (order) {
      setPaymentMethod(order.paymentMethod);
    }
  }, [order]);

  // Automatically navigate to the order screen after the countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate(`/orders/${id}`);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown, navigate, id]);

  return (
    <div className="text-center">
      {orderDetailsLoaded ? (
        <>
          <strong>
            <h1 style={{ color: "#D0312d" }}>CONGRATULATIONS.</h1>
          </strong>
          <h4 className="mb-3" style={{ color: "gray" }}>
            YOUR ORDER HAS SUCCESSFULLY BEEN PLACED.
          </h4>
          <p>
            Payment Method: <h3>{paymentMethod}</h3>
          </p>
          <p>Redirecting to the order screen in {countdown} seconds...</p>
          <Link className="clickable" to={`/orders/${id}`}>
            Go to Order Details
          </Link>
        </>
      ) : (
        <Loader /> // Display a loader until order details are loaded
      )}
    </div>
  );
};

export default CodSuccessScreen;
