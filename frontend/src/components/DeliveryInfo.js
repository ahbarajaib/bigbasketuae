import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faTruckFast,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";

const DeliveryInfo = () => {
  const borderStyle = {
    borderRight: "5px solid #000", // You can adjust the border style as needed
  };

  return (
    <div
      className="bg-light-green py-4 rounded d-none d-md-block"
      style={{ marginTop: "120px" }}
    >
      <div className="container">
        <div className="row text-center align-items-center">
          <div className="col-md-4" style={borderStyle}>
            <h6 className="my-auto">
              <FontAwesomeIcon icon={faTruck} /> &nbsp; Free delivery above AED
              80 in Dubai
            </h6>
          </div>
          <div className="col-md-4" style={borderStyle}>
            <h6 className="my-auto">
              <FontAwesomeIcon icon={faTruckFast} />
              &nbsp;Same day delivery
            </h6>
          </div>
          <div className="col-md-4">
            <h6 className="my-auto">
              <FontAwesomeIcon icon={faBoltLightning} />
              &nbsp;One day delivery
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
