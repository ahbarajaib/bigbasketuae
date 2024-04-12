import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import Select from "react-select"; // Import the react-select library
import { listCategories } from "../actions/categoryActions";
import { useLocation } from "react-router-dom";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pageNumber } = location.state || {}; // Providing a fallback object

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [prices, setPrices] = useState([
    { qty: "", units: "gm", price: "", discount: "", discountedPrice: "" },
  ]);

  const [countryOfOrigin, setCountryOfOrigin] = useState("");

  const [showCountryInput, setShowCountryInput] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [showSubtitleInput, setShowSubtitleInput] = useState(false);

  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productList = useSelector((state) => state.productList);
  const { loading: ListLoading, error: ListError, products } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = categoryList;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate(`/admin/productlist/`);
    } else {
      if (!product.name || product._id !== id) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setPrices(product.prices);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        // Set the switch based on if countryOfOrigin is present or not
        const hasCountryOfOrigin = Boolean(product.countryOfOrigin);
        setShowCountryInput(hasCountryOfOrigin);
        setCountryOfOrigin(product.countryOfOrigin || "");
        const hasSubtitle = Boolean(product.subtitle);
        setShowSubtitleInput(hasSubtitle);
        setSubtitle(product.subtitle || "");
      }
    }
  }, [product, dispatch, id, navigate, successUpdate]);

  //This is new

  const [selectedProducts, setSelectedProducts] = useState([]);
  const productOptions = products.flatMap((product) =>
    product.prices.map((variant) => ({
      label: `${product.name} ${variant.qty}${variant.units}`,
      value: { id: product._id, name: product.name, variant },
    }))
  );

  const handleCountryChange = (e) => {
    const value = e.target.value;

    setCountryOfOrigin(value);
  };

  const handlePriceChange = (index, field, value) => {
    setPrices(
      prices.map((price, idx) => {
        if (index === idx) {
          const updatedPrice = { ...price, [field]: value };

          // Check if we're updating the price or the discount
          if (field === "price" || field === "discount") {
            // Assume a discount value of '0' if it is not yet set
            const discountValue =
              field === "discount" ? value : price.discount || 0;
            const priceValue = field === "price" ? value : price.price;

            // Calculate the discounted price
            const discountedPrice = (priceValue * (100 - discountValue)) / 100;

            // Update the discounted price
            updatedPrice.discountedPrice = discountedPrice.toFixed(2); // Keeping two decimal places
          }

          return updatedPrice;
        }
        return price;
      })
    );
  };

  const addPriceVariant = () => {
    setPrices((currentPrices) => [
      ...currentPrices,
      { qty: "", units: "gm", price: "", discount: "", discountedPrice: "" },
    ]);
  };

  const removePriceVariant = (index) => {
    setPrices((currentPrices) =>
      currentPrices.filter((_, idx) => idx !== index)
    );
  };
  const handleProductSelect = (selectedOption) => {
    console.log("selectedOption", selectedOption);

    if (selectedOption && selectedOption.length > 0) {
      const productInfo = selectedOption[0].value;

      console.log("productInfo", productInfo);

      setSelectedProducts((prevSelectedProducts) => {
        const updatedProducts = [
          ...prevSelectedProducts,
          {
            id: productInfo?.id,
            name: productInfo?.name,
            variant: {
              qty: productInfo?.variant?.qty || 0,
              units: productInfo?.variant?.units || "",
              price: productInfo?.variant?.price || 0,
              discountedPrice: productInfo?.variant?.discountedPrice || 0,
              discount: productInfo?.variant?.discount || 0,
            },
          },
        ];

        console.log("updatedProducts", updatedProducts);

        return updatedProducts;
      });
    }
  };

  //Above is new
  console.log(product);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axiosInstance.post(
        "/api/upload",
        formData,
        config
      );
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!showCountryInput) {
      setCountryOfOrigin(""); // Clear country of origin if switch is turned off
    }
    if (!showSubtitleInput) {
      setSubtitle("");
    }

    // Prepare the prices array with multiple price entries
    const newPrices = prices.map((p) => ({
      qty: p.qty,
      units: p.units,
      price: p.price,
      discountedPrice: p.discountedPrice,
      discount: p.discount,
    }));
    console.log("Selected Products:", selectedProducts); // Add this line

    dispatch(
      updateProduct({
        _id: id,
        name,
        prices: newPrices,
        image,
        brand,
        category,
        description,
        countInStock,
        selectedProducts,
        countryOfOrigin: showCountryInput ? countryOfOrigin : null, // Set to null if switch is off
        subtitle: showSubtitleInput ? subtitle : null,
      })
    );
  };
  const categoryOptions = categories.map((cat) => ({
    value: cat._id, // Use _id as the value
    label: cat.title, // Show title for the user to see
  }));

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler} key={product._id || "new"}>
            {" "}
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="subtitle">
              <Form.Check
                type="switch"
                id="subtitle-switch"
                label={showSubtitleInput ? "Hide Subtitle" : "Add Subtitle"}
                checked={showSubtitleInput}
                onChange={(e) => {
                  setShowSubtitleInput(e.target.checked);

                  if (!e.target.checked) {
                    setSubtitle(""); // Clear country of origin if switch is turned off
                  }
                }}
                className="mb-3"
              />
              {showSubtitleInput && (
                <Form.Control
                  type="text"
                  placeholder="Enter subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mb-3"
                ></Form.Control>
              )}
            </Form.Group>
            {prices.map((price, index) => (
              <Row key={index} className="mb-3">
                <Col xs={2}>
                  <Form.Group controlId={`qty-${index}`}>
                    <Form.Label>Qty</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Qty"
                      value={price.qty}
                      onChange={(e) =>
                        handlePriceChange(index, "qty", e.target.value)
                      }
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group controlId={`units-${index}`}>
                    <Form.Label>Units</Form.Label>
                    <Form.Select
                      value={price.units}
                      onChange={(e) =>
                        handlePriceChange(index, "units", e.target.value)
                      }
                      className="mb-3"
                    >
                      <option value="gm">gm</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="ltr">ltr</option>
                      <option value="tray">Tray</option>
                      <option value="pack">Pack</option>
                      <option value="piece">Piece/s</option>
                      <option value="bag">Bag</option>
                      <option value="box">Box</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group controlId={`price-${index}`}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price.price}
                      onChange={(e) =>
                        handlePriceChange(index, "price", e.target.value)
                      }
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <Form.Group controlId={`discount-${index}`}>
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Discount"
                      value={price.discount}
                      onChange={(e) =>
                        handlePriceChange(index, "discount", e.target.value)
                      }
                      className="mb-3"
                    />
                  </Form.Group>
                </Col>
                <Col xs={1} className="align-self-end">
                  <Button
                    variant="danger"
                    onClick={() => removePriceVariant(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button onClick={addPriceVariant} className="custom-button mb-3">
              Add Another Price Variant
            </Button>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mb-3"
              ></Form.Control>
              <Form.Control
                type="file"
                id="image-file"
                label="Choose File"
                onChange={uploadFileHandler}
                className="mb-3"
              />
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mb-3"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countryOfOriginSwitch">
              <Form.Check
                type="switch"
                id="countryOfOrigin-switch"
                label={
                  showCountryInput
                    ? "Hide Country of Origin"
                    : "Add Country of Origin"
                }
                checked={showCountryInput}
                onChange={(e) => {
                  setShowCountryInput(e.target.checked);
                  if (!e.target.checked) {
                    setCountryOfOrigin(""); // Clear country of origin if switch is turned off
                  }
                }}
                className="mb-3"
              />
              {showCountryInput && (
                <Form.Control
                  type="text"
                  placeholder="Enter country of origin"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className="mb-3"
                ></Form.Control>
              )}
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="mb-3"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-3"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-3"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="autocomplete">
              <Form.Label>Frequently Bought Together</Form.Label>
              <Select
                options={productOptions}
                isMulti
                onChange={(selectedOptions) =>
                  handleProductSelect(selectedOptions)
                }
                className="mb-3"
              />
            </Form.Group>
            <Row className="mb-3">
              {selectedProducts &&
                selectedProducts.map((selectedProduct, index) => (
                  <Col key={index}>
                    {/* Make sure this key is unique */}
                    {selectedProduct && (
                      <>
                        <h5>{selectedProduct.name}</h5>
                        {selectedProduct.variant && (
                          <div>
                            {selectedProduct.variant.qty}{" "}
                            {selectedProduct.variant.units} - AED{" "}
                            {selectedProduct.variant.price}
                          </div>
                        )}
                      </>
                    )}
                  </Col>
                ))}
            </Row>
            <Button type="submit" variant="success">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
