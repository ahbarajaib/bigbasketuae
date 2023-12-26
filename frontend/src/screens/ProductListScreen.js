import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { CSVLink } from "react-csv";

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  console.log(products);
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };
  const formatDataForCSV = (products) => {
    return products.map((product) => {
      const formattedProduct = {
        Name: product.name,
        Stock: product.countInStock,
        Category: product.category,
        Brand: product.brand,

        NoOfProducts: product.noOfProducts,
        CountInStock: product.countInStock,
      };

      // Add prices to the formatted product
      for (let i = 0; i < 4; i++) {
        const priceKey = `Prices${i + 1}`;
        const price = product.prices[i];

        formattedProduct[`${priceKey}Qty`] = price ? price.qty : "";
        formattedProduct[`${priceKey}NoOfProducts`] = price
          ? price.noOfProducts
          : "";
        formattedProduct[`${priceKey}Price`] = price ? price.price : "";
        formattedProduct[`${priceKey}DiscountedPrice`] = price
          ? price.discountedPrice
          : "";
        formattedProduct[`${priceKey}Discount`] = price ? price.discount : "";
        formattedProduct[`${priceKey}Units`] = price ? price.units : "";
      }

      return formattedProduct;
    });
  };

  const handleDownloadReports = () => {
    const filteredProducts = products.filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    );

    const formattedData = formatDataForCSV(filteredProducts);
    const headers = [
      { label: "Name", key: "Name" },
      { label: "Stock", key: "Stock" },
      { label: "Category", key: "Category" },
      { label: "Brand", key: "Brand" },

      { label: "NoOfProducts", key: "NoOfProducts" },
      { label: "CountInStock", key: "CountInStock" },
    ];

    // Add headers for Prices 1 to 4
    for (let i = 1; i <= 4; i++) {
      headers.push(
        { label: `Prices${i}Qty`, key: `Prices${i}Qty` },
        { label: `Prices${i}NoOfProducts`, key: `Prices${i}NoOfProducts` },
        { label: `Prices${i}Price`, key: `Prices${i}Price` },
        {
          label: `Prices${i}DiscountedPrice`,
          key: `Prices${i}DiscountedPrice`,
        },
        { label: `Prices${i}Discount`, key: `Prices${i}Discount` },
        { label: `Prices${i}Units`, key: `Prices${i}Units` }
      );
    }

    // Create a CSVLink component with the generated CSV report
    const csvReport = {
      data: formattedData,
      headers: headers,
      filename: "products_report.csv",
    };

    // Create a CSVLink component with the generated CSV report
    const csvLink = <CSVLink {...csvReport}>&nbsp;Download Report</CSVLink>;

    return csvLink;
  };

  const renderCategoryDropdown = () => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    categories.unshift("All");

    return (
      <div>
        <label htmlFor="category">Filter By Category: &nbsp;</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="d-flex justify-content-start">
          <button style={{ color: "white" }}>{handleDownloadReports()}</button>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FontAwesomeIcon icon={faPlus} />
            Create a Product
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>{renderCategoryDropdown()}</Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>STOCK</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(
                  (product) =>
                    selectedCategory === "All" ||
                    product.category === selectedCategory
                )
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td
                      style={{
                        backgroundColor:
                          product.countInStock < 10 ? "lightcoral" : "inherit",
                        textAlign: "center",
                      }}
                    >
                      {product.countInStock}
                    </td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
