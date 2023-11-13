// MapModal.js
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import GoogleMap from "./GoogleMap"; // You will need to create a GoogleMap component

const MapModal = ({ show, handleClose, setLocationCallback }) => {
  const [manualLocation, setManualLocation] = useState("");

  const handleSetLocation = () => {
    // Handle setting the location, e.g., update the address state in the parent component
    setLocationCallback(manualLocation);

    // You may also want to close the modal after setting the location
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Set Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GoogleMap />
        <input
          type="text"
          placeholder="Enter manual location"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSetLocation}>
          Set Location
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;
