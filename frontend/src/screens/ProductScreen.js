import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { listProductDetails } from "../actions/productActions";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { categoryProducts } from "../actions/productActions";
import Product from "../components/Product";
import SEO from "../components/SEO";
import ReactMarkdown from "react-markdown";
import { listCategories } from "../actions/categoryActions";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { category } = categoryDetails; // Assuming this contains the fetched category details

  const similarProducts = useSelector((state) => state.productCategory); // Assuming this is used to store similar products based on category
  const {
    loading: loadingSimilar,
    error: errorSimilar,
    products: similarProductsList,
  } = similarProducts;

  const [selectedQty, setSelectedQty] = useState(
    product.prices && product.prices.length > 0 ? product.prices[0].qty : ""
  );

  const [selectedUnits, setSelectedUnits] = useState(
    product.prices && product.prices.length > 0 ? product.prices[0].units : ""
  );
  const [selectedPrice, setSelectedPrice] = useState(
    product.prices && product.prices.length > 0 ? product.prices[0].price : ""
  );
  const [selectedDiscount, setSelectedDiscount] = useState(
    product.prices && product.prices.length > 0
      ? product.prices[0].discount
      : ""
  );
  const [selectedDiscountedPrice, setSelectedDiscountedPrice] = useState(
    product.prices && product.prices.length > 0
      ? product.prices[0].discountedPrice
      : ""
  );
  const [selectedNoOfProducts, setSelectedNoOfProducts] = useState(1); // Initialize to 0
  const [cartItemId, setCartItemId] = useState("");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const productCategory = useSelector((state) => state.productCategory);

  const {
    loading: categoryLoading,
    error: categoryError,
    products,
  } = productCategory;

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
    if (cartItem) {
      setSelectedNoOfProducts(cartItem.variant.selectedNoOfProducts);
    }
  }, [product.prices, cartItems, cartItemId]);
  useEffect(() => {
    if (id) {
      dispatch(listProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      const initialPrice = product.prices[0];
      setSelectedQty(initialPrice.qty);
      setSelectedUnits(initialPrice.units);
      setSelectedPrice(initialPrice.price);
      setSelectedDiscount(initialPrice.discount);
      setSelectedDiscountedPrice(initialPrice.discountedPrice);
      setCartItemId(`${product._id}-${initialPrice.qty}`);
    }
  }, [product]);
  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.category) {
      dispatch(listCategories()); // Fetch all categories to find the one matching product.category
    }
  }, [dispatch, product]);

  useEffect(() => {
    // Once categories are loaded, find the current product's category details
    const currentCategory = category.find(
      (cat) => cat._id === product.category
    );
    if (currentCategory) {
      dispatch(categoryProducts("", "", currentCategory.name)); // Fetch similar products based on category name or other identifier
    }
  }, [category, dispatch, product]);

  const isProductInCart = cartItems.some(
    (item) => item.cartItemId === `${product._id}-${selectedQty}`
  );

  const addToCartHandler = () => {
    const cartItemId = `${product._id}-${selectedQty}`;
    // If quantity is 0, add to cart with quantity 1
    const variant = {
      selectedQty,
      selectedPrice,
      selectedDiscount,
      selectedDiscountedPrice,
      selectedUnits,
      selectedNoOfProducts,
    };
    if (isProductInCart) {
      // If the product is in the cart, remove it
      dispatch(removeFromCart(cartItemId));
    } else {
      // If the product is not in the cart, add it
      dispatch(addToCart(product, variant, cartItemId));
    }
  };

  const handleQtySelect = (
    qty,
    noOfProducts,
    units,
    price,
    discount,
    discountedPrice
  ) => {
    setSelectedQty(qty);
    setSelectedNoOfProducts(noOfProducts);
    setSelectedUnits(units);
    setSelectedPrice(price);
    setSelectedDiscount(discount);
    setSelectedDiscountedPrice(discountedPrice);
    const newCartItemId = `${product._id}-${qty}`;
    setCartItemId(newCartItemId);
  };

  const handleDecreaseQty = () => {
    if (selectedNoOfProducts > 1) {
      setSelectedNoOfProducts(selectedNoOfProducts - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (selectedNoOfProducts < product.countInStock) {
      setSelectedNoOfProducts(selectedNoOfProducts + 1);
    }
  };

  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Shuffle the products array randomly
    const shuffledProducts = (products || []).sort(() => Math.random() - 0.5);
    setRandomProducts(shuffledProducts);
    console.log(shuffledProducts);
  }, [products]);

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
          <SEO
            title={`${product.name} | Big Basket UAE`}
            description={
              product.description ? product.description.substring(0, 150) : ""
            } // Limit description to 150 characters or any suitable length
          />
          <Row>
            <Col
              md={6}
              style={{ position: "relative" }}
              className="d-flex justify-content-center"
            >
              <Image
                src={process.env.REACT_APP_API_URL + product.image}
                alt={product.name}
                fluid
                style={{
                  maxWidth: "75%", // Set maximum width to 100%
                  height: "auto", // Ensure aspect ratio is maintained
                }}
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
                      product.prices.map((price) => (
                        <Col
                          key={price.qty}
                          xs={3}
                          sm={3}
                          md={6}
                          lg={6}
                          className="mb-2"
                        >
                          <Button
                            variant={
                              selectedQty === price.qty
                                ? "primary"
                                : "outline-primary"
                            }
                            className="btn-product responsive-button"
                            onClick={() =>
                              handleQtySelect(
                                price.qty,
                                price.noOfProducts,
                                price.units,
                                price.price,
                                price.discount,
                                price.discountedPrice
                              )
                            }
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
                      {(
                        (selectedDiscount > 0
                          ? selectedDiscountedPrice
                          : selectedPrice) *
                        (selectedNoOfProducts > 0 ? selectedNoOfProducts : 1)
                      ).toFixed(2)}
                    </Card.Text>
                    {selectedDiscount > 0 && (
                      <Card.Text
                        as="p"
                        className="original-price"
                        style={{ marginBottom: "0", fontSize: "0.7em" }}
                      >
                        &nbsp;
                        {typeof selectedPrice === "number"
                          ? (
                              selectedPrice *
                              (selectedNoOfProducts > 0
                                ? selectedNoOfProducts
                                : 1)
                            ).toFixed(2)
                          : ""}
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
                        {(
                          (selectedDiscount > 0
                            ? selectedDiscountedPrice
                            : selectedPrice) *
                          (selectedNoOfProducts > 0 ? selectedNoOfProducts : 1)
                        ).toFixed(2)}
                      </Card.Text>
                      {selectedDiscount > 0 && (
                        <Card.Text
                          as="p"
                          className="original-price"
                          style={{ marginBottom: "0", fontSize: "0.7em" }}
                        >
                          &nbsp;
                          {typeof selectedPrice === "number"
                            ? (
                                selectedPrice *
                                (selectedNoOfProducts > 0
                                  ? selectedNoOfProducts
                                  : 1)
                              ).toFixed(2)
                            : ""}
                        </Card.Text>
                      )}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status: </Col>
                      <Col>
                        {product.countInStock < 10
                          ? `${product.countInStock} in Stock`
                          : product.countInStock > 0
                          ? "In Stock"
                          : "Out Of Stock"}
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
                            <div className="qty-number">
                              {selectedNoOfProducts}
                            </div>
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
                      {isProductInCart ? "Remove from Cart" : "Add To Cart"}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Row>
              <Card.Text
                as="div"
                className="mr-2"
                style={{
                  marginTop: "2em",
                  marginLeft: "1em",
                  marginRight: "1em",
                }}
              >
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </Card.Text>
            </Row>
          </Row>
          <h3>Similar Products</h3>
          {categoryLoading ? (
            <Loader />
          ) : categoryError ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Row className="d-flex flex-nowrap">
                {randomProducts.map((product) => (
                  <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Product
                      product={product}
                      category={product.category.name}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductScreen;
