import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductFrequent = ({ product, handleCheckboxChange, isChecked }) => {
  return (
    <Card className="m-2 rounded product-card">
      <Card.Body className="d-flex flex-row p-2">
        <div className="col-3">
          <Link to={`/product/${product?.productId?._id}`}>
            <Card.Img
              variant="top"
              src={process.env.REACT_APP_API_URL + product?.productId?.image}
              style={{
                objectFit: "cover",
                height: "100px",
                borderRadius: "10px",
                padding: "5px",
              }}
            />
          </Link>
        </div>
        <div className="col-6">
          <Card.Text className="text-center">
            {product.productId.name}
          </Card.Text>
          <Card.Text className="text-center">
            {product?.variant?.qty}&nbsp; {product?.variant?.units}
            <br />
            <strong>AED&nbsp;{product?.variant?.price}</strong>
          </Card.Text>
        </div>
        <div className="col-3 d-flex align-items-center justify-content-end p-4">
          <Form.Check
            type="checkbox"
            className="large-checkbox"
            checked={isChecked}
            onChange={() => handleCheckboxChange(product)}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductFrequent;
