// LocationDisplay.js
import React from "react";

const Location = ({ locationClicked, address }) => {
  return (
    <span
      className="d-none d-md-block"
      style={{ fontWeight: "normal", fontSize: "14px" }}
    >
      {locationClicked ? address : "location"}
    </span>
  );
};

export default Location;
