import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { listCategories } from "../actions/categoryActions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { Button } from "primereact/button";

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [globalFilters, setGlobalFilters] = useState({
    // Initialize all required filters here
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.IN },
    // Add other filters as necessary
  });

  useEffect(() => {
    const savedFirst = localStorage.getItem("dataTableFirst");
    if (savedFirst !== null) {
      setFirst(Number(savedFirst));
    }
  }, []);

  // Save the 'first' state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("dataTableFirst", first.toString());
  }, [first]);

  useEffect(() => {
    dispatch(listProducts());
    dispatch(listCategories());
  }, [dispatch]);

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList, categories } = categoryList;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const footer = `In total there are ${
    products ? products.length : 0
  } products.`;

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

  const getFilteredProducts = () => {
    // If no categories are selected, return all products
    if (!selectedCategories || selectedCategories.length === 0) {
      return products;
    }
    // Filter products based on selected categories
    return products.filter(
      (product) =>
        product.category && selectedCategories.includes(product.category._id)
    );
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${process.env.REACT_APP_API_URL}${rowData.image}`}
        alt={rowData.name}
        style={{ width: "50px", height: "50px" }} // Adjust size as needed
      />
    );
  };
  const onNameFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilters((prevFilters) => ({
      ...prevFilters,
      name: { ...prevFilters.name, value: value },
    }));
  };

  const categoryOptions = categories
    ? categories.map((category) => ({
        label: category.title,
        value: category._id,
      }))
    : [];

  const stockBodyTemplate = (rowData) => {
    return rowData.countInStock;
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h5 className="m-0">Products</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilters.name.value || ""}
          onInput={onNameFilterChange}
          placeholder="Global Search..."
          style={{
            margin: "5px",
          }}
        />
      </span>
      <MultiSelect
        value={selectedCategories}
        options={categoryOptions}
        onChange={(e) => setSelectedCategories(e.value)}
        optionLabel="label"
        placeholder="Select Categories"
        className="p-column-filter"
        style={{
          margin: "5px",
        }}
      />
      <Button
        label="Create Product"
        style={{
          margin: "5px",
          backgroundColor: "#34A853",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "0.8rem",
        }}
        onClick={createProductHandler}
      />
    </div>
  );

  const actionsBodyTemplate = (rowData) => {
    return (
      <>
        <button
          className="p-button-rounded p-button-success mr-2"
          style={{
            marginRight: "5px",
            backgroundColor: "#34A853",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.8rem", // Adjust font size as needed
          }}
          onClick={() => navigate(`/admin/product/${rowData._id}/edit`)}
        >
          Edit
        </button>
        <button
          className="p-button-rounded p-button-danger"
          style={{
            backgroundColor: "#EA4335",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.8rem", // Adjust font size as needed
          }}
          onClick={() => deleteHandler(rowData._id)}
        >
          Delete
        </button>
      </>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return rowData.category ? rowData.category.title : "No Category";
  };

  const categoryFilterTemplate = () => {
    return (
      <MultiSelect
        value={selectedCategories}
        options={categoryOptions}
        onChange={(e) => setSelectedCategories(e.value.map((v) => v))}
        optionLabel="label"
        placeholder="Select Categories"
        className="p-column-filter"
      />
    );
  };

  return (
    <div className="card">
      <DataTable
        value={getFilteredProducts()}
        paginator
        first={first} // Use the first state here
        onPage={(e) => {
          setFirst(e.first);
          setRowsPerPage(e.rows); // Update rows per page when paginator changes
        }}
        header={header}
        rows={rowsPerPage} // Use state here
        rowsPerPageOptions={[20, 30, 50]}
        filters={globalFilters}
      >
        <Column
          field="name"
          header="Name"
          filter
          filterMatchMode="contains"
          filterHeaderTemplate={
            <InputText
              value={globalFilters.name.value || ""}
              onInput={onNameFilterChange}
              placeholder="Search by name"
            />
          }
        />
        <Column header="Image" body={imageBodyTemplate} />
        <Column
          header="Category"
          body={categoryBodyTemplate}
          filter
          filterElement={categoryFilterTemplate}
          showFilterMenu={false} // Disable the filter menu
        />
        <Column field="brand" header="Brand" />
        <Column
          field="countInStock"
          header="Stock"
          body={stockBodyTemplate}
          sortable
        />
        <Column header="Actions" body={actionsBodyTemplate} />
      </DataTable>
    </div>
  );
};

export default ProductListScreen;
