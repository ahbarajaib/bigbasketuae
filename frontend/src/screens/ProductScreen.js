import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProductDetails } from "../actions/productActions";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { categoryProducts } from "../actions/productActions";
import Product from "../components/Product";
import SEO from "../components/SEO";
import { listCategories } from "../actions/categoryActions";
import ProductFrequent from "../components/ProductFrequent";
import DOMPurify from "dompurify";
import organic from "../images/organic.png";
import bulk from "../images/bulk.png";
import { LinkContainer } from "react-router-bootstrap";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const currentCategoryName = product?.category?.name;
  const frequentlyBought = product?.frequentlyBought;
  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { category } = categoryDetails; // Assuming this contains the fetched category details

  const [selectedPriceVariant, setSelectedPriceVariant] = useState(null);

  const [cartItemId, setCartItemId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const calculateTotalAmount = () => {
    let total = 0;
    selectedProducts.forEach((product) => {
      const price =
        product.variant.discount > 0
          ? product.variant.discountedPrice
          : product.variant.price;
      total += price;
    });
    return total.toFixed(2);
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const productCategory = useSelector((state) => state.productCategory);
  const {
    loading: categoryLoading,
    error: categoryError,
    products,
  } = productCategory;
  useEffect(() => {
    // If a cart item ID is set, find the corresponding item in the cart
    if (cartItemId && selectedPriceVariant) {
      const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);

      // If the cart item exists and the quantity is different, update the selected variant
      if (cartItem && cartItem.quantity !== selectedPriceVariant.noOfProducts) {
        setSelectedPriceVariant((prev) => ({
          ...prev,
          noOfProducts: cartItem.quantity,
        }));
      }
    }
  }, [cartItems, cartItemId, selectedPriceVariant]);

  useEffect(() => {
    if (id) {
      dispatch(listProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      setSelectedPriceVariant({
        ...product.prices[0],
        noOfProducts: 1, // Setting initial quantity of selected variant
      });
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
    if (currentCategoryName) {
      dispatch(categoryProducts(currentCategoryName));
    }
  }, [dispatch, currentCategoryName]);

  const increaseQty = () => {
    if (
      selectedPriceVariant &&
      selectedPriceVariant.noOfProducts < product.countInStock
    ) {
      setSelectedPriceVariant((prevVariant) => ({
        ...prevVariant,
        noOfProducts: prevVariant.noOfProducts + 1,
      }));
    }
  };

  const decreaseQty = () => {
    if (selectedPriceVariant && selectedPriceVariant.noOfProducts > 1) {
      setSelectedPriceVariant((prevVariant) => ({
        ...prevVariant,
        noOfProducts: prevVariant.noOfProducts - 1,
      }));
    }
  };

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const newSelection = new Map(prevSelectedProducts);
      if (newSelection.has(product._id)) {
        newSelection.delete(product._id);
      } else {
        newSelection.set(product._id, product);
      }
      return newSelection;
    });
  };

  useEffect(() => {
    // Default selection of frequently bought products
    if (frequentlyBought && frequentlyBought.length > 0) {
      const defaultSelection = new Map(selectedProducts);
      frequentlyBought.forEach((product) => {
        defaultSelection.set(product._id, product);
      });
      setSelectedProducts(defaultSelection);
    }
  }, [frequentlyBought]);

  const bulkAddToCart = () => {
    selectedProducts.forEach((product, productId) => {
      const cartItemId = `${product.productId._id}-${product.variantId}`; // Ensure unique IDs are used
      const cartItem = {
        product: product.productId,
        variant: {
          ...product.variant,
          product_id: product.productId._id, // Include the product ID inside the variant for easy reference
        },
        cartItemId: cartItemId,
      };

      dispatch(addToCart(cartItem)); // Pass the entire cartItem object
    });
  };

  const addToCartHandler = () => {
    if (selectedPriceVariant) {
      const cartItemId = `${product._id}-${selectedPriceVariant._id}`; // Ensure unique IDs are used
      const cartItem = {
        product: product,
        variant: {
          ...selectedPriceVariant,
          product_id: product._id, // Include the product ID inside the variant for easy reference
        },
        cartItemId: cartItemId,
      };
      // This checks if the item is already in the cart
      if (isProductInCart(cartItemId)) {
        dispatch(removeFromCart(cartItemId));
      } else {
        dispatch(addToCart(cartItem)); // Pass the entire cartItem object
      }
    }
  };

  const isProductInCart = (cartItemId) => {
    return cartItems.some((item) => item.cartItemId === cartItemId);
  };

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }

  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Shuffle the products array randomly
    const shuffledProducts = (products || []).sort(() => Math.random() - 0.5);
    setRandomProducts(shuffledProducts);
  }, [products]);

  return (
    <>
      <Button
        className="my-3 border"
        variant="light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
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
              md={5}
              style={{ position: "relative" }}
              className="d-flex justify-content-center"
            >
              <div style={{ position: "relative" }}>
                <Image
                  className="border"
                  src={process.env.REACT_APP_API_URL + product.image}
                  alt={product.name}
                  fluid
                  style={{
                    width: "100%", // Fill the width of its container
                    height: "auto", // Maintain aspect ratio
                  }}
                />
                {selectedPriceVariant && selectedPriceVariant.discount > 0 && (
                  <span
                    className="discount-badge"
                    style={{
                      backgroundColor: "#DC143C",
                      padding: "4px",
                      color: "white",
                    }}
                  >
                    <strong>
                      {selectedPriceVariant && selectedPriceVariant.discount}%
                      OFF
                    </strong>
                  </span>
                )}
                {product.isOrganic && (
                  <img
                    src={organic}
                    alt="Organic"
                    style={{
                      position: "absolute",
                      padding: "4px",
                      top: "0",
                      right: "0",
                      width: "96px",
                      height: "96px",
                    }}
                  />
                )}
                {product.isBulk && (
                  <img
                    src={bulk}
                    alt="Bulk"
                    style={{
                      position: "absolute",
                      padding: "4px",
                      top: product.isOrganic ? "96px" : "0",
                      right: "0",
                      width: "96px",
                      height: "96px",
                    }}
                  />
                )}
              </div>
              {/* Check if there is a discount on the selected variant and display a badge if there is */}
            </Col>

            <Col md={3}>
              <ListGroup variant="flush" className="border">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                  {product.subtitle && product.subtitle.trim() !== "" && (
                    <p style={{ fontSize: "18px" }}>{product.subtitle}</p>
                  )}
                  <p style={{ fontSize: "16px", color: "#666" }}>
                    {product.category?.title || product.category}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item className="text-muted">
                  Brand:&nbsp;
                  {product.brand}
                </ListGroup.Item>
                {product.countryOfOrigin &&
                  product.countryOfOrigin.trim() !== "" && (
                    <ListGroup.Item>
                      <span style={{ fontWeight: "500" }}>
                        Country Of Origin:
                      </span>
                      &nbsp;
                      {product.countryOfOrigin}
                    </ListGroup.Item>
                  )}
                <ListGroup.Item>
                  <Row className="flex-wrap align-items-center">
                    {product.prices &&
                      product.prices.map((price, index) => (
                        <Col
                          key={index} // Changed from price.qty to index for uniqueness
                          xs={6}
                          sm={3}
                          md={6}
                          lg={6}
                          className="mb-2"
                        >
                          <Button
                            variant={
                              selectedPriceVariant &&
                              selectedPriceVariant._id === price._id
                                ? "primary"
                                : "outline-primary"
                            }
                            className="btn responsive-button "
                            onClick={() =>
                              setSelectedPriceVariant({
                                ...price,
                                noOfProducts: 1,
                              })
                            } // Simplified to set the selected variant directly
                            style={{
                              width: "100%",
                              position: "relative",
                              textAlign: "left",
                              backgroundColor:
                                selectedPriceVariant &&
                                selectedPriceVariant._id === price._id
                                  ? "#117a30"
                                  : "",
                              color:
                                selectedPriceVariant &&
                                selectedPriceVariant._id === price._id
                                  ? "#fff"
                                  : "",
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
                    {selectedPriceVariant && (
                      <>
                        <Card.Text
                          as="h4"
                          className="mr-2"
                          style={{ marginBottom: "0" }}
                        >
                          AED{" "}
                          {(
                            (selectedPriceVariant.discount > 0
                              ? selectedPriceVariant.discountedPrice
                              : selectedPriceVariant.price) *
                            (selectedPriceVariant.noOfProducts > 0
                              ? selectedPriceVariant.noOfProducts
                              : 1)
                          ).toFixed(2)}
                        </Card.Text>
                        {selectedPriceVariant.discount > 0 && (
                          <Card.Text
                            as="p"
                            className="original-price"
                            style={{ marginBottom: "0", fontSize: "0.7em" }}
                          >
                            &nbsp;
                            {(
                              selectedPriceVariant.price *
                              (selectedPriceVariant.noOfProducts > 0
                                ? selectedPriceVariant.noOfProducts
                                : 1)
                            ).toFixed(2)}
                          </Card.Text>
                        )}
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3} className="m-2">
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="price-container d-flex justify-content-center">
                      {selectedPriceVariant && (
                        <>
                          <Card.Text
                            as="h6"
                            className="mr-2"
                            style={{ marginBottom: "0" }}
                          >
                            AED{" "}
                            {(
                              (selectedPriceVariant.discount > 0
                                ? selectedPriceVariant.discountedPrice
                                : selectedPriceVariant.price) *
                              selectedPriceVariant.noOfProducts
                            ).toFixed(2)}
                          </Card.Text>
                          {selectedPriceVariant.discount > 0 && (
                            <Card.Text
                              as="p"
                              className="original-price"
                              style={{ marginBottom: "0", fontSize: "0.7em" }}
                            >
                              &nbsp;
                              {(
                                selectedPriceVariant.price *
                                selectedPriceVariant.noOfProducts
                              ).toFixed(2)}
                            </Card.Text>
                          )}
                        </>
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
                        {selectedPriceVariant && (
                          <Col md={6} className="mb-3">
                            <div className="quantity-container">
                              <button className="qty-btn" onClick={decreaseQty}>
                                -
                              </button>
                              <span className="qty-number">
                                {selectedPriceVariant.noOfProducts}
                              </span>
                              <button className="qty-btn" onClick={increaseQty}>
                                +
                              </button>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="d-grid gap-2">
                    {isProductInCart(
                      `${product._id}-${selectedPriceVariant?._id}`
                    ) ? (
                      <Button
                        onClick={addToCartHandler}
                        className="btn btn-lg"
                        variant="danger"
                        type="button"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={addToCartHandler}
                        className="btn btn-lg btn-block btn-custom border-0"
                        type="button"
                      >
                        Add to Cart
                      </Button>
                    )}
                    {isProductInCart(
                      `${product._id}-${selectedPriceVariant?._id}`
                    ) && (
                      <LinkContainer to="/cart">
                        <Button
                          className="btn btn-lg btn-block btn-checkout border-0"
                          type="button"
                        >
                          Checkout
                        </Button>
                      </LinkContainer>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            {frequentlyBought && frequentlyBought.length > 0 && (
              <div className="frequentlyBought-container m-2">
                {" "}
                <h2>Frequently Bought Together</h2>
                <div className=" bg-white border-change rounded m-2">
                  <Row>
                    {frequentlyBought.map((product) => (
                      <Col key={product._id} className="frequentlyBought-item">
                        <ProductFrequent
                          product={product}
                          handleCheckboxChange={handleCheckboxChange}
                          isChecked={selectedProducts.has(product._id)}
                          totalProducts={frequentlyBought.length}
                        />
                      </Col>
                    ))}
                  </Row>
                  <div className="row d-flex align-items-center justify-content-center m-2">
                    <div className="col-auto">
                      <Button
                        onClick={bulkAddToCart}
                        disabled={selectedProducts.size === 0}
                        className="btn-lg bg-primary-500 border-0"
                      >
                        Add Selected to Cart
                      </Button>
                    </div>
                    <div className="col-auto">
                      <h4>AED&nbsp;{calculateTotalAmount()}</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                <div
                  className="preview-description"
                  dangerouslySetInnerHTML={createMarkup(product.description)}
                ></div>{" "}
              </Card.Text>
            </Row>
          </Row>
          {categoryLoading ? (
            <Loader />
          ) : categoryError ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <h3 className="m-2">Similar Products</h3>
              <div style={{ overflowX: "auto" }} className="m-2">
                <Row className="d-flex flex-nowrap">
                  {randomProducts.map((product) => (
                    <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                      <Product
                        product={product}
                        category={product.category ? product.category.name : ""}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductScreen;
