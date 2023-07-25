import React from "react";
import { Card } from "react-bootstrap";
import spices from "../images/spices.jpeg";
import legumes from "../images/legumes.jpeg";
import grains from "../images/grains.png";
import oil from "../images/oil.jpeg";
import canned from "../images/canned.jpeg";
import dryfruit from "../images/dryfruit.jpeg";
import beverages from "../images/beverages.jpeg";
import wholesale from "../images/wholesale.jpeg";

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Spices & Condiments",
      name: "spices-and-condiments",
      image: spices, // Replace this with the actual image path
    },
    {
      id: 2,
      title: "Legumes",
      name: "legumes",
      image: legumes, // Replace this with the actual image path
    },
    {
      id: 3,
      title: "Grains",
      name: "grains",
      image: grains, // Replace this with the actual image path
    },
    {
      id: 4,
      title: "Oils & Ghees",
      name: "oils-and-ghees",
      image: oil, // Replace this with the actual image path
    },
    {
      id: 5,
      title: "Canned & Jarred Goods",
      name: "canned-and-jarred-goods",
      image: canned, // Replace this with the actual image path
    },
    {
      id: 6,
      title: "Dryfruits & Nuts",
      name: "dryfruits-and-nuts",
      image: dryfruit, // Replace this with the actual image path
    },
    {
      id: 7,
      title: "Beverages",
      name: "beverages",
      image: beverages, // Replace this with the actual image path
    },
    {
      id: 8,
      title: "Wholesale",
      name: "wholesale",
      image: wholesale, // Replace this with the actual image path
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {" "}
        {/* Center align the row */}
        {categories.map((category) => (
          <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 mb-2">
            <Card className="my-3 border-0 text-center">
              {" "}
              {/* Add "border-0" and "text-center" classes */}
              <a
                href={`/category/${category.name}`}
                style={{ display: "block" }}
              >
                <div
                  className="rounded-circle mx-auto" // Add "mx-auto" class to center the circle
                  style={{
                    objectFit: "cover",
                    height: "150px",
                    width: "150px",
                    overflow: "hidden", // To ensure images are clipped within the circle
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title as="h5" className="mb-0">
                    {" "}
                    {/* Add "mb-0" class to remove default margin-bottom */}
                    {category.title}
                  </Card.Title>
                </Card.Body>
              </a>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
