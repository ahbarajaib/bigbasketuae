import React, { useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import spices from "../images/spices.jpeg";
import legumes from "../images/legumes.jpeg";
import grains from "../images/grains.jpeg";
import oil from "../images/oil.jpeg";
import canned from "../images/canned.jpeg";
import dryfruit from "../images/dryfruit.jpeg";
import beverages from "../images/beverages.jpeg";
import dairy from "../images/dairy.jpeg";
import bakery from "../images/bakery.jpeg";
import wholesale from "../images/wholesale.jpeg";
import fruits from "../images/fruits.jpeg";
import meat from "../images/meat.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryActions";

const Categories = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Display a loading message or any other component when the data is being fetched
  if (loading) return <div>Loading categories...</div>;

  // Display an error message if there was an error fetching the categories
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {(categories || []).map(
          (
            category // Ensure categories is an array
          ) => (
            <Col key={category.id} xs={4} sm={3} md={3} lg={2} className="mb-2">
              <Card className="my-3 border-0 text-center">
                {
                  <a
                    href={`/category/${category.name}`}
                    style={{ display: "block" }}
                  >
                    <div
                      className="rounded-square mx-auto square-category"
                      style={{
                        objectFit: "cover",
                        height: "100px",
                        width: "100px",
                        overflow: "hidden",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={process.env.REACT_APP_API_URL + category.image}
                        alt={category.title}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title as="h5" className="mb-0 smaller-text">
                        {category.title}
                      </Card.Title>
                    </Card.Body>
                  </a>
                }
              </Card>
            </Col>
          )
        )}
      </div>
      <style>
        {`
          @media (max-width: 1199.98px) {
            .col-lg-3, .col-md-4 {
              flex: 0 0 33.33%;
              max-width: 33.33%;
            }
          }

          @media (max-width: 991.98px) {
            .col-sm-6 {
              flex: 0 0 50%;
              max-width: 50%;
            }
          }

          
          }
        `}
      </style>
    </div>
  );
};

export default Categories;
