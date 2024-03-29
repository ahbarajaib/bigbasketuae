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
  const { keyword, pageNumber = 1, category } = useParams();
  const currentSeoData =
    seoData.find((data) => data.slugUrl === category) || {};

  const productCategory = useSelector((state) => state.productCategory);
  function formatCategoryName(category) {
    // List of words to exclude from capitalization
    const excludedWords = ["and"];

    return category
      .split("-")
      .map((word) => {
        if (excludedWords.includes(word.toLowerCase())) {
          return word.toLowerCase(); // Keep excluded words in lowercase
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      })
      .join(" ");
  }
  const formattedCategoryName = formatCategoryName(category);
  const seoTitle = `${formattedCategoryName} | Big Basket UAE`;
  const seoDescription = `Explore our wide range of products in ${formattedCategoryName}. Find everything you need in this category and enjoy great prices and quality.`;

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
      <SEO
        title={currentSeoData.titleTag}
        description={currentSeoData.description}
      />{" "}
      <div className="scrolling-container">
        <h3 className="category-text">{formatCategoryName(category)}</h3>
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
          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                <Product product={product} category={product.category.name} />
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
