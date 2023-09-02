import React from "react";
import { Card } from "react-bootstrap";
import spices from "../images/spices.jpeg";
import legumes from "../images/legumes.jpeg";
import grains from "../images/grains.jpeg";
import oil from "../images/oil.jpeg";
import canned from "../images/canned.jpeg";
import dryfruit from "../images/dryfruit.jpeg";
import beverages from "../images/beverages.jpeg";
import dairy from "../images/dairy.jpeg";
import bakery from "../images/bakery.jpeg";
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
      title: "Dryfruits, Nuts & Chocolates",
      name: "dryfruits-nuts-and-chocolates",
      image: dryfruit, // Replace this with the actual image path
    },
    {
      id: 7,
      title: "Dairy & Eggs",
      name: "dairy-and-eggs",
      image: dairy, // Replace this with the actual image path
    },
    {
      id: 8,
      title: "Bakery & Snacks",
      name: "bakery-and-snacks",
      image: bakery, // Replace this with the actual image path
    },
    {
      id: 9,
      title: "Beverages",
      name: "beverages",
      image: beverages, // Replace this with the actual image path
    },
    {
      id: 10,
      title: "Wholesale",
      name: "wholesale",
      image: wholesale, // Replace this with the actual image path
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {categories.map((category) => (
          <div
            key={category.id}
            className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-2"
          >
            <Card className="my-3 border-0 text-center">
              <a
                href={`/category/${category.name}`}
                style={{ display: "block" }}
              >
                <div
                  className="rounded-circle mx-auto circle-category" // Add a class to target circles with CSS
                  style={{
                    objectFit: "cover",
                    height: "150px",
                    width: "150px",
                    overflow: "hidden",
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
                  <Card.Title as="h5" className="mb-0 smaller-text">
                    {category.title}
                  </Card.Title>
                </Card.Body>
              </a>
            </Card>
          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 1199.98px) {
            .col-lg-3, .col-md-4 {
              flex: 0 0 25%;
              max-width: 25%;
            }
          }

          @media (max-width: 991.98px) {
            .col-sm-6 {
              flex: 0 0 50%;
              max-width: 50%;
            }
          }

          @media (max-width: 575.98px) {
            .col-12 {
              flex: 0 0 33.33%;
              max-width: 33.33%;
            }
            .circle-category {
              width: 50px; /* Adjust the size as needed */
              height: 50px; /* Adjust the size as needed */
            }
          }
        `}
      </style>
    </div>
  );
};

export default Categories;
