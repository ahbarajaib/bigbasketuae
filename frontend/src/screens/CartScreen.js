import React, { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../actions/cartActions";

const CartScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract variant data from the URL query parameters
  const selectedQty = new URLSearchParams(location.search).get("selectedQty");
  const selectedPrice = new URLSearchParams(location.search).get(
    "selectedPrice"
  );
  const selectedNoOfProducts = new URLSearchParams(location.search).get(
    "selectedNoOfProducts"
  );
  const selectedDiscount = new URLSearchParams(location.search).get(
    "selectedDiscount"
  );
  const selectedDiscountedPrice = new URLSearchParams(location.search).get(
    "selectedDiscountedPrice"
  );
  const selectedUnits = new URLSearchParams(location.search).get(
    "selectedUnits"
  );

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (
      id &&
      selectedNoOfProducts &&
      selectedQty &&
      selectedPrice &&
      selectedDiscount &&
      selectedDiscountedPrice &&
      selectedUnits
    ) {
      // Create a variant object to pass to addToCart
      const variant = {
        selectedNoOfProducts,
        selectedQty,
        selectedPrice,
        selectedDiscount,
        selectedDiscountedPrice,
        selectedUnits,
      };

      dispatch(addToCart(id, variant));
    }
  }, [
    dispatch,
    id,
    selectedNoOfProducts,
    selectedQty,
    selectedPrice,
    selectedDiscount,
    selectedDiscountedPrice,
    selectedUnits,
  ]);

  const handleDecreaseQty = (cartItem) => {
    if (
      cartItem.variant &&
      cartItem.variant.selectedNoOfProducts &&
      cartItem.variant.selectedNoOfProducts > 1
    ) {
      updateQtyHandler(cartItem, cartItem.variant.selectedNoOfProducts - 1);
    }
  };

  const handleIncreaseQty = (cartItem) => {
    if (
      cartItem.variant &&
      cartItem.variant.selectedNoOfProducts &&
      cartItem.variant.selectedNoOfProducts < cartItem.countInStock
    ) {
      updateQtyHandler(cartItem, cartItem.variant.selectedNoOfProducts + 1);
    }
  };

  const updateQtyHandler = (cartItem, newQty) => {
    dispatch(updateCartQuantity(cartItem, newQty));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/shipping");
    }
  };

  const grossTotal = cartItems
    .filter((item) =>
      item.variant &&
      item.variant.selectedNoOfProducts !== undefined &&
      item.variant.selectedPrice !== undefined
    )
    .reduce((acc, item) => {
      const itemTotal =
        item.variant.selectedNoOfProducts * item.variant.selectedPrice;
      return acc + itemTotal;
    }, 0)
    .toFixed(2);

  const total = cartItems
    .filter((item) =>
      item.variant &&
      item.variant.selectedDiscount !== undefined
    )
    .reduce((acc, item) => {
      const price =
        item.variant.selectedDiscount > 0
          ? item.variant.selectedDiscountedPrice
          : item.variant.selectedPrice;
      const itemTotal =
        item.variant.selectedNoOfProducts !== undefined
          ? item.variant.selectedNoOfProducts * price
          : 0;
      return acc + itemTotal;
    }, 0)
    .toFixed(2);

  const youSaved = (grossTotal - total).toFixed(2);

  return (
    <>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((cartItem) => (
                <ListGroup.Item key={cartItem.id}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={process.env.REACT_APP_API_URL + cartItem.image}
                        alt={cartItem.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={3} style={{ fontSize: "0.8em" }}>
                      <Link to={`/product/${cartItem.product}`}>
                        {cartItem.name}
                      </Link>
                      <Col md={3}>
                        {cartItem.variant &&
                          cartItem.variant.selectedQty && (
                            <div>
                              {cartItem.variant.selectedQty}
                              {cartItem.variant.selectedUnits}
                            </div>
                          )}
                      </Col>
                    </Col>
                    <Col md={2} style={{ fontSize: "0.8em" }}>
                      {cartItem.variant &&
                      cartItem.variant.selectedDiscount !== undefined ? (
                        <>
                          <div>
                            AED{" "}
                            {cartItem.variant.selectedDiscountedPrice.toFixed(
                              2
                            )}
                          </div>
                          <div style={{ textDecoration: "line-through" }}>
                            {cartItem.variant.selectedPrice
                              ? `AED ${cartItem.variant.selectedPrice.toFixed(
                                  2
                                )}`
                              : ""}
                          </div>
                        </>
                      ) : (
                        <div>
                          AED{" "}
                          {cartItem.variant &&
                          cartItem.variant.selectedPrice !== undefined
                            ? ` ${cartItem.variant.selectedPrice.toFixed(2)}`
                            : ""}
                        </div>
                      )}
                    </Col>
                    <Col md={1}>
                      <div className="quantity-container">
                        <button
                          className="qty-btn"
                          onClick={() => handleDecreaseQty(cartItem)}
                        >
                          -
                        </button>
                        <div className="qty-number">
                          {cartItem.variant &&
                            cartItem.variant.selectedNoOfProducts &&
                            cartItem.variant.selectedNoOfProducts}
                        </div>
                        <button
                          className="qty-btn"
                          onClick={() => handleIncreaseQty(cartItem)}
                        >
                          +
                        </button>
                      </div>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(cartItem.id)}
                        style={{ fontSize: "0.8em" }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                    <Col md={2} style={{ fontSize: "0.8em" }}>
                      {cartItem.variant &&
                      cartItem.variant.selectedDiscount !== undefined ? (
                        <>
                          <div>
                            AED{" "}
                            {(
                              cartItem.variant.selectedNoOfProducts *
                              cartItem.variant.selectedDiscountedPrice
                            ).toFixed(2)}
                          </div>
                          <div style={{ textDecoration: "line-through" }}>
                            {" "}
                            {(
                              cartItem.variant.selectedNoOfProducts *
                              cartItem.variant.selectedPrice
                            ).toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div>
                          AED{" "}
                          {(
                            cartItem.variant.selectedNoOfProducts *
                            cartItem.variant.selectedPrice
                          ).toFixed(2)}
                        </div>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={3}>
          <Card className="my-4 p-4">
            <ListGroup.Item>
              {youSaved > 0 && (
                <strong>
                  <p
                    style={{
                      textAlign: "center",
                      color: "#007bff",
                    }}
                  >
                    You saved AED {youSaved}
                  </p>
                </strong>
              )}

              {grossTotal > total ? (
                <strong>
                  <h6
                    style={{
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    &nbsp;AED {total}
                    &nbsp;&nbsp;<del>{grossTotal}</del>
                  </h6>
                </strong>
              ) : (
                <strong>
                  <h6
                    style={{
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    &nbsp;AED {total}
                  </h6>
                </strong>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-4">
                <Button
                  type="button"
                  className="button-primary"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed
                </Button>
              </div>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
