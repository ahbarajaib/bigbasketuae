import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Dropdown, Col } from "react-bootstrap";
import {
  addProductToCartFromProductComponent,
  updateSelectedQtyPrice,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const [selectedQty, setSelectedQty] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [selectedDiscountedPrice, setSelectedDiscountedPrice] = useState("");
  const [noOfProducts, setNoOfProducts] = useState(0); // Initialize to 0
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (product.prices && product.prices.length > 0) {
      setSelectedQty(product.prices[0].qty);
      setSelectedPrice(product.prices[0].price);
      setSelectedDiscountedPrice(product.prices[0].discountedPrice);
      setSelectedDiscount(product.prices[0].discount);
      setSelectedUnits(product.prices[0].units);
    }
    const cartItem = cartItems.find((item) => item.product === product._id);
    if (cartItem) {
      setNoOfProducts(cartItem.noOfProducts);
    }
  }, [product.prices, cartItems]);

  const handleQtySelect = (qty, units, price) => {
    setSelectedQty(qty);
    setSelectedUnits(units);
    setSelectedPrice(price);
  };

  const addToCartHandler = () => {
    if (selectedQty === "") {
      setSelectedQty(product.prices[0].qty);
      setSelectedPrice(product.prices[0].price);
      setSelectedDiscountedPrice(product.prices[0].discountedPrice);
      setSelectedDiscount(product.prices[0].discount);
      setSelectedUnits(product.prices[0].units);
    }

    if (noOfProducts === 0) {
      // If quantity is 0, add to cart with quantity 1
      dispatch(
        addToCart(
          product._id,
          1,
          selectedQty,
          selectedPrice,
          selectedDiscount,
          selectedDiscountedPrice,
          selectedUnits
        )
      );
      setNoOfProducts(1);
    } else {
      // If quantity is not 0, remove from cart
      dispatch(removeFromCart(product._id));
      setNoOfProducts(0);
    }
  };

  const selectedQuantityPrice = product.prices.find(
    (price) => price.qty === selectedQty
  );

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    setNoOfProducts(0);
  };

  const handleDecreaseQty = () => {
    if (noOfProducts > 1) {
      setNoOfProducts(noOfProducts - 1);
      dispatch(updateCartQuantity(product._id, noOfProducts - 1));
    } else if (noOfProducts === 1) {
      // If quantity is 1 and we click "-", remove from cart
      dispatch(removeFromCart(product._id));
      setNoOfProducts(0);
    }
  };
  const handleIncreaseQty = () => {
    if (noOfProducts < product.countInStock) {
      setNoOfProducts(noOfProducts + 1);
      // Update the cart quantity after updating the component's state
      dispatch(updateCartQuantity(product._id, noOfProducts + 1));
    }
  };

  return (
    <Card className="my-3 rounded product-card">
      {selectedDiscount > 0 && (
        <span
          className="discount-badge"
          style={{
            backgroundColor: "#feb9b9",
            padding: "4px",
            color: "#610000",
          }}
        >
          {selectedDiscount}% OFF
        </span>
      )}
      <Link to={`/product/${product?._id}`} style={{ display: "block" }}>
        <Card.Img
          src={`${process.env.REACT_APP_API_URL}${product?.image}`}
          variant="top"
          style={{
            objectFit: "cover",
            height: "200px",
            borderRadius: "10px",
          }}
        />
      </Link>
      <Card.Body className="text-center d-flex flex-column">
        <Link to={`/product/${product?._id}`}>
          <Card.Title as="div" style={{ minHeight: "60px", fontWeight: "600" }}>
            {product?.name}
          </Card.Title>
        </Link>
        <Card.Subtitle
          as="div"
          className="text-muted"
          style={{ fontSize: "0.75rem" }}
        >
          {product?.brand}
        </Card.Subtitle>

        <div className="d-flex flex-column">
          <div className="w-100 mb-2">
            <Dropdown size="sm">
              <Dropdown.Toggle
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "white",
                  color: "black",
                  marginTop: "0.25rem",
                }}
                variant="secondary"
                id="quantity-dropdown"
              >
                {selectedQty ? `${selectedQty} ${selectedUnits}` : "Select Qty"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ fontSize: "0.75rem" }}>
                {product?.prices &&
                  product.prices.map((price) => (
                    <Dropdown.Item
                      key={price.qty}
                      active={selectedQty === price.qty}
                      onClick={() =>
                        handleQtySelect(
                          price.qty,
                          price.units,
                          price.price,
                          price.discount
                        )
                      }
                    >
                      {price.qty} {price.units}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="w-100 text-right">
            <div className="price-container d-flex justify-content-center">
              <Card.Text
                as="p"
                className="mr-2"
                style={{ marginBottom: "0", fontSize: "1em" }}
              >
                AED{" "}
                {noOfProducts > 0
                  ? (
                      selectedPrice *
                      (1 -
                        (product.prices.find(
                          (price) => price.qty === selectedQty
                        )?.discount || 0) /
                          100) *
                      noOfProducts
                    ).toFixed(2)
                  : product?.prices?.length > 0
                  ? product.prices[0].price.toFixed(2)
                  : "Select Qty"}{" "}
                {/* Display product.prices[0].price when noOfProducts is 0 */}
              </Card.Text>
              {product?.prices[0]?.discount > 0 ? (
                <Card.Text
                  as="p"
                  className="original-price"
                  style={{ marginBottom: "0", fontSize: "0.7em" }}
                >
                  &nbsp;{" "}
                  {noOfProducts > 0
                    ? (selectedPrice * noOfProducts).toFixed(2)
                    : product?.prices?.length > 0
                    ? (product.prices[0].price * noOfProducts).toFixed(2)
                    : "Select Qty"}{" "}
                  {/* Display product.prices[0].price when noOfProducts is 0 */}
                </Card.Text>
              ) : null}
            </div>
          </div>
        </div>
        {noOfProducts === 0 ? (
          <Button
            onClick={addToCartHandler}
            className="button-primary mt-1 small-button"
            variant="primary"
          >
            Add to Cart
          </Button>
        ) : (
          <div className="d-flex justify-content-around mt-1">
            <Button
              onClick={handleDecreaseQty}
              className="qty-button"
              variant="primary"
            >
              -
            </Button>
            <div className="qty-number">{noOfProducts}</div>
            <Button
              onClick={handleIncreaseQty}
              className="qty-button"
              variant="primary"
            >
              +
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
