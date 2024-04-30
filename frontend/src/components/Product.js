import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "./QuantitySelector";
import QuantityDropdown from "./QuantityDropdown";

const Product = ({ product }) => {
  const [selectedPriceVariant, setSelectedPriceVariant] = useState(null);
  const [cartItemId, setCartItemId] = useState("");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
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
    if (product && product.prices && product.prices.length > 0) {
      setSelectedPriceVariant({
        ...product.prices[0],
        noOfProducts: 1, // Setting initial quantity of selected variant
      });
    }
  }, [product]);

  const isProductInCart = (cartItemId) => {
    return cartItems.some((item) => item.cartItemId === cartItemId);
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

  const decreaseQty = () => {
    if (selectedPriceVariant && selectedPriceVariant.noOfProducts > 1) {
      setSelectedPriceVariant((prevVariant) => ({
        ...prevVariant,
        noOfProducts: prevVariant.noOfProducts - 1,
      }));
    }
  };

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

  return (
    <Card className="my-1 rounded product-card">
      {selectedPriceVariant && selectedPriceVariant.discount > 0 && (
        <span
          className="discount-badge"
          style={{
            backgroundColor: "#feb9b9",
            padding: "4px",
            color: "#610000",
          }}
        >
          {selectedPriceVariant && selectedPriceVariant.discount}% OFF
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
            padding: "2px",
          }}
          loading="lazy"
        />
      </Link>
      <Card.Body className="text-center d-flex flex-column">
        <Link to={`/product/${product?._id}`}>
          <Card.Title
            as="div"
            className="two-line-clamp"
            style={{ fontWeight: "600" }}
          >
            {product?.name}
          </Card.Title>
        </Link>
        <Card.Subtitle
          as="div"
          className="text-muted mb-2"
          style={{ fontSize: "0.75rem" }}
        >
          {product?.brand}
        </Card.Subtitle>
        <div className="row">
          <div className="col-sm m-0 p-0">
            <QuantityDropdown
              product={product}
              selectedPriceVariant={selectedPriceVariant}
              setSelectedPriceVariant={setSelectedPriceVariant}
            />
          </div>
          <div className="col-sm m-0 p-0">
            <QuantitySelector
              selectedPriceVariant={selectedPriceVariant}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
            />
          </div>
        </div>
        <div>
          <div className="w-100 text-right pt-4 pb-2">
            <div className="price-container d-flex justify-content-center">
              <Card.Text
                as="p"
                className="mr-2"
                style={{ marginBottom: "0", fontSize: "1em" }}
              >
                AED{" "}
                {(
                  (selectedPriceVariant && selectedPriceVariant.discount > 0
                    ? selectedPriceVariant.discountedPrice
                    : selectedPriceVariant
                    ? selectedPriceVariant.price
                    : 0) *
                  (selectedPriceVariant ? selectedPriceVariant.noOfProducts : 1)
                ).toFixed(2)}
              </Card.Text>

              {selectedPriceVariant && selectedPriceVariant.discount > 0 ? (
                <Card.Text
                  as="p"
                  className="original-price"
                  style={{ marginBottom: "0", fontSize: "0.7em" }}
                >
                  &nbsp;
                  {typeof selectedPriceVariant.price === "number"
                    ? (
                        selectedPriceVariant.price *
                        (selectedPriceVariant.noOfProducts > 0
                          ? selectedPriceVariant.noOfProducts
                          : 1)
                      ).toFixed(2)
                    : ""}
                </Card.Text>
              ) : null}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* - button */}
          {product &&
          selectedPriceVariant &&
          isProductInCart(`${product._id}-${selectedPriceVariant._id}`) ? (
            <Button
              onClick={addToCartHandler}
              className=""
              variant="danger"
              style={{ width: "100%" }} // Add custom styles
            >
              Remove
            </Button>
          ) : (
            <Button
              onClick={addToCartHandler}
              className=""
              variant="success"
              style={{ width: "100%" }} // Add custom styles
            >
              Add
            </Button>
          )}
        </div>
      </Card.Body>
      {/* <Card.Footer className="border-0 m-0 p-0">
        <small className="text-muted p-1">Incl. of VAT</small>
      </Card.Footer> */}
    </Card>
  );
};

export default Product;
