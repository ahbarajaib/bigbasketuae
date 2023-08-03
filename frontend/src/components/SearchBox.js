import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <FormControl
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-2"
        style={{
          borderRadius: "20px 0 0 20px",
          border: "none",
          backgroundColor: "#f2f2f2",
          color: "#4d4d4d",
          fontSize: "16px",
          fontWeight: "400",
          padding: "10px 20px",
        }}
      />
      <Button
        type="submit"
        variant="outline-success"
        style={{
          borderRadius: "0 20px 20px 0",
          backgroundColor: "#4bb543",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "400",
          padding: "10px 20px",
          border: "none",
        }}
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
