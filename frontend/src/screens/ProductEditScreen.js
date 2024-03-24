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

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [prices, setPrices] = useState([]);
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
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== id) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category); // This will be an ObjectId
        setPrices(product.prices);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, id, product, successUpdate]);

  //This is new

  const [selectedProducts, setSelectedProducts] = useState([]);
  const productOptions = products.flatMap((product) =>
    product.prices.map((variant) => ({
      label: `${product.name} ${variant.qty}${variant.units}`,
      value: { id: product._id, name: product.name, variant },
    }))
  );

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

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...prices];
    const priceEntry = updatedPrices[index];

    // Update the specific field in the price entry
    priceEntry[field] = value;

    // Calculate the discounted price based on price and discount
    if (priceEntry.price && priceEntry.discount) {
      const discountedPrice =
        priceEntry.price * (1 - priceEntry.discount / 100);
      priceEntry.discountedPrice = discountedPrice;
    } else {
      priceEntry.discountedPrice = 0; // Set a default value if price or discount is missing
    }

    // Update the state with the modified price entry
    updatedPrices[index] = priceEntry;

    setPrices(updatedPrices);
  };

  const handleUnitsChange = (index, field, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value,
    };
    setPrices(updatedPrices);
  };

  const handleQuantityChange = (quantity) => {
    const updatedPrices = [];
    for (let i = 0; i < quantity; i++) {
      updatedPrices.push({
        qty: 1,
        units: "gm",
        price: 1,
        discountedPrice: 0,
        discount: 0,
      });
    }
    setPrices(updatedPrices);
  };

  const submitHandler = (e) => {
    e.preventDefault();

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
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.Label>
                No of product quantities Eg: 500gm, 1kg, 3kg
              </Form.Label>
              <Form.Select
                value={prices.length}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
            </Form.Group>

            {prices.map((price, index) => (
              <Row key={index}>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <Form.Group controlId={`qty${index}`}>
                    <Form.Label>Qty {index + 1}</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter qty"
                      value={price.qty}
                      onChange={(e) =>
                        handlePriceChange(index, "qty", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <Form.Group controlId={`units${index}`}>
                    <Form.Label>Gm/Ml/Kg/Ltr</Form.Label>

                    <Form.Select
                      value={price.units}
                      onChange={(e) =>
                        handleUnitsChange(index, "units", e.target.value)
                      }
                    >
                      <option value="gm">gm</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="ltr">ltr</option>
                      <option value="tray">Tray</option>
                      <option value="pack">Pack</option>
                      <option value="piece">Piece/s</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <Form.Group controlId={`price${index}`}>
                    <Form.Label>Price {index + 1}</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price.price}
                      onChange={(e) =>
                        handlePriceChange(index, "price", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <Form.Group controlId={`discount${index}`}>
                    <Form.Label>Discount {index + 1}</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="%"
                      value={price.discount}
                      onChange={(e) =>
                        handlePriceChange(index, "discount", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                id="image-file"
                label="Choose File"
                onChange={uploadFileHandler}
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
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              />
            </Form.Group>

            <Row>
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

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
