import React, { useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";
import DeliveryInfo from "../components/DeliveryInfo";
import CarouselContainerSmall from "../components/CarouselContainerSmall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const HomeScreen = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const searchKeyword = location.pathname.split("/search/")[1];

  // State of productList from the store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

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

  const categories = [
    {
      id: 1,
      title: "Spices & Condiments",
      name: "spices-and-condiments",
    },
    {
      id: 2,
      title: "Legumes",
      name: "legumes",
    },
    {
      id: 3,
      title: "Grains",
      name: "grains",
    },
    {
      id: 4,
      title: "Oils & Ghees",
      name: "oils-and-ghees",
    },
    {
      id: 5,
      title: "Canned & Jarred Goods",
      name: "canned-and-jarred-goods",
    },
    {
      id: 6,
      title: "Dryfruits, Nuts & Chocolates",
      name: "dryfruits-nuts-and-chocolates",
    },
    {
      id: 7,
      title: "Dairy & Eggs",
      name: "dairy-and-eggs",
    },
    {
      id: 8,
      title: "Bakery & Snacks",
      name: "bakery-and-snacks",
    },
    {
      id: 9,
      title: "Beverages",
      name: "beverages",
    },
    {
      id: 10,
      title: "Wholesale",
      name: "wholesale",
    },
  ];

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
    infinite: true,
    speed: 500,
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

  return (
    <>
      <Meta />
      <DeliveryInfo />
      <CarouselContainer />
      <SpecialOffers />
      <Container fluid style={{ margin: 0, padding: 0 }}>
        {!searchKeyword && (
          <div>
            <h1>Categories</h1>
            <Row>
              <Col>
                <Categories />
              </Col>
            </Row>
          </div>
        )}
        {loading ? (
          <Loader />
        ) : searchKeyword ? (
          <Row style={{ overflowX: "auto" }}>
            {products && (
              <Slider {...settings}>
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </Slider>
            )}
          </Row>
        ) : (
          categories.map((category) => (
            <div key={category.id}>
              <h1 className="text-center">{category.title}</h1>
              <CarouselContainerSmall
                key={category.name}
                category={category.name}
              />
              <Row className="d-flex flex-nowrap" style={{ overflowX: "auto" }}>
                {products && (
                  <Slider {...settings}>
                    {products
                      .filter((product) => product.category === category.name)
                      .map((product) => (
                        <Product key={product._id} product={product} />
                      ))}
                  </Slider>
                )}
              </Row>
            </div>
          ))
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
