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
  console.log(cart);
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
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce(
      (acc, item) => acc + item.selectedPrice * item.noOfProducts,
      0
    )
  );
  //total discountedPrice of all items
  cart.discountedItemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => {
      const price =
        item.selectedDiscount > 0
          ? item.selectedDiscountedPrice
          : item.selectedPrice;
      const itemTotal = item.noOfProducts * price;
      return acc + itemTotal;
    }, 0)
  );

  // Calculate the shipping price based on cart.itemsPrice and cart.discountedItemsPrice
  const smallerPrice = Math.min(cart.itemsPrice, cart.discountedItemsPrice);
  cart.itemsPrice = smallerPrice.toFixed(2);
  cart.shippingPrice = addDecimals(smallerPrice > 50 ? 0 : 10);

  cart.taxPrice = addDecimals(Number((0.05 * smallerPrice).toFixed(2)));
  cart.totalPrice =
    Number(smallerPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice);
  cart.paymentMethod = paymentMethod;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/orders/${order._id}`);
    }
    // eslint-disable-next-line
  }, [success, navigate, cart, paymentMethod, dispatch]);
  const placeOrderHandler = () => {
    const orderItems = cart.cartItems.map((item) => ({
      name: item.name,
      noOfProducts: item.noOfProducts,
      image: item.image,
      product: item.product,
      price: item.price,
      selectedPrice: item.selectedPrice,
      selectedQty: item.selectedQty,
      selectedDiscountedPrice: item.selectedDiscountedPrice, // Add this field
      selectedDiscount: item.selectedDiscount, // Add this field
      selectedUnits: item.selectedUnits, // Add this field
    }));
    console.log("orderItems:", orderItems);

    dispatch(
      createOrder({
        orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: paymentMethod, // Use the selected payment method
        itemsPrice: cart.items,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
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
                {cart.shippingAddress.address}
                &nbsp;PO Box&nbsp;{cart.shippingAddress.postalCode}&nbsp;
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
                          {item.selectedDiscount > 0 ? (
                            <>
                              <div>
                                {item.noOfProducts} x AED{" "}
                                {(
                                  item.noOfProducts *
                                  item.selectedDiscountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                {" "}
                                {(
                                  item.noOfProducts * item.selectedPrice
                                ).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              {item.noOfProducts} x AED{" "}
                              {(item.noOfProducts * item.selectedPrice).toFixed(
                                2
                              )}
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
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>AED {cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>AED {cart.taxPrice}</Col>
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
