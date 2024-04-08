import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
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
      <Row className="justify-content-center">
        {(categories || []).map((category) => (
          <Col
            key={category._id}
            xs={3}
            sm={3}
            md={3}
            lg={2}
            xl={2}
            className="mb-4"
          >
            <div className="category-card">
              <a href={`/category/${category.name}`}>
                <div className="image-container">
                  <img
                    src={process.env.REACT_APP_API_URL + category.image}
                    alt={category.title}
                    className="category-image"
                  />
                </div>
                <div className="text">{category.title}</div>
              </a>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Categories;
