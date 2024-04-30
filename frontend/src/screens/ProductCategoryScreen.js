import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import SEO from "../components/SEO";
import seoData from "../data/SEOData.json";
import { categoryProducts } from "../actions/productActions";
import CarouselContainer from "../components/CarouselContainer";
import Paginate from "../components/Paginate";

const ProductCategoryScreen = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const currentSeoData =
    seoData.find((data) => data.slugUrl === category) || {};

  const productCategory = useSelector((state) => state.productCategory);
  const { loading, error, products, page, pages } = productCategory;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  console.log("categories", categories);

  const selectedCategory =
    categories && categories.find((cat) => cat.name === category);

  useEffect(() => {
    // Check if the category is 'all' and conditionally dispatch the action
    //all displays all the product related code is in getProductByCategory in productController
    if (category) {
      dispatch(categoryProducts(category));
    }
  }, [dispatch, category]);

  return (
    <>
      <SEO
        title={currentSeoData.titleTag}
        description={currentSeoData.description}
      />{" "}
      <div className="scrolling-container">
        <h3 className="m-2">{selectedCategory?.title}</h3>
        <div className="scrolling-text">
          <span>Same Day Delivery if ordered before 12pm</span>
          <span>
            &nbsp;&nbsp; Free Delivery on orders above AED 80.00&nbsp;&nbsp;
          </span>
        </div>
      </div>
      <CarouselContainer category={category} />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="m-1 p-0">
            {products &&
              products
                .filter((product) => product?.category?.name === category)
                .map((product) => (
                  <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Product product={product} />
                  </Col>
                ))}
          </Row>
        </>
      )}
      <Paginate pages={pages} page={page} isAdmin={true} />
    </>
  );
};

export default ProductCategoryScreen;
