import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

//history props
const ShippingScreen = (history) => {
  const defaultCity = "Dubai";
  const defaultCountry = "United Arab Emirates";
  const cart = useSelector((state) => state.cart);
  //stored from localstorage
  const { shippingAddress } = cart;
  const [locationClicked, setLocationClicked] = useState(false);
  const [Lat, setLat] = useState(null);
  const [Lng, setLng] = useState(null);
  const [building, setBuilding] = useState(shippingAddress.building);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(defaultCity);
  const [country, setCountry] = useState(defaultCountry);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ building, address, city, country }));
    navigate("/selectpayment"); // Navigate to the SelectPayment page
  };

  const locationHandler = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
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
              setLocationClicked(true);
              setLoadingLocation(false); // Set locationClicked to true when the location is clicked
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              setLoadingLocation(false);
            });
        },
        (e) => {
          console.log(e);
          setLoadingLocation(false);
        }
      );
    }
  };

  return (
    <>
      <button className="btn btn-light my-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <FormContainer>
        <h1>Shipping</h1>
        <CheckoutSteps step1 step2 />
        <Form onSubmit={submitHandler}>
          <Button onClick={locationHandler} disabled={loadingLocation}>
            {loadingLocation ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                &nbsp; Fetching Location...
              </>
            ) : (
              "Current Location"
            )}
          </Button>

          <Form.Group controlId="building">
            <Form.Label>Building & Room no</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Building & Floor name/no:"
              value={building}
              required
              onChange={(e) => setBuilding(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={defaultCity}
              required
              disabled
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              value={defaultCountry}
              required
              disabled
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
            <Button
              type="submit"
              variant="primary"
              className="button-primary btn-block"
            >
              Continue
            </Button>
          </div>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
