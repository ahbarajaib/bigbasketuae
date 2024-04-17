import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  listPromotionDetails,
  updatePromotion,
} from "../actions/promotionActions";
import { PROMOTION_UPDATE_RESET } from "../constants/promotionConstants";

const PromotionEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const promotionDetails = useSelector((state) => state.promotionDetails);
  const {
    loading: loadingDetails,
    error: errorDetails,
    promotion,
  } = promotionDetails;
  console.log(promotion);
  const promotionList = useSelector((state) => state.promotionList);
  const { loading, error, promotions } = promotionList;

  const promotionUpdate = useSelector((state) => state.promotionUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = promotionUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PROMOTION_UPDATE_RESET });
      navigate("/admin/promotions");
    } else {
      if (!promotion.title || promotion._id !== id) {
        dispatch(listPromotionDetails(id));
      } else {
        setTitle(promotion.title);
        setName(promotion.name);
        setImage(promotion.image);
      }
    }
  }, [dispatch, navigate, id, promotion, successUpdate]);

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
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axiosInstance.post(
        "/api/uploadpromotion",
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

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const newName = newTitle.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with dashes and convert to lowercase
    setName(newName);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updatePromotion({
        _id: id,
        title,
        name,
        image,
      })
    );
  };

  return (
    <>
      <Link to="/admin/promotions" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Promotion</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={handleTitleChange}
              />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>URL Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL-friendly name"
                value={name}
                readOnly // Optional: make this field read-only if you do not want it to be editable
              ></Form.Control>
            </Form.Group>
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
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default PromotionEditScreen;
