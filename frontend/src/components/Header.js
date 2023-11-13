//rafce
import React, { useState } from "react";
//import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// This let us wrap bootstrap components
import { LinkContainer } from "react-router-bootstrap";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Image,
  NavLink,
} from "react-bootstrap";
import largeLogo from "../images/logo_medium_horizontal.png";
import smallLogo from "../images/logo_only.png";

import SearchBox from "./SearchBox";
import Location from "./Location";
import { logout } from "../actions/userActions";
import whatsapp from "../images/whatsapp-logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const [Lat, setLat] = useState(null);
  const [Lng, setLng] = useState(null);
  const [locationClicked, setLocationClicked] = useState(false);
  const [address, setAddress] = useState("");
  // `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const locationHandler = () => {
    if (!navigator.geolocation) {
      console.log("Geolocaiton is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              setAddress(
                `${data.address.road},${data.address.suburb},${data.address.town}`
              );
              console.log(data);
              setLocationClicked(true); // Set locationClicked to true when the location is clicked
            });
        },
        (e) => {
          console.log(e);
        }
      );
    }
  };
  console.log(address);

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
                  src={largeLogo} // Use the large screen logo
                  alt="BigBasket Logo"
                  className="logo large-logo" // Add classes for large screens
                />
                <Image
                  src={smallLogo} // Use the small screen logo
                  alt="BigBasket Logo"
                  className="logo small-logo" // Add classes for small screens
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
              <Nav className="mr-auto">
                <div className="d-flex align-items-center">
                  <SearchBox />
                </div>

                {/* <LinkContainer to="/">
                  <Nav.Link>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={locationHandler}
                    >
                      <i class="fa-solid fa-location-dot"></i>&nbsp;
                      <Location
                        locationClicked={locationClicked}
                        address={address}
                      />
                    </div>
                  </Nav.Link>
                </LinkContainer> */}
                {userInfo ? (
                  <NavDropdown
                    title={
                      <>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <i className="fas fa-user"></i>&nbsp;
                          <span className="d-none d-md-block">
                            {userInfo.name}
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
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <i className="fas fa-user"></i>&nbsp;
                        <span className="d-none d-md-block">Sign In</span>
                      </div>
                    </Nav.Link>
                  </LinkContainer>
                )}

                {/* This is for the admin  */}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title={
                      <>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <i className="fa-solid fa-toolbox"></i>&nbsp;
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
                  </NavDropdown>
                )}
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <div className="cart">
                      <i className="fas fa-shopping-cart"></i>
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
    </header>
  );
};

export default Header;
