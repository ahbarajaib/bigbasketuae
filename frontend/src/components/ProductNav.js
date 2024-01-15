import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const ProductNav = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <Navbar
        bg="light"
        variant="light"
        expanded={expanded}
        expand="lg"
        className="bg-body-tertiary"
        style={{ backgroundColor: "#fff", padding: 0, margin: 0 }}
      >
        <Navbar.Toggle
          aria-controls="navbarScroll"
          onClick={handleToggle}
          className="ml-auto"
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="justify-content-start">
            <Link to="/category/all" className="nav-link smaller-text">
              <FontAwesomeIcon icon={faBars} className="burger-icon" />
              &nbsp;&nbsp;All Categories
            </Link>
            <Link
              to="/category/spices-and-condiments"
              className="nav-link smaller-text"
            >
              Spices & Condiments
            </Link>
            <Link to="/category/legumes" className="nav-link smaller-text">
              Legumes
            </Link>
            <Link to="/category/grains" className="nav-link smaller-text">
              Grains
            </Link>
            <Link
              to="/category/oils-and-ghees"
              className="nav-link smaller-text"
            >
              Oils & Ghees
            </Link>
            <Link
              to="/category/canned-and-jarred-goods"
              className="nav-link smaller-text"
            >
              Canned & Jarred Goods
            </Link>
            <Link
              to="/category/dryfruits-nuts-and-chocolates"
              className="nav-link smaller-text"
            >
              Dryfruits, Nuts & Chocolates
            </Link>
            <Link
              to="/category/dairy-and-eggs"
              className="nav-link smaller-text"
            >
              Dairy & Eggs
            </Link>
            <Link
              to="/category/bakery-and-snacks"
              className="nav-link smaller-text"
            >
              Bakery & Snacks
            </Link>
            <Link to="/category/beverages" className="nav-link smaller-text">
              Beverages
            </Link>
            <Link to="/category/wholesale" className="nav-link smaller-text">
              Wholesale
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default ProductNav;
