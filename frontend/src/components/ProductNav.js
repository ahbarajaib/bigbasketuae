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
    <Navbar
      expanded={expanded}
      expand="lg"
      className="bg-body-tertiary"
      style={{ backgroundColor: "#fff" }}
    >
      <Navbar.Toggle
        aria-controls="navbarScroll"
        onClick={handleToggle}
        className="ml-auto"
      />
      <Navbar.Collapse id="navbarScroll">
        <Nav className="justify-content-center">
          <Link to="/category/all" className="nav-link smaller-text">
            <FontAwesomeIcon icon={faBars} className="burger-icon" />
            &nbsp;&nbsp;ALL CATEGORIES
          </Link>
          <Link
            to="/category/spices-and-condiments"
            className="nav-link smaller-text"
          >
            SPICES & CONDIMENTS
          </Link>
          <Link to="/category/legumes" className="nav-link smaller-text">
            LEGUMES
          </Link>
          <Link to="/category/grains" className="nav-link smaller-text">
            GRAINS
          </Link>
          <Link to="/category/oils-and-ghees" className="nav-link smaller-text">
            OILS & GHEES
          </Link>
          <Link
            to="/category/canned-and-jarred-goods"
            className="nav-link smaller-text"
          >
            CANNED & JARRED GOODS
          </Link>
          <Link
            to="/category/dryfruits-nuts-and-chocolates"
            className="nav-link smaller-text"
          >
            DRYFRUITS, NUTS & CHOCOLATES
          </Link>
          <Link to="/category/dairy-and-eggs" className="nav-link smaller-text">
            DAIRY & EGGS
          </Link>
          <Link
            to="/category/bakery-and-snacks"
            className="nav-link smaller-text"
          >
            BAKERY & SNACKS
          </Link>
          <Link to="/category/beverages" className="nav-link smaller-text">
            BEVERAGES
          </Link>
          <Link to="/category/wholesale" className="nav-link smaller-text">
            WHOLESALE
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ProductNav;
