//rafce
import React from "react";
//import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// This let us wrap bootstrap components
import { LinkContainer } from "react-router-bootstrap";
import { Container, Navbar, Nav, NavDropdown, Image } from "react-bootstrap";

import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";
import whatsapp from "../images/whatsapp-logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <header>
      <Navbar bg="light" variant="light">
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
            <LinkContainer to="/">
              <Navbar.Brand>
                <Image
                  src="/images/logo_medium_horizontal.png"
                  alt="BigBasket Logo"
                  style={{ maxWidth: "360px" }}
                />
              </Navbar.Brand>
            </LinkContainer>
            {/* WhatsApp Link */}
            <a
              href="https://wa.link/btn1kf" // Make sure to include the complete URL with 'https://'
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
            {/* End WhatsApp Link */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <div className="d-flex align-items-center">
                  <SearchBox />
                </div>{" "}
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <div className="cart">
                      <i className="fas fa-shopping-cart"></i> Cart
                      {cartItems.length > 0 && (
                        <sup className="badge">{cartItems.length}</sup>
                      )}
                    </div>
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
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
                      <i className="fas fa-user"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
                {/* This is for the admin  */}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin Menu" id="adminmenu">
                    <LinkContainer to="/admin/userList">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
