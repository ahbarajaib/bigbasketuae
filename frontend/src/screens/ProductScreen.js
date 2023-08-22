import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { listProductDetails } from "../actions/productActions";
import { addToCart, updateSelectedQtyPrice } from "../actions/cartActions";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const [noOfProducts, setNoOfProducts] = useState(1);
  const [selectedQty, setSelectedQty] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(0);

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product.prices && product.prices.length > 0 && selectedQty === "") {
      setSelectedQty(product.prices[0].qty);
      setSelectedPrice(product.prices[0].price);
      setSelectedDiscount(product.prices[0].discount);
    }
  }, [product.prices, selectedQty]);

  const addToCartHandler = () => {
    if (selectedQty === "") {
      alert("Please select a quantity first.");
      return;
    }
    dispatch(addToCart(id, noOfProducts, selectedQty, selectedPrice));
  };

  const handleDecreaseQty = () => {
    if (noOfProducts > 1) {
      setNoOfProducts(noOfProducts - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (noOfProducts < product.countInStock) {
      setNoOfProducts(noOfProducts + 1);
    }
  };

  const selectedQtyPrice =
    selectedQty && product.prices
      ? product.prices.find((price) => price.qty === selectedQty)
      : null;

  return (
    <>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6} style={{ position: "relative" }}>
              <Image
                src={process.env.REACT_APP_API_URL + product.image}
                alt={product.name}
                fluid
              />
              {selectedDiscount > 0 && (
                <span
                  className="discount-badge"
                  style={{
                    backgroundColor: "#feb9b9",
                    padding: "4px",
                    color: "#610000",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    textAlign: "right",
                    paddingRight: "4px",
                  }}
                >
                  {selectedDiscount}% OFF
                </span>
              )}
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </ListGroup.Item>
                <ListGroup.Item className="text-muted">
                  Brand:&nbsp;
                  {product.brand}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row className="flex-wrap align-items-center">
                    {product.prices &&
                      product.prices.map((price, index) => (
                        <Col key={price.qty} xs={6} className="mb-2">
                          <Button
                            variant={
                              selectedQty === price.qty ||
                              (index === 0 && selectedQty === "")
                                ? "primary"
                                : "outline-primary"
                            }
                            className="btn-product responsive-button"
                            onClick={() => {
                              setSelectedQty(price.qty);
                              setSelectedPrice(price.price);
                              setSelectedDiscount(price.discount);
                            }}
                            style={{
                              width: "100%",
                              position: "relative",
                              textAlign: "left",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ whiteSpace: "nowrap" }}>
                                {price.qty} {price.units}
                              </span>
                              {price.discount > 0 && (
                                <span
                                  className="discount-badge-on-button"
                                  style={{
                                    backgroundColor: "#feb9b9",
                                    padding: "2px 4px",
                                    color: "#610000",
                                    position: "relative",
                                    right: "-10px",
                                  }}
                                >
                                  {price.discount}%
                                </span>
                              )}
                            </div>
                          </Button>
                        </Col>
                      ))}
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="price-container d-flex justify-content-center">
                    <Card.Text
                      as="h4"
                      className="mr-2"
                      style={{ marginBottom: "0" }}
                    >
                      AED{" "}
                      {selectedQty && selectedQtyPrice?.discount > 0
                        ? (
                            selectedQtyPrice.discountedPrice * noOfProducts
                          ).toFixed(2)
                        : (selectedQtyPrice?.price * noOfProducts).toFixed(2)}
                    </Card.Text>
                    {selectedQtyPrice?.discount > 0 && (
                      <Card.Text
                        as="h6"
                        className="original-price"
                        style={{
                          marginBottom: "0",

                          textDecoration: "line-through",
                        }}
                      >
                        &nbsp;{" "}
                        {(selectedQtyPrice?.price * noOfProducts).toFixed(2)}
                      </Card.Text>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="price-container d-flex justify-content-center">
                      <Card.Text
                        as="h6"
                        className="mr-2"
                        style={{ marginBottom: "0" }}
                      >
                        AED{" "}
                        {selectedQty && selectedQtyPrice?.discount > 0
                          ? (
                              selectedQtyPrice.discountedPrice * noOfProducts
                            ).toFixed(2)
                          : (selectedQtyPrice?.price * noOfProducts).toFixed(2)}
                      </Card.Text>
                      {selectedQtyPrice?.discount > 0 && (
                        <Card.Text
                          as="p"
                          className="original-price"
                          style={{
                            marginBottom: "0",
                            fontSize: "0.8em",
                            textDecoration: "line-through",
                          }}
                        >
                          &nbsp;{" "}
                          {(selectedQtyPrice?.price * noOfProducts).toFixed(2)}
                        </Card.Text>
                      )}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status: </Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <div className="quantity-container">
                            <button
                              className="qty-btn"
                              onClick={handleDecreaseQty}
                            >
                              -
                            </button>
                            <div className="qty-number">{noOfProducts}</div>
                            <button
                              className="qty-btn"
                              onClick={handleIncreaseQty}
                            >
                              +
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="d-grid gap-2">
                    <Button
                      onClick={addToCartHandler}
                      className="button-primary btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
