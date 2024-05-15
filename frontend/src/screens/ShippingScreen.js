import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import MapView from "../components/Map";

const ShippingScreen = () => {
  const defaultCity = "Dubai";
  const defaultCountry = "United Arab Emirates";
  const cartItems = useSelector((state) => state.cart);
  const { shippingAddress } = cartItems;
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

  const inputRef = useRef();
  const inputStyle = {
    boxShadow: "inset 0 0 10px #eee !important",
    border: "2px solid #eee",
    width: "456px",
    height: "40px",
    marginLeft: "16px",
    borderRadius: "20px",
    fontWeight: "300 !important",
    outline: "none",
    padding: "10px 20px",
    marginBottom: "10px",
  };
  const [autoComplete, setAutoComplete] = useState(null);

  useEffect(() => {
    // Load Google Maps JavaScript API and initialize Autocomplete
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        const newAutoComplete = new window.google.maps.places.Autocomplete(
          inputRef.current
        );
        setAutoComplete(newAutoComplete);
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      const newAutoComplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      setAutoComplete(newAutoComplete);
    }
  }, []);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.setOptions({
        types: ["geocode", "establishment"], // Add more specific place types if necessary
        componentRestrictions: { country: "AE" },
      });

      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("This location is not available");
        }
        if (place.geometry.viewport || place.geometry.location) {
          const formattedAddress = place.formatted_address;
          setAddress(formattedAddress);
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          setLat(latitude);
          setLng(longitude);
        }
      });
    }
  }, [autoComplete]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (Lat === null || Lng === null) {
      alert("Please enter location on map or select current location");
    } else {
      dispatch(
        saveShippingAddress({
          building,
          address,
          city,
          country,
          coordinates: {
            latitude: Lat,
            longitude: Lng,
          },
        })
      );
      navigate("/selectpayment");
    }
  };

  const locationHandler = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      // Handle geolocation not supported
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
              setLoadingLocation(false);
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
      <Button
        className="my-3 border"
        variant="light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
      <FormContainer>
        <h1>Shipping</h1>
        <CheckoutSteps step1 step2 />
        <div style={{ height: "400px", width: "100%" }}>
          <label>Location</label>
          <input
            placeholder="type your location"
            ref={inputRef}
            style={inputStyle}
          />
          <MapView />
        </div>
        <Form onSubmit={submitHandler}>
          <Button
            variant="success"
            onClick={locationHandler}
            disabled={loadingLocation}
          >
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
              variant="success"
              className=" btn-block btn-lg"
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
