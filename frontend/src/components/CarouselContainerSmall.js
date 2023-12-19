import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewSmallBanner } from "../actions/bannerActions";
import Loader from "./Loader";
import { Carousel } from "react-bootstrap";

const CarouselContainerSmall = React.memo(({ category }) => {
  const dispatch = useDispatch();
  const smallBannerView = useSelector(
    (state) => state.smallBannerView.categories[category]
  );
  const { loading, images, error } = smallBannerView || {};

  useEffect(() => {
    if (category) {
      dispatch(viewSmallBanner(category));
    }
  }, [dispatch, category]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Check if images is an array before using map
  if (!Array.isArray(images)) {
    return <p>Error: Images is not an array</p>;
  }

  return (
    <Carousel slide interval={2000}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={`${process.env.REACT_APP_API_URL}/banners/small/${image}`}
            alt={`Banner ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
});

export default CarouselContainerSmall;
