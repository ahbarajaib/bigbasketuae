import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const CodSuccessScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Automatically navigate to the order screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/orders/${id}`);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate, id]);

  return (
    <div className="text-center">
      <h1>Cash on Delivery Success!</h1>
      <p>Your order has been placed successfully.</p>
      <p>Redirecting to the order screen...</p>
      <Link to={`/orders/${id}`}>Go to Order Details</Link>
    </div>
  );
};

export default CodSuccessScreen;
