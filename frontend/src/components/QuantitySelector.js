import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";

const QuantitySelector = ({
  selectedPriceVariant,
  increaseQty,
  decreaseQty,
}) => {
  return (
    <InputGroup className="align-items-center" style={{ width: "fit-content" }}>
      {/* Decrement button */}
      <Button
        className="btn-neutral-200 border-0 bg-neutral-200 btn-custom"
        onClick={decreaseQty}
        style={{ padding: "0.25rem 0.5rem" }}
      >
        -
      </Button>

      {/* Quantity input field */}
      <FormControl
        className="text-center"
        style={{ maxWidth: "50px", padding: "0.25rem" }}
        value={selectedPriceVariant?.noOfProducts || 0}
        readOnly
      />

      {/* Increment button */}
      <Button
        className="btn-neutral-200 border-0 bg-neutral-200 btn-custom"
        onClick={increaseQty}
        style={{ padding: "0.25rem 0.5rem" }}
      >
        +
      </Button>
    </InputGroup>
  );
};

export default QuantitySelector;
