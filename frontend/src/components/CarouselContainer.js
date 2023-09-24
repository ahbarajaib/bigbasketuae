import Carousel from "react-bootstrap/Carousel";
import carousel1 from "../images/carousel1.avif";
import carousel2 from "../images/carousel2.avif";
import Canned1 from "../images/canned-and-jarred-goods/Canned1.avif";
import Dairy1 from "../images/dairy-and-eggs/Dairy1.avif";
import Dairy2 from "../images/dairy-and-eggs/Dairy2.avif";
import Dryfruits1 from "../images/dryfruits-nuts-and-chocolates/Dryfruits1.avif";
import Dryfruits2 from "../images/dryfruits-nuts-and-chocolates/Dryfruits2.avif";
import Dryfruits3 from "../images/dryfruits-nuts-and-chocolates/Dryfruits3.avif";
import Grains1 from "../images/grains/Grains1.avif";
import Grains2 from "../images/grains/Grains2.avif";
import Grains3 from "../images/grains/Grains3.avif";
import Legumes1 from "../images/legumes/Legumes1.avif";
import Legumes2 from "../images/legumes/Legumes2.avif";
import Oils1 from "../images/oils-and-ghees/Oils1.avif";
import Oils2 from "../images/oils-and-ghees/Oils2.avif";
import Snacks1 from "../images/bakery-and-snacks/Snacks1.avif";
import Snacks2 from "../images/bakery-and-snacks/Snacks2.avif";

import Wholesale1 from "../images/wholesale/Wholesale1.avif";

import Spices1 from "../images/spices-and-condiments/Spices1.avif";
import Spices2 from "../images/spices-and-condiments/Spices2.avif";
import Spices3 from "../images/spices-and-condiments/Spices3.avif";
import Beverages1 from "../images/beverages/Beverages1.avif";
import Beverages2 from "../images/beverages/Beverages2.avif";
import Beverages3 from "../images/beverages/Beverages3.avif";

// Create an object to map categories to image arrays
const categoryImages = {
  all: [carousel1, carousel2],
  "spices-and-condiments": [Spices1, Spices2, Spices3],
  legumes: [Legumes1, Legumes2],
  grains: [Grains1, Grains2, Grains3],
  "oils-and-ghees": [Oils1, Oils2],
  "canned-and-jarred-goods": [Canned1],
  "dryfruits-nuts-and-chocolates": [Dryfruits1, Dryfruits2, Dryfruits3],
  "dairy-and-eggs": [Dairy1, Dairy2, Dairy3],
  "bakery-and-snacks": [Snacks1, Snacks2],
  beverages: [Beverages1, Beverages2, Beverages3],
  wholesale: [Wholesale1],

  // Add more categories as needed
};

function CarouselContainer({ category }) {
  // Check if category is empty or not provided
  if (!category) {
    // If no category is provided, display default images (e.g., "all" category)
    category = "all";
  }

  // Get the image array based on the provided category
  const images = categoryImages[category] || [];

  return (
    <Carousel slide interval={2000}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={image} // Use the imported image directly
            alt={`Banner ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default CarouselContainer;
