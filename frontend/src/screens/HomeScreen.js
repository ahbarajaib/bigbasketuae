import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SpecialOffers from "../components/SpecialOffers";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import CarouselContainer from "../components/CarouselContainer";
import { listProducts } from "../actions/productActions";
import Categories from "../components/Categories";
import { Link, useLocation } from "react-router-dom";
import DeliveryInfo from "../components/DeliveryInfo";
import CarouselContainerSmall from "../components/CarouselContainerSmall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import BrandProducts from "../components/BrandProducts";
import { listCategories } from "../actions/categoryActions";

const HomeScreen = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const searchKeyword = location.pathname.split("/search/")[1];

  // State of productList from the store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingList,
    error: errorList,
    categories: categories,
  } = categoryList;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch products based on search keyword if it exists
    // Fetch all products if there's no search keyword
    if (searchKeyword) {
      dispatch(listProducts(searchKeyword));
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, searchKeyword]);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Update your CustomNextArrow and CustomPrevArrow components
  const CustomNextArrow = (props) => (
    <div
      {...props}
      className="slick-arrow custom-next-arrow round-arrow right-arrow"
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );

  const CustomPrevArrow = (props) => (
    <div
      {...props}
      className="slick-arrow custom-prev-arrow round-arrow left-arrow"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 5, // Set the number of visible slides
    slidesToScroll: 5,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const getMarginTop = () => {
    const isMobile = window.innerWidth <= 767; // Adjust the breakpoint as needed
    return isMobile ? "140px" : "110px";
  };
  return (
    <>
      <Meta />
      <Container fluid style={{ marginTop: getMarginTop(), padding: 0 }}>
        <CarouselContainer />

        {!searchKeyword && (
          <div>
            <h1>Categories</h1>
            <Row>
              <Col>
                <Suspense fallback={<Loader />}>
                  <Categories />
                </Suspense>
                <Suspense fallback={<div>Loading Special Offers...</div>}>
                  <SpecialOffers />
                </Suspense>
                <div className="mb-4">
                  {" "}
                  <BrandProducts />
                </div>
              </Col>
            </Row>
          </div>
        )}
        {loading ? (
          <Loader />
        ) : searchKeyword ? (
          <Row style={{ overflowX: "auto" }}>
            {products &&
              products.map((product) => (
                <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                  <Product key={product._id} product={product} />
                </Col>
              ))}
          </Row>
        ) : (
          categories.map((category) => (
            <div key={category.id}>
              <Link to={`/category/${category.name}`} key={category.name}>
                <CarouselContainerSmall category={category.name} />
              </Link>
              <Row className="d-flex flex-nowrap" style={{ overflowX: "auto" }}>
                <Slider {...settings}>
                  {products &&
                    products
                      .filter((product) => product.category === category.name)
                      .map((product) => (
                        <Product key={product._id} product={product} />
                      ))}
                </Slider>
              </Row>
            </div>
          ))
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
