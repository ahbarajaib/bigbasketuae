import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listPromotions,
  deletePromotion,
  createPromotion,
  togglePromotionActive,
} from "../actions/promotionActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PROMOTION_CREATE_RESET } from "../constants/promotionConstants";

const PromotionListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const promotionList = useSelector((state) => state.promotionList);
  const { loading, error, promotions } = promotionList;
  const [updateTrigger, setUpdateTrigger] = useState(false);
  console.log(promotions);
  const promotionCreate = useSelector((state) => state.promotionCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    promotion: createdPromotion,
  } = promotionCreate;

  const promotionDelete = useSelector((state) => state.promotionDelete);
  const { success: successDelete } = promotionDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PROMOTION_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/promotions/${createdPromotion._id}/edit`);
    } else {
      dispatch(listPromotions());
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdPromotion,
  ]);
  useEffect(() => {
    dispatch(listPromotions());
  }, [dispatch, successDelete, updateTrigger]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePromotion(id));
    }
  };

  const createPromotionHandler = () => {
    dispatch(createPromotion({}));
  };

  const toggleActiveHandler = (promotion) => {
    dispatch(togglePromotionActive(promotion._id));
    // Trigger a re-render
    setUpdateTrigger((prev) => !prev);
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Promotions</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createPromotionHandler}>
            <FontAwesomeIcon icon={faPlus} /> Create Promotion
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm"
          key={updateTrigger}
        >
          <thead>
            <tr>
              <th>TITLE</th>
              <th>NAME</th>
              <th>IMAGE</th>
              <th>CATEGORY</th>
              <th>ACTIVE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion._id}>
                <td>{promotion.title}</td>
                <td>{promotion.name}</td>
                <td>
                  <img
                    src={process.env.REACT_APP_API_URL + promotion.image}
                    alt={promotion.name}
                    style={{ width: "100px" }}
                    className="img-thumbnail"
                  />
                </td>
                <td>{promotion.category ? promotion.category.title : "N/A"}</td>{" "}
                {/* Add defensive check */}
                <td>
                  <Form.Check
                    type="switch"
                    id={promotion._id}
                    label=""
                    checked={promotion.isActive}
                    onChange={() => toggleActiveHandler(promotion)}
                  />
                </td>
                <td>
                  <LinkContainer to={`/admin/promotions/${promotion._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(promotion._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default PromotionListScreen;
