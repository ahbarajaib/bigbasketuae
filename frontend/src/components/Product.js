import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import {
  addProductToCartFromProductComponent,
  updateSelectedQtyPrice,
} from "../actions/cartActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const [selectedQty, setSelectedQty] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [noOfProducts, setNoOfProducts] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      setSelectedQty(product.prices[0].qty);
      setSelectedUnits(product.prices[0].units);
      setSelectedPrice(product.prices[0].price);
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
      addProductToCartFromProductComponent(
        product._id,
        noOfProducts,
        selectedQty,
        selectedUnits,
        selectedPrice
      )
    );
    navigate(
      `/cart/${product._id}?noOfProducts=${noOfProducts}&selectedQty=${selectedQty}&selectedPrice=${selectedPrice}`
    );
    // Perform any action you need when adding to cart
    // You can dispatch an action or handle it here
    // For demonstration, I'm just logging the selected data
    console.log("Selected Quantity:", selectedQty);
    console.log("Selected Units:", selectedUnits);
    console.log("Selected Price:", selectedPrice);
    console.log("Number of Products:", noOfProducts);
  };

  return (
    <Card className="my-3 rounded">
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
          <Card.Title as="div" style={{ minHeight: "40px" }}>
            <strong>{product?.name}</strong>
          </Card.Title>
        </Link>
        <Card.Subtitle as="div" className="text-muted">
          {product?.brand}
        </Card.Subtitle>
        <div className="d-flex flex-column">
          <div className="w-100 mb-3">
            <Dropdown size="sm">
              <Dropdown.Toggle variant="secondary" id="quantity-dropdown">
                {selectedQty
                  ? `${selectedQty} ${selectedUnits}`
                  : "Select Quantity"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {product?.prices &&
                  product.prices.map((price) => (
                    <Dropdown.Item
                      key={price.qty}
                      active={selectedQty === price.qty}
                      onClick={() =>
                        handleQtySelect(price.qty, price.units, price.price)
                      }
                    >
                      {price.qty} {price.units}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="w-100 text-right">
            <Card.Text as="h2" style={{ marginBottom: "0" }}>
              AED{" "}
              {selectedQty
                ? (selectedPrice * noOfProducts).toFixed(2)
                : (product?.prices && product.prices.length > 0
                    ? product.prices[0].price
                    : 0
                  ).toFixed(2)}
            </Card.Text>
          </div>
        </div>
        <Button
          onClick={addToCartHandler}
          className="button-primary mt-auto"
          variant="primary"
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
