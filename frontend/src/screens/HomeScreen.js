import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";

import Meta from "../components/Meta";
import CarouselContainer from "../components/CarouselContainer";
import { listProducts } from "../actions/productActions";
import Categories from "../components/Categories";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber = "" } = useParams();

  //state of productList from store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />

      <CarouselContainer />
      <h1>Categories</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Categories />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
