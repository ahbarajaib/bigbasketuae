import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listCategories,
  deleteCategory,
  createCategory,
} from "../actions/categoryActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CATEGORY_CREATE_RESET } from "../constants/categoryConstants";

const CategoryListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    category: createdCategory,
  } = categoryCreate;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { success: successDelete } = categoryDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: CATEGORY_CREATE_RESET });

    if (!userInfo && (!userInfo.isAdmin || !userInfo.isManager)) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/categories/${createdCategory._id}/edit`);
    } else {
      dispatch(listCategories());
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdCategory,
  ]);
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteCategory(id));
    }
  };

  const createCategoryHandler = () => {
    dispatch(createCategory());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className="my-3" onClick={createCategoryHandler}>
            <FontAwesomeIcon icon={faPlus} />
            Create a category
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Name</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) ? (
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.title}</td>

                  <td>{category.name}</td>
                  <td>
                    <img
                      src={process.env.REACT_APP_API_URL + category.image}
                      alt={category.name}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <LinkContainer
                      to={`/admin/categories/${category._id}/edit`}
                    >
                      <Button variant="light" className="btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(category._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No categories found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CategoryListScreen;
