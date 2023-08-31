import React, { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

const CartScreen = (history) => {
  const { id } = useParams();

  const navigate = useNavigate();
  //gives the details of the whole link console.log(qty and check)
  const location = useLocation();
  const selectedQty = new URLSearchParams(location.search).get("selectedQty");

  const selectedPrice = new URLSearchParams(location.search).get(
    "selectedPrice"
  );

  //this output the qty
  const noOfProducts = new URLSearchParams(location.search).get("noOfProducts");
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

  //this is for checkoutHandler
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(
        addToCart(
          id,
          noOfProducts,
          selectedQty,
          selectedPrice,
          selectedDiscount,
          selectedDiscountedPrice,
          selectedUnits
        )
      );
    }
  }, [
    dispatch,
    id,
    noOfProducts,
    selectedQty,
    selectedPrice,
    selectedDiscount,
    selectedDiscountedPrice,
    selectedUnits,
  ]);

  const handleDecreaseQty = (item) => {
    if (item.noOfProducts > 1) {
      updateQtyHandler(item, item.noOfProducts - 1);
    }
  };

  const handleIncreaseQty = (item) => {
    if (item.noOfProducts < item.countInStock) {
      updateQtyHandler(item, item.noOfProducts + 1);
    }
  };
  const updateQtyHandler = (item, newQty) => {
    dispatch(
      addToCart(
        item.product,
        newQty,
        item.selectedQty,
        item.selectedPrice,
        item.selectedDiscount,
        item.selectedDiscountedPrice,
        item.selectedUnits
      )
    );
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

    //instead of history.push
    //navigate('/login?redirect=shipping')
  };

  const grossTotal = cartItems
    .reduce((acc, item) => {
      const itemTotal = item.noOfProducts * item.selectedPrice;
      return acc + itemTotal;
    }, 0)
    .toFixed(2);

  const total = cartItems
    .reduce((acc, item) => {
      const price =
        item.selectedDiscount > 0
          ? item.selectedDiscountedPrice
          : item.selectedPrice;
      const itemTotal = item.noOfProducts * price;
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
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={process.env.REACT_APP_API_URL + item.image}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={3} style={{ fontSize: "0.8em" }}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <Col md={3}>
                        {item.selectedQty}
                        {item.selectedUnits}
                      </Col>
                    </Col>

                    <Col md={2} style={{ fontSize: "0.8em" }}>
                      {item.selectedDiscount > 0 ? (
                        <>
                          <div>AED {item.selectedDiscountedPrice}</div>
                          <div style={{ textDecoration: "line-through" }}>
                            {item.selectedPrice.toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div>AED {item.selectedPrice.toFixed(2)}</div>
                      )}
                    </Col>
                    <Col md={1}>
                      <div className="quantity-container">
                        <button
                          className="qty-btn"
                          style={{ fontSize: "0.9em" }}
                          onClick={() => handleDecreaseQty(item)}
                        >
                          -
                        </button>
                        <div className="qty-number">{item.noOfProducts}</div>
                        <button
                          className="qty-btn"
                          style={{ fontSize: "0.9em" }}
                          onClick={() => handleIncreaseQty(item)}
                        >
                          +
                        </button>
                      </div>
                    </Col>

                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                        style={{ fontSize: "0.8em" }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                    <Col md={2} style={{ fontSize: "0.8em" }}>
                      {item.selectedDiscount > 0 ? (
                        <>
                          <div>
                            AED{" "}
                            {(
                              item.noOfProducts * item.selectedDiscountedPrice
                            ).toFixed(2)}
                          </div>
                          <div style={{ textDecoration: "line-through" }}>
                            {" "}
                            {(item.noOfProducts * item.selectedPrice).toFixed(
                              2
                            )}
                          </div>
                        </>
                      ) : (
                        <div>
                          AED{" "}
                          {(item.noOfProducts * item.selectedPrice).toFixed(2)}
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
              <h6
                style={{
                  textAlign: "center",
                  color: "#007bff",
                }}
              >
                You saved AED {youSaved}
              </h6>
              <h5
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                Subtotal &nbsp;AED {total}
                &nbsp;&nbsp;<del>{grossTotal}</del>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-4">
                <Button
                  type="button"
                  className="button-primary btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
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
