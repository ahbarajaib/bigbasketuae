import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import {
  addProductToCartFromProductComponent,
  updateSelectedQtyPrice,
  addToCart,
} from "../actions/cartActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const [selectedQty, setSelectedQty] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [noOfProducts, setNoOfProducts] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      setSelectedQty(product.prices[0].qty);
      setSelectedUnits(product.prices[0].units);
      setSelectedPrice(product.prices[0].price);
      setDiscountedPrice(product.prices[0].discountedPrice);
      setDiscount(product.prices[0].discount);
    }
  }, [product]);

  const handleQtySelect = (qty, units, price) => {
    setSelectedQty(qty);
    setSelectedUnits(units);
    setSelectedPrice(price);
  };

  const addToCartHandler = () => {
    if (selectedQty === "") {
      alert("Please select a quantity first.");
      return;
    }

    dispatch(
      addToCart(
        product._id,
        noOfProducts,
        selectedQty,
        selectedPrice,
        discountedPrice,
        discount
      )
    );
  };

  const selectedQuantityPrice = product.prices.find(
    (price) => price.qty === selectedQty
  );
  const selectedDiscount = selectedQuantityPrice
    ? selectedQuantityPrice.discount
    : 0;

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
              <Card.Text as="h6" className="mr-2" style={{ marginBottom: "0" }}>
                AED{" "}
                {selectedQty && product?.prices?.length > 0
                  ? (
                      selectedPrice *
                      (1 -
                        (product.prices.find(
                          (price) => price.qty === selectedQty
                        )?.discount || 0) /
                          100) *
                      noOfProducts
                    ).toFixed(2)
                  : "Calculation Error"}
              </Card.Text>

              {product?.prices[0]?.discount > 0 ? (
                <Card.Text
                  as="p"
                  className="original-price"
                  style={{ marginBottom: "0", fontSize: "0.8em" }}
                >
                  &nbsp;{" "}
                  {selectedQty && product?.prices?.length > 0
                    ? (selectedPrice * noOfProducts).toFixed(2)
                    : "Calculation Error"}
                </Card.Text>
              ) : null}
            </div>
          </div>
        </div>
        <Button
          onClick={addToCartHandler}
          className="button-primary mt-1 small-button"
          variant="primary"
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
