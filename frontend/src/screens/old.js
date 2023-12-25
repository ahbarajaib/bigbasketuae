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

    // Check if the user is an admin, otherwise redirect to login
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber)); // Initially, load all products
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
    return products.map((product) => ({
      ID: product._id,
      Name: product.name,
      Stock: product.countInStock,
      Category: product.category,
      Brand: product.brand,
    }));
  };

  const handleDownloadReports = () => {
    const filteredProducts = products.filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    );

    const formattedData = formatDataForCSV(filteredProducts);
    const headers = [
      { label: "ID", key: "ID" },
      { label: "Name", key: "Name" },
      { label: "Stock", key: "Stock" },
      { label: "Category", key: "Category" },
      { label: "Brand", key: "Brand" },
    ];
  };
  // Render the category dropdown
  const renderCategoryDropdown = () => {
    // Get unique categories from products
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    categories.unshift("All"); // Add "All" option

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
        <Button
          sx={{ height: "36px", fontSize: "12px", marginTop: "10px" }}
          variant="contained"
        >
          <CSVLink
            data={formattedData}
            headers={headers}
            filename={"products_report.csv"}
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
          >
            Download Report
          </CSVLink>
        </Button>
      </div>
    );
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FontAwesomeIcon icon={faPlus} />
            Create a Product
          </Button>
        </Col>
      </Row>

      {/* Add the category dropdown below the title */}
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
