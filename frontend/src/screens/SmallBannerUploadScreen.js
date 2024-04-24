import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadSmallBanner,
  deleteSmallBanner,
  viewAllSmallBanners,
} from "../actions/bannerActions";
import { listCategories } from "../actions/categoryActions";

const SmallBannerUploadScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");

  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const allSmallBanners = useSelector((state) => state.allSmallBanners);
  const { loading, banners, error } = allSmallBanners;
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo) navigate("/login");
    else {
      dispatch(listCategories());
      dispatch(viewAllSmallBanners());
    }
  }, [dispatch, navigate, userInfo]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("category", category); // Make sure this is not empty

    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await dispatch(uploadSmallBanner(formData, config));
      setUploading(false);
      dispatch(viewAllSmallBanners()); // Refresh the banners
    } catch (error) {
      console.error("Error uploading small banner:", error);
      setUploading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (selectedCategory) {
      dispatch(viewAllSmallBanners());
    }
    // Save the selected category to localStorage
    localStorage.setItem("selectedCategory", selectedCategory);
  };

  const handleDelete = async (category, imagePath) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await dispatch(deleteSmallBanner(category, imagePath));
      dispatch(viewAllSmallBanners()); // Refresh the banners
    }
  };

  return (
    <>
      <FormContainer>
        <h1>Upload Small Banner</h1>
        <Form>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => handleCategoryChange(e)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="image" className="my-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleUpload(e, category)}
              disabled={!category}
            />
            {uploading && <Loader />}
          </Form.Group>
        </Form>
      </FormContainer>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {banners
              .filter((banner) => banner.category === category)
              .flatMap((banner) =>
                banner.imagePaths.map((imagePath) => (
                  <tr key={imagePath}>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/banners/small/${imagePath}`}
                        alt="Banner"
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{banner.category}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(banner.category, imagePath)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SmallBannerUploadScreen;
