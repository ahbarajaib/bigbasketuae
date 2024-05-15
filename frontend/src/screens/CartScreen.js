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

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cartItems = useSelector((state) => state.cart.cartItems);
  // Increase the quantity of the product
  const handleIncreaseQty = (cartItemId, noOfProducts, countInStock) => {
    if (noOfProducts < countInStock) {
      dispatch(updateCartQuantity(cartItemId, noOfProducts + 1));
    }
  };

  // Decrease the quantity of the product
  const handleDecreaseQty = (cartItemId, noOfProducts) => {
    if (noOfProducts > 1) {
      dispatch(updateCartQuantity(cartItemId, noOfProducts - 1));
    }
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

  // Calculate totals
  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.variant.noOfProducts * item.variant.price,
    0
  );
  const total = cartItems.reduce(
    (acc, item) =>
      acc +
      item.variant.noOfProducts *
        (item.variant.discount > 0
          ? item.variant.discountedPrice
          : item.variant.price),
    0
  );
  const youSaved = grossTotal - total;

  return (
    <>
      <Button
        className="my-3 border"
        variant="light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty{" "}
              <Button
                className="my-3 border"
                variant="light"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((cartItem) => (
                <ListGroup.Item key={cartItem.cartItemId}>
                  <Row>
                    <Col md={1} sm={1} xs={1}>
                      <Image
                        src={
                          process.env.REACT_APP_API_URL + cartItem.product.image
                        }
                        alt={cartItem.product.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={3} sm={2} xs={2} style={{ fontSize: "0.8em" }}>
                      <Link to={`/product/${cartItem.product}`}>
                        {cartItem.product.name}
                      </Link>
                      <Col md={3} sm={2} xs={2}>
                        {cartItem.variant && (
                          <div>
                            {cartItem.variant.qty} {cartItem.variant.units}
                          </div>
                        )}
                      </Col>
                    </Col>
                    <Col md={2} sm={2} xs={2} style={{ fontSize: "0.8em" }}>
                      {cartItem.variant &&
                      cartItem.variant.discount !== undefined ? (
                        <>
                          {cartItem.variant.discount > 0 ? (
                            <>
                              <div>
                                AED{" "}
                                {parseFloat(
                                  cartItem.variant.discountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                AED{" "}
                                {parseFloat(cartItem.variant.price).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              AED{" "}
                              {parseFloat(cartItem.variant.price).toFixed(2)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          AED{" "}
                          {cartItem.variant &&
                          cartItem.variant.price !== undefined
                            ? ` ${parseFloat(cartItem.variant.price).toFixed(
                                2
                              )}`
                            : ""}
                        </div>
                      )}
                    </Col>

                    <Col md={1} sm={1} xs={1}>
                      <div className="quantity-container">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleDecreaseQty(
                              cartItem.cartItemId,
                              cartItem.variant.noOfProducts
                            )
                          }
                        >
                          -
                        </button>
                        <div className="qty-number">
                          {cartItem.variant &&
                            cartItem.variant.noOfProducts &&
                            cartItem.variant.noOfProducts}
                        </div>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleIncreaseQty(
                              cartItem.cartItemId,
                              cartItem.variant.noOfProducts,
                              cartItem.product.countInStock
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </Col>
                    <Col md={1} sm={1} xs={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          removeFromCartHandler(cartItem.cartItemId)
                        }
                        style={{ fontSize: "0.8em" }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                    <Col md={2} sm={2} xs={2} style={{ fontSize: "0.8em" }}>
                      {cartItem.variant &&
                      cartItem.variant.discount !== undefined ? (
                        <>
                          {cartItem.variant.discount > 0 ? (
                            <>
                              <div>
                                AED{" "}
                                {parseFloat(
                                  cartItem.variant.noOfProducts *
                                    cartItem.variant.discountedPrice
                                ).toFixed(2)}
                              </div>
                              <div style={{ textDecoration: "line-through" }}>
                                AED{" "}
                                {parseFloat(
                                  cartItem.variant.noOfProducts *
                                    cartItem.variant.price
                                ).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>
                              AED{" "}
                              {parseFloat(
                                cartItem.variant.noOfProducts *
                                  cartItem.variant.price
                              ).toFixed(2)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          AED{" "}
                          {cartItem.variant &&
                          cartItem.variant.price !== undefined
                            ? ` ${cartItem.variant.price}`
                            : ""}
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
                    You saved AED {parseFloat(youSaved).toFixed(2)}
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
                    &nbsp;AED {parseFloat(total).toFixed(2)} &nbsp;&nbsp;
                    <del>{parseFloat(grossTotal).toFixed(2)}</del>
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
                    &nbsp;AED {parseFloat(total).toFixed(2)}
                  </h6>
                </strong>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-4">
                <Button
                  variant="success"
                  className="btn-lg"
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
