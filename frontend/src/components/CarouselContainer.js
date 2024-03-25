import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewBanner } from "../actions/bannerActions";
import Loader from "./Loader";
import { Carousel } from "react-bootstrap";

function CarouselContainer({ category }) {
  const dispatch = useDispatch();
  const bannerView = useSelector((state) => state.bannerView);
  const { loading, images, error } = bannerView;

  // Fetch images when the component mounts or when the category changes
  useEffect(() => {
    if (category) {
      dispatch(viewBanner(category));
    } else {
      // If no category is selected, fetch images for all categories
      dispatch(viewBanner("all"));
    }
  }, [dispatch, category]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <Carousel slide interval={2000}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={`${process.env.REACT_APP_API_URL}/${image}`} // Use the imported image directly
            alt={`Banner ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default CarouselContainer;
