import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import CarouselContainer from "../components/CarouselContainer";
import { listProducts } from "../actions/productActions";
import Categories from "../components/Categories"; // Assuming this is your Categories component
import { useNavigate, useLocation } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchKeyword = location.pathname.split("/search/")[1];

  // State of productList from the store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

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

  return (
    <>
      <Meta />
      <CarouselContainer />
      {searchKeyword ? (
        // If there's a search keyword, only render the search results
        <>
          {loading ? (
            <Loader />
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        // Otherwise, render everything including categories and featured products
        <>
          <h1>Categories</h1>
          <Row>
            <Col>
              <Categories />
            </Col>
          </Row>
          <h1>Featured Products</h1>
          <Row>
            <Col>
              {categories.map((category) => (
                <div key={category.id}>
                  <h1 className="text-center">{category.title}</h1>
                  <Row>
                    {loading ? (
                      <Loader />
                    ) : (
                      products
                        .filter((product) => product.category === category.name)
                        .slice(0, 6)
                        .map((product) => (
                          <Col
                            key={product._id}
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                          >
                            <Product product={product} />
                          </Col>
                        ))
                    )}
                  </Row>
                </div>
              ))}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
