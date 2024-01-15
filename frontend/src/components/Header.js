//rafce
import React, { useState } from "react";
//import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faToolbox,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Image, NavDropdown } from "react-bootstrap";
import largeLogo from "../images/logo_medium_horizontal.png";
import smallLogo from "../images/logo_only.png";
import SearchBox from "./SearchBox";
import Location from "./Location";
import { logout } from "../actions/userActions";
import whatsapp from "../images/whatsapp-logo.png";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const [Lat, setLat] = useState(null);
  const [Lng, setLng] = useState(null);
  const [locationClicked, setLocationClicked] = useState(false);
  const [address, setAddress] = useState("");
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };

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
          style={{ backgroundColor: "#fff" }}
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

  return (
    <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 999 }}>
      <div className="container">
        <Navbar bg="light" variant="light">
          <Container>
            <div className="d-flex justify-content-between align-items-center w-100">
              <Link to="/">
                <Navbar.Brand style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={largeLogo}
                    alt="BigBasket Logo"
                    className="logo large-logo"
                  />
                  <Image
                    src={smallLogo}
                    alt="BigBasket Logo"
                    className="logo small-logo"
                  />
                </Navbar.Brand>
              </Link>
              <a
                href="https://wa.link/btn1kf"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <Image
                  src={whatsapp}
                  alt="WhatsApp Logo"
                  style={{ maxWidth: "48px" }}
                />
              </a>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <div className="d-flex align-items-center">
                    <SearchBox />
                  </div>
                  {/* Add Location component here if needed */}
                  {userInfo ? (
                    <NavDropdown
                      title={
                        <>
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} />
                            &nbsp;
                            <span className="d-none d-md-block">
                              {userInfo.name.split(" ")[0]}
                            </span>
                          </div>
                        </>
                      }
                      id="username"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <LinkContainer to="/login">
                      <Nav.Link>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faUser} />
                          &nbsp;
                          <span className="d-none d-md-block">Sign In</span>
                        </div>
                      </Nav.Link>
                    </LinkContainer>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title={
                        <>
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faToolbox} />
                            &nbsp;
                            <span className="d-none d-md-block">
                              {" "}
                              Admin Menu
                            </span>
                          </div>
                        </>
                      }
                      id="adminmenu"
                    >
                      <LinkContainer to="/admin/userList">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/banners">
                        <NavDropdown.Item>Banners</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/bannerssmall">
                        <NavDropdown.Item>Small Banners</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  <LinkContainer to="/cart">
                    <Nav.Link>
                      <div className="cart">
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartItems.length > 0 && (
                          <sup className="badge">{cartItems.length}</sup>
                        )}
                      </div>
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </div>
          </Container>
        </Navbar>
        <ProductNav />
      </div>
    </header>
  );
};

export default Header;
