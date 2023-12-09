import React from "react";
import { Card, Row, Col } from "react-bootstrap";

import nuts from "../images/bannersSmall/spices-and-condiments/sc1.png";

const CategoryBannerSmall = () => {
  // Define the specialOffer data within the component
  const banner = {
    title: "spices-and-condiments",
    image: nuts,
  };
  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Img
              variant="top"
              src={banner.image}
              alt={banner.title}
              style={{ maxHeight: "200px" }} // Set the max height here
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CategoryBannerSmall;
