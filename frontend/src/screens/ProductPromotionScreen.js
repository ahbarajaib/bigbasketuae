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
    console.log("Fetching promotion products for:", promotion);
    dispatch(promotionProducts(keyword, pageNumber, promotion));
  }, [dispatch, promotion]);

  return (
    <div>
      <h2>{formatPromotionName(promotion)}</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products &&
            products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
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
