//rafce
import React, { useEffect, useState } from "react";
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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Image, NavDropdown } from "react-bootstrap";
import largeLogo from "../images/logo_medium_horizontal.png";
import smallLogo from "../images/logo_only.png";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";
import whatsapp from "../images/whatsapp-logo.png";
import { LinkContainer } from "react-router-bootstrap";
import ProductNav from "./ProductNav";
import { listCategories } from "../actions/categoryActions";

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

  const [expanded, setExpanded] = useState(false);
  // Fetch categories
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleToggle = () => setExpanded(!expanded);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 999 }}>
      <Navbar>
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
                          <span className="d-none d-md-block"> Admin Menu</span>
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
                    <LinkContainer to="/admin/categories">
                      <NavDropdown.Item>Categories</NavDropdown.Item>
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
      <Container className="p-0">
        <Navbar expand="lg" className="d-inline-flex">
          <Nav className="me-auto">
            <NavDropdown
              title={
                <span>
                  Browse All Categories <FontAwesomeIcon icon={faChevronDown} />
                </span>
              }
              id="basic-nav-dropdown"
              className="custom-nav-dropdown m-0"
            >
              {" "}
              {categories &&
                categories.map((category) => (
                  <LinkContainer
                    key={category._id}
                    to={`/category/${category.name}`}
                  >
                    <NavDropdown.Item className="custom-dropdown-item">
                      <img
                        src={process.env.REACT_APP_API_URL + category.image}
                        alt={category.title}
                        style={{
                          height: "48px%",
                          width: "48px",
                        }}
                      />
                      &nbsp;&nbsp;
                      {category.title}
                    </NavDropdown.Item>
                  </LinkContainer>
                ))}
            </NavDropdown>
            {/* Your other Nav items go here */}
          </Nav>
          {/* Your right-aligned items, like search or cart, go here */}
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
