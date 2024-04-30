import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import nuts from "../images/special-offers/nuts.avif";
import milk from "../images/special-offers/milk.avif";
import rice from "../images/special-offers/rice.avif";
import snacks from "../images/special-offers/snacks.avif";
import Message from "./Message";
import { listPromotions } from "../actions/promotionActions";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";

const SpecialOffers = () => {
  const dispatch = useDispatch();
  const promotionList = useSelector((state) => state.promotionList);
  const { loading, error, promotions } = promotionList;

  useEffect(() => {
    dispatch(listPromotions());
  }, [dispatch]);

  return (
    <div>
      <h2 className="m-2">Special Offers</h2>
      <Row className="m-2">
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {promotions
          .filter((promo) => promo.isActive)
          .map((promotion) => (
            <Col xs={3} key={promotion.id}>
              {/* Use Link to navigate to the search route */}
              <Link to={`/promotion/${promotion.name}`}>
                {" "}
                {/* Ensure this path is as per your routing setup */}
                <Card className="rounded-lg">
                  <Card.Img
                    variant="top"
                    src={process.env.REACT_APP_API_URL + promotion.image}
                    className="rounded-lg"
                    alt={promotion.title}
                  />
                </Card>
              </Link>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default SpecialOffers;
