import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { categoryProducts } from "../actions/productActions";

const ProductCategoryScreen = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1, category } = useParams();

  const productCategory = useSelector((state) => state.productCategory);
  const { loading, error, products, page, pages } = productCategory;

  useEffect(() => {
    // Check if the category is 'all' and conditionally dispatch the action
    //all displays all the product related code is in getProductByCategory in productController
    if (category && category.toLowerCase() === "all") {
      dispatch(categoryProducts(keyword, pageNumber, ""));
    } else {
      dispatch(categoryProducts(keyword, pageNumber, category));
    }
  }, [dispatch, keyword, pageNumber, category]);

  return (
    <>
      <Meta />

      <h1>{category}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={2} xl={2}>
                <Product product={product} category={category} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default ProductCategoryScreen;
