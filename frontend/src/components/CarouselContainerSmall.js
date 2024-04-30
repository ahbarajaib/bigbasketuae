import React from "react";
import Loader from "./Loader";
import { Carousel } from "react-bootstrap";

// Adjust the component to accept 'images' as a prop
const CarouselContainerSmall = React.memo(({ images }) => {
  // You can remove the Redux hooks and useEffect as the component no longer needs to fetch data

  if (!images || images.length === 0) {
    // If there are no images, you can decide to return a loader, an empty fragment, or a placeholder
    return <Loader />; // or <></> for an empty fragment
  }

  return (
    <Carousel slide interval={2000} className="mx-2">
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 rounded-lg"
            src={`${process.env.REACT_APP_API_URL}/banners/small/${image}`}
            alt={`Banner ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
});

export default CarouselContainerSmall;
