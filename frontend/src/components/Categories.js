import React, { useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryActions";

const Categories = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {(categories || []).map((category) => (
          <Col key={category._id} xs={6} sm={4} md={3} lg={2} className="mb-4">
            <Card className="h-100 border-0 text-center ">
              <a
                href={`/category/${category.name}`}
                style={{ display: "block" }}
              >
                <Card.Img
                  variant="top"
                  src={process.env.REACT_APP_API_URL + category.image}
                  alt={category.title}
                  style={{
                    objectFit: "cover",
                    height: "200px",
                  }} // Adjust height as needed
                />
                <Card.Body>
                  <Card.Title as="h5" className="mb-0">
                    {category.title}
                  </Card.Title>
                </Card.Body>
              </a>
            </Card>
          </Col>
        ))}
      </div>
    </div>
  );
};

export default Categories;
