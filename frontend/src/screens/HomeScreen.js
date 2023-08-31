import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import CarouselContainer from "../components/CarouselContainer";
import { listProducts } from "../actions/productActions";
import Categories from "../components/Categories"; // Assuming this is your Categories component

const HomeScreen = () => {
  const dispatch = useDispatch();

  // State of productList from the store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
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
      <h1>Categories</h1>
      <Row>
        <Col>
          <Categories /> {/* Display the existing Categories component */}
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
                  <Loader /> // Show loading indicator while fetching products
                ) : (
                  products
                    .filter((product) => product.category === category.name)
                    .slice(0, 6)
                    .map((product) => (
                      <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
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
  );
};

export default HomeScreen;
