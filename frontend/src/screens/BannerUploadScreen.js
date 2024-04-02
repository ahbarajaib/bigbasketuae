import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadBanner,
  viewBanner,
  deleteBanner,
} from "../actions/bannerActions";
import axios from "axios";
import { listCategories } from "../actions/categoryActions";

const BannerUploadScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const bannerView = useSelector((state) => state.bannerView);
  const { loading, images, error } = bannerView;

  const [category, setCategory] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Step 1: Create a ref for the file input

  const categoryList = useSelector((state) => state.categoryList);
  const { loading: loadingList, error: errorList, categories } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  // Handle Upload function
  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("category", category);
    formData.append("image", file);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axiosInstance.post("/api/banners", formData);

      setSelectedFileName(data);
      setImage(data);
      setUploading(false);
      fileInputRef.current.value = "";
      dispatch(viewBanner(category));
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleDelete = (category, imagePath) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteBanner(category, imagePath));
      dispatch(viewBanner(category)); // Dispatch the action again
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (selectedCategory) {
      dispatch(viewBanner(selectedCategory));
    }
    // Save the selected category to localStorage
    localStorage.setItem("selectedCategory", selectedCategory);
  };

  return (
    <>
      <FormContainer>
        <h1>Upload</h1>
        <Form onSubmit={handleUpload}>
          <Form.Select
            value={category}
            onChange={(e) => handleCategoryChange(e)}
          >
            <option value="">Select a category</option>
            {categories.map((categoryItem) => (
              <option key={categoryItem.name} value={categoryItem.name}>
                {categoryItem.title}
              </option>
            ))}
          </Form.Select>

          <Form.Group controlId="image" className="mb-2">
            <Form.Label>Image</Form.Label>
            <Col>
              <Form.Control
                type="file"
                id="image-file"
                label="Choose File"
                onChange={handleUpload}
                ref={fileInputRef}
              />
            </Col>
            {selectedFileName && (
              <Col className="mt-2">
                <Form.Control
                  type="text"
                  placeholder="Selected File"
                  readOnly
                  value={selectedFileName}
                />
              </Col>
            )}
            {uploading && <Loader />}
          </Form.Group>
        </Form>
      </FormContainer>
      <Col>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {images &&
                images.map((imagePath) => (
                  <tr key={imagePath}>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${imagePath}`}
                        alt="Uploaded"
                        style={{ maxHeight: "24px" }}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category, imagePath)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </>
  );
};

export default BannerUploadScreen;
