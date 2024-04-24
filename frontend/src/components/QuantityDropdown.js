import React from "react";
import { Dropdown } from "react-bootstrap";

const QuantityDropdown = ({
  product,
  selectedPriceVariant,
  setSelectedPriceVariant,
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        className="custom-dropdown-toggle"
        id="dropdown-custom-components"
      >
        {selectedPriceVariant
          ? `${selectedPriceVariant.qty} ${selectedPriceVariant.units}`
          : "Select Qty"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {product.prices &&
          product.prices.map((price, index) => (
            <Dropdown.Item
              className={`custom-dropdown-item ${
                selectedPriceVariant && selectedPriceVariant._id === price._id
                  ? "active"
                  : ""
              }`}
              key={index}
              onClick={() =>
                setSelectedPriceVariant({ ...price, noOfProducts: 1 })
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  {price.qty} {price.units}
                </span>
                {price.discount > 0 && (
                  <span className="discount-badge-on-button">
                    {price.discount}%
                  </span>
                )}
              </div>
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default QuantityDropdown;
