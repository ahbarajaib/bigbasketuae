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
          <LinkContainer to="/">
            <Navbar.Brand>
              <Image
                src="/images/logo.jpg"
                alt="BigBasket Logo"
                style={{ maxWidth: "100px" }}
              />
            </Navbar.Brand>
          </LinkContainer>
          {/* WhatsApp Link */}
          <a
            href="https://api.whatsapp.com/send?phone=00971522512453"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            Chat with us &nbsp;
            <Image
              src={whatsapp}
              alt="WhatsApp Logo"
              style={{ maxWidth: "24px" }}
            />
          </a>
          {/* End WhatsApp Link */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <div className="cart">
                    <i className="fas fa-shopping-cart"></i> Cart
                    <div className="badge">{cartItems.length}</div>{" "}
                    {/* Updated badge */}
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
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
