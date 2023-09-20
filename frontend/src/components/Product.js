import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";

const Product = ({ product }) => {
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
  const dispatch = useDispatch();
  useEffect(() => {
    // const cartItem = cartItems.find((item) => item.product === product._id);
    const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
    if (cartItem) {
      setSelectedNoOfProducts(cartItem.variant.selectedNoOfProducts);
    }
  }, [product.prices, cartItems, product._id, selectedQty, cartItemId]);
  console.log(cartItems);

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

      // Update the cart quantity using the cartItemId
      //dispatch(updateCartQuantity(cartItemId, selectedNoOfProducts - 1));
    }
  };

  const handleIncreaseQty = () => {
    if (selectedNoOfProducts < product.countInStock) {
      setSelectedNoOfProducts(selectedNoOfProducts + 1);
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
                      active={selectedQty === price.qty} // Set 'active' based on selectedQty
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
                {(
                  (selectedDiscount > 0
                    ? selectedDiscountedPrice
                    : selectedPrice) *
                  (selectedNoOfProducts > 0 ? selectedNoOfProducts : 1)
                ).toFixed(2)}
              </Card.Text>

              {product?.prices[0]?.discount > 0 ? (
                <Card.Text
                  as="p"
                  className="original-price"
                  style={{ marginBottom: "0", fontSize: "0.7em" }}
                >
                  &nbsp;
                  {typeof selectedPrice === "number"
                    ? (
                        selectedPrice *
                        (selectedNoOfProducts > 0 ? selectedNoOfProducts : 1)
                      ).toFixed(2)
                    : ""}
                </Card.Text>
              ) : null}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* - button */}
          <div className="d-flex align-items-center">
            {/* - button */}
            <Button
              onClick={handleDecreaseQty}
              variant="primary"
              style={{
                width: "30px",
                height: "30px",
                fontSize: "1rem", // Adjust font size as needed
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                marginRight: "2px", // Adjust the margin as needed
              }}
            >
              -
            </Button>

            {/* Quantity display */}
            <div className="qty-number" style={{ fontSize: "1rem" }}>
              {selectedNoOfProducts}
            </div>

            {/* + button */}
            <Button
              onClick={handleIncreaseQty}
              variant="primary"
              style={{
                width: "30px",
                height: "30px",
                fontSize: "1rem", // Adjust font size as needed
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                marginLeft: "2px", // Adjust the margin as needed
              }}
            >
              +
            </Button>
          </div>

          {/* "Add" button */}
          {isProductInCart ? (
            // Display the trash can icon if the product is in the cart
            <Button
              onClick={addToCartHandler}
              className="button-primary small-button"
              variant="primary"
              style={{ fontSize: "1rem", padding: "5px 10px" }}
            >
              <i className="fas fa-trash"></i>
            </Button>
          ) : (
            // Display the "Add" button if the product is not in the cart
            <Button
              onClick={addToCartHandler}
              className="button-primary small-button"
              variant="primary"
              style={{ fontSize: "1rem", padding: "5px 10px" }}
            >
              Add
            </Button>
          )}
        </div>
        {/* {cartItem && cartItem.id === cartItemId ? (
          // If a cart item with the same cartItemId exists, display +/- buttons
          <div className="d-flex justify-content-around mt-1">
            <Button
              onClick={handleDecreaseQty}
              className="qty-button"
              variant="primary"
            >
              -
            </Button>
            <div className="qty-number">{selectedNoOfProducts}</div>
            <Button
              onClick={handleIncreaseQty}
              className="qty-button"
              variant="primary"
            >
              +
            </Button>
          </div>
        ) : (
          // If the item is not in the cart, display the "Add to Cart" button
          <Button
            onClick={addToCartHandler}
            className="button-primary mt-1 small-button"
            variant="primary"
          >
            Add to Cart
          </Button>
        )} */}
      </Card.Body>
    </Card>
  );
};

export default Product;
