import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { promotionProducts } from "../actions/productActions"; // Ensure this action is defined in your Redux actions
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";

const ProductPromotionScreen = () => {
  const { keyword, pageNumber = 1, promotion } = useParams();
  const dispatch = useDispatch();
  const productPromotion = useSelector((state) => state.productPromotion);
  const { loading, error, products } = productPromotion;

  function formatPromotionName(promotion) {
    // List of words to exclude from capitalization
    const excludedWords = ["and"];

    return promotion
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

  useEffect(() => {
    dispatch(promotionProducts(keyword, pageNumber, promotion));
  }, [dispatch, keyword, pageNumber, promotion]);

  return (
    <div>
      <h2 className="m-2">{formatPromotionName(promotion)}</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row className="m-1 p-0">
          {products &&
            products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                <Product
                  product={product}
                  promotion={product.promotion && product.promotion.name}
                />
              </Col>
            ))}
        </Row>
      )}
    </div>
  );
};

export default ProductPromotionScreen;
