import React from "react";
import brand1 from "../images/brand-images/brand1.png";
import brand2 from "../images/brand-images/brand2.png";
import brand3 from "../images/brand-images/brand3.png";
import brand4 from "../images/brand-images/brand4.png";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const BrandProducts = () => {
  return (
    <div>
      <h2 className="m-2">Top Brands</h2>
      <Row className="m-2">
        <Col md={3} lg={3} xs={3} sm={3} className="m-0 p-0 px-1">
          <Link to={`/search/haldirams`}>
            <Card.Img src={brand1} className="rounded-image" />
          </Link>
        </Col>
        <Col md={3} lg={3} xs={3} sm={3} className="m-0 p-0 px-1">
          <Link to={`/search/nellara`}>
            <Card.Img src={brand2} className="rounded-image" />
          </Link>
        </Col>
        <Col md={3} lg={3} xs={3} sm={3} className="m-0 p-0 px-1">
          <Link to={`/search/mudhish`}>
            <Card.Img src={brand3} className="rounded-image" />
          </Link>
        </Col>
        <Col md={3} lg={3} xs={3} sm={3} className="m-0 p-0 px-1">
          <Link to={`/category/wholesale`}>
            <Card.Img src={brand4} className="rounded-image" />
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default BrandProducts;
