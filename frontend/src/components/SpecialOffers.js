import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import nuts from "../images/special-offers/nuts.avif";
import milk from "../images/special-offers/milk.avif";
import rice from "../images/special-offers/rice.avif";
import snacks from "../images/special-offers/snacks.avif";

const SpecialOffers = () => {
  const specialOffers = [
    {
      id: 1,
      title: "Nuts",
      name: "nuts",
      image: nuts, // Replace this with the actual image path
    },
    {
      id: 2,
      title: "Milk",
      name: "milk",
      image: milk, // Replace this with the actual image path
    },
    {
      id: 3,
      title: "Rice",
      name: "rice",
      image: rice, // Replace this with the actual image path
    },
    {
      id: 4,
      title: "Snacks",
      name: "chips",
      image: snacks, // Replace this with the actual image path
    },
  ];

  return (
    <div>
      <h2>Special Offers</h2>
      <Row>
        {specialOffers.map((offer) => (
          <Col xs={3} key={offer.id}>
            {/* Use Link to navigate to the search route */}
            <Link to={`/search/${offer.name}`}>
              <Card>
                <Card.Img variant="top" src={offer.image} alt={offer.title} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SpecialOffers;
