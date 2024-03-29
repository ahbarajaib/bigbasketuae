import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ListGroup, Image, Card, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod } = location.state || {};
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    navigate("/shipping");
  }
  //stored from localstorage

  //calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  //total price of all items
  // Assuming that cartItems is an array of items in the cart
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce(
      (acc, item) =>
        acc + item.variant.selectedPrice * item.variant.selectedNoOfProducts,
      0
    )
  );

  //total discountedPrice of all items
  cart.discountedItemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => {
      const price =
        item.variant.selectedDiscount > 0
          ? typeof item.variant.selectedDiscountedPrice === "number"
            ? item.variant.selectedDiscountedPrice
            : item.variant.selectedPrice
          : typeof item.variant.selectedPrice === "number"
          ? item.variant.selectedPrice
          : 0;
      const noOfProducts =
        typeof item.variant.selectedNoOfProducts === "number"
          ? item.variant.selectedNoOfProducts
          : 0;

      const itemTotal = noOfProducts * price;
      return acc + itemTotal;
    }, 0)
  );

  cart.discountAmount = addDecimals(
    cart.itemsPrice - cart.discountedItemsPrice
  );

  // Calculate the shipping price based on cart.itemsPrice and cart.discountedItemsPrice
  const smallerPrice = Math.min(cart.itemsPrice, cart.discountedItemsPrice);

  cart.itemsPrice = smallerPrice.toFixed(2);
  // Calculate the shipping price based on cart.itemsPrice and cart.discountedItemsPrice
  let shippingCost = 0;

  // Check if there is a product in the cart with the category 'wholesale'
  const hasWholesaleProduct = cart.cartItems.some(
    (item) => item.category === "wholesale"
  );

  // Adjust the shipping cost based on the conditions
  if (hasWholesaleProduct) {
    if (smallerPrice < 200) {
      shippingCost = 20;
    }
    // Free shipping for orders greater than or equal to 200 AED
  } else {
    if (smallerPrice < 100) {
      shippingCost = 10;
    }
    // Free shipping for orders greater than or equal to 100 AED
  }

  cart.shippingPrice = addDecimals(shippingCost);

  // cart.shippingPrice = addDecimals(smallerPrice > 80 ? 0 : 10);

  cart.totalPrice = Number(smallerPrice) + Number(cart.shippingPrice);
  cart.paymentMethod = paymentMethod;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      if (
        paymentMethod === "Cash on Delivery" ||
        paymentMethod === "Bring Swiping Machine"
      ) {
        navigate(`/orders/${order._id}/cod`);
      } else if (paymentMethod === "Card Payment") {
        navigate(`/orders/${order._id}/payment`);
      }
    }
  }, [success, navigate, order, paymentMethod]);

  const placeOrderHandler = () => {
    const orderItems = cart.cartItems.map((item) => ({
      name: item.name,
      noOfProducts: item.variant.selectedNoOfProducts,
      image: item.image,
      product: item.product,
      selectedPrice: item.variant.selectedPrice,
      selectedQty: item.variant.selectedQty,
      selectedDiscountedPrice: item.variant.selectedDiscountedPrice, // Add this field
      selectedDiscount: item.variant.selectedDiscount, // Add this field
      selectedUnits: item.variant.selectedUnits, // Add this field
    }));

    dispatch(
      createOrder({
        orderItems,
        shippingAddress: {
          building: cart.shippingAddress.building,
          address: cart.shippingAddress.address,
          city: cart.shippingAddress.city,
          country: cart.shippingAddress.country,
          coordinates: cart.shippingAddress.coordinates, // Include coordinates here
        },
        paymentMethod: paymentMethod, // Use the selected payment method
        itemsPrice: cart.items,
        discountAmount: cart.discountAmount,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                <br />
                {cart.shippingAddress.building}
                &nbsp;
                {cart.shippingAddress.address}
                &nbsp;&nbsp;
                {cart.shippingAddress.city}
                <br />
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method: {paymentMethod}</h2>

              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2} sm={2}>
                          <Image
                            src={process.env.REACT_APP_API_URL + item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={2} sm={3}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3} sm={3}>
                          {item.variant.selectedDiscount > 0 ? (
                            <>
                              <div>
                                {item.variant.selectedNoOfProducts} x{" "}
                                {item.variant.selectedDiscountedPrice.toFixed(
                                  2
                                )}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                {" "}
                                {item.variant.selectedPrice.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              {item.variant.selectedNoOfProducts} x{" "}
                              {item.variant.selectedPrice.toFixed(2)}
                            </div>
                          )}
                        </Col>
                        <Col md={2} sm={2}>
                          {item.variant.selectedDiscount > 0 ? (
                            <>
                              <div>
                                {(
                                  item.variant.selectedNoOfProducts *
                                  item.variant.selectedDiscountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                {" "}
                                {(
                                  item.variant.selectedNoOfProducts *
                                  item.variant.selectedPrice
                                ).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              {(
                                item.variant.selectedNoOfProducts *
                                item.variant.selectedPrice
                              ).toFixed(2)}
                            </div>
                          )}
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
                  <Col>AED {smallerPrice}</Col>
                </Row>
              </ListGroup.Item>
              {cart.discountAmount > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Discount</Col>
                    <Col>- AED {cart.discountAmount} OFF</Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    {Math.abs(cart.shippingPrice) < 0.01 ? (
                      <strong>
                        <span style={{ color: "green" }}>FREE</span>
                      </strong>
                    ) : (
                      `AED ${cart.shippingPrice}`
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>AED {cart.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button
                    type="button"
                    className="button-primary btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
