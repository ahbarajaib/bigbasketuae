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

  const cartItems = useSelector((state) => state.cart);
  const { shippingAddress } = cartItems;

  if (!shippingAddress) {
    navigate("/shipping");
  }

  //stored from localstorage

  //calculate prices
  const addDecimals = (num) => {
    if (typeof num !== "number") {
      console.error("addDecimals called with non-number", num);
      return 0; // Return '0.00' if num is not a number
    }
    return Math.round(num * 100) / 100;
  };

  //total price of all items
  // Assuming that cartItems is an array of items in the cart
  cartItems.itemsPrice = addDecimals(
    cartItems.cartItems.reduce(
      (acc, item) => acc + item.variant.price * item.variant.noOfProducts,
      0
    )
  );

  //total discountedPrice of all items
  cartItems.discountedItemsPrice = addDecimals(
    cartItems.cartItems.reduce((acc, item) => {
      const price =
        item.variant.discount > 0
          ? typeof item.variant.discountedPrice === "number"
            ? item.variant.discountedPrice
            : item.variant.price
          : typeof item.variant.price === "number"
          ? item.variant.price
          : 0;
      const noOfProducts =
        typeof item.variant.noOfProducts === "number"
          ? item.variant.noOfProducts
          : 0;

      const itemTotal = noOfProducts * price;
      return acc + itemTotal;
    }, 0)
  );

  cartItems.discountAmount = addDecimals(
    cartItems.itemsPrice - cartItems.discountedItemsPrice
  );

  // Calculate the shipping price based on cart.itemsPrice and cart.discountedItemsPrice
  const smallerPrice = Math.min(
    cartItems.itemsPrice,
    cartItems.discountedItemsPrice
  );

  cartItems.itemsPrice = smallerPrice;
  // Calculate the shipping price based on cart.itemsPrice and cart.discountedItemsPrice
  let shippingPrice = 0;

  // Check if there is a product in the cart with the category 'wholesale'
  const hasWholesaleProduct = cartItems.cartItems.some(
    (item) => item.product.category.name === "wholesale"
  );

  cartItems.cartItems.map((item) => item.product.category.name);
  // Adjust the shipping cost based on the conditions
  if (hasWholesaleProduct) {
    if (smallerPrice < 200) {
      shippingPrice = 20;
    }
    // Free shipping for orders greater than or equal to 200 AED
  } else {
    if (smallerPrice < 100) {
      shippingPrice = 10;
    }
    // Free shipping for orders greater than or equal to 100 AED
  }

  cartItems.shippingPrice = addDecimals(shippingPrice);

  // cart.shippingPrice = addDecimals(smallerPrice > 80 ? 0 : 10);

  cartItems.totalPrice = Number(smallerPrice) + Number(cartItems.shippingPrice);
  cartItems.paymentMethod = paymentMethod;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  const calculateTotals = (cartItems) => {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2); // Correct rounding and fixing to two decimal places
    };

    let itemsPrice = 0;
    let discountedItemsPrice = 0;

    cartItems.cartItems.forEach((item) => {
      const { variant } = item;
      const itemBasePrice = variant.price * variant.noOfProducts;
      const itemDiscountedPrice =
        variant.discountedPrice * variant.noOfProducts;

      itemsPrice += itemBasePrice; // Total price without discount
      discountedItemsPrice +=
        variant.discount > 0 ? itemDiscountedPrice : itemBasePrice; // Use discounted price if available and valid
    });

    const discountAmount = addDecimals(itemsPrice - discountedItemsPrice);
    itemsPrice = addDecimals(itemsPrice);
    discountedItemsPrice = addDecimals(discountedItemsPrice);

    // Assuming no additional charges for the example
    let shippingPrice = 0;
    if (hasWholesaleProduct) {
      if (itemsPrice < 200) {
        shippingPrice = 20; // Apply shipping cost of 20 if items price exceeds 200
      }
    } else {
      if (itemsPrice < 100) {
        shippingPrice = 10; // Apply shipping cost of 10 if items price exceeds 100
      }
    }
    const totalPrice = addDecimals(
      Number(discountedItemsPrice) + shippingPrice
    );

    return {
      itemsPrice,
      discountedItemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice,
    };
  };

  const totals = calculateTotals(cartItems);

  // useEffect(() => {
  //   if (success) {
  //     if (
  //       paymentMethod === "Cash on Delivery" ||
  //       paymentMethod === "Bring Swiping Machine"
  //     ) {
  //       navigate(`/orders/${order._id}/cod`);
  //     } else if (paymentMethod === "Card Payment") {
  //       navigate(`/orders/${order._id}/payment`);
  //     }
  //   }
  // }, [success, navigate, order, paymentMethod]);

  const placeOrderHandler = async () => {
    const orderItems = cartItems.cartItems.map((item) => ({
      name: item.product.name,
      noOfProducts: item.variant.noOfProducts,
      image: item.product.image,
      product: item.product._id,
      selectedPrice: item.variant.price,
      selectedQty: item.variant.qty,
      discountedPrice: item.variant.discountedPrice,
      selectedDiscount: item.variant.discount,
      selectedUnits: item.variant.units,
    }));

    const orderData = {
      orderItems,
      shippingAddress: {
        building: cartItems.shippingAddress.building,
        address: cartItems.shippingAddress.address,
        city: cartItems.shippingAddress.city,
        country: cartItems.shippingAddress.country,
        coordinates: cartItems.shippingAddress.coordinates,
      },
      paymentMethod: paymentMethod,
      itemsPrice: totals.itemsPrice,
      discountAmount: totals.discountAmount,
      shippingPrice: totals.shippingPrice,
      totalPrice: totals.totalPrice,
    };

    try {
      // Dispatch the order to Redux
      const createdOrder = await dispatch(createOrder(orderData));
      console.log("Created Order:", createdOrder);

      let orderId = order._id;
      if (createdOrder.payload) {
        orderId = createdOrder.payload._id;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            orderData: orderData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      console.log("Stripe session created:", session);

      // Redirect to checkout
      window.location.href = session.url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button
        className="my-3 border"
        variant="light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                <br />
                {cartItems.shippingAddress.building}
                &nbsp;
                {cartItems.shippingAddress.address}
                &nbsp;&nbsp;
                {cartItems.shippingAddress.city}
                <br />
                {cartItems.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method: {paymentMethod}</h2>

              {cartItems.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2} sm={2}>
                          <Image
                            src={
                              process.env.REACT_APP_API_URL + item.product.image
                            }
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={2} sm={3}>
                          <Link to={`/product/${item.product._id}`}>
                            {item.product.name}
                          </Link>
                        </Col>
                        <Col md={3} sm={3}>
                          {item.variant.discount > 0 ? (
                            <>
                              <div>
                                {item.variant.noOfProducts} x{" "}
                                {parseFloat(
                                  item.variant.discountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                {" "}
                                {parseFloat(item.variant.price).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              {item.variant.noOfProducts} x{" "}
                              {parseFloat(item.variant.price).toFixed(2)}
                            </div>
                          )}
                        </Col>
                        <Col md={2} sm={2}>
                          {item.variant.discount > 0 ? (
                            <>
                              <div>
                                {parseFloat(
                                  item.variant.noOfProducts *
                                    item.variant.discountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                {" "}
                                {parseFloat(
                                  item.variant.noOfProducts * item.variant.price
                                ).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              {parseFloat(
                                item.variant.noOfProducts * item.variant.price
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
                  <Col>
                    AED {parseFloat(totals.discountedItemsPrice).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              {cartItems.discountAmount > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Discount</Col>
                    <Col>
                      - AED {parseFloat(totals.discountAmount).toFixed(2)} OFF
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    {Math.abs(parseFloat(totals.shippingPrice)) < 0.01 ? (
                      <strong>
                        <span style={{ color: "green" }}>FREE</span>
                      </strong>
                    ) : (
                      `AED ${parseFloat(totals.shippingPrice).toFixed(2)}`
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>AED {parseFloat(totals.totalPrice).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    className="btn-block btn-lg"
                    disabled={cartItems.cartItems === 0}
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
