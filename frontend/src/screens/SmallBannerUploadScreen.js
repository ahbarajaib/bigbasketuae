import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadBanner,
  viewSmallBanner,
  deleteSmallBanner,
} from "../actions/bannerActions";
import axios from "axios";

const SmallBannerUploadScreen = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const [category, setCategory] = useState("");
  const smallBannerView = useSelector(
    (state) => state.smallBannerView.categories[category]
  );

  // Check if smallBannerView is defined
  const { loading, images, error } = smallBannerView || {};

  const [selectedFileName, setSelectedFileName] = useState("");

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Step 1: Create a ref for the file input

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (category) {
      dispatch(viewSmallBanner(category));
    }
  }, [dispatch, category]);
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

      // Include a query parameter for the bannerType
      const { data } = await axiosInstance.post(
        `/api/smallbanners`,
        formData,
        config
      );
      setSelectedFileName(data);
      setImage(data);
      setUploading(false);
      fileInputRef.current.value = "";
      dispatch(viewSmallBanner(category));
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleDelete = (category, imagePath) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteSmallBanner(category, imagePath));
      dispatch(viewSmallBanner(category)); // Dispatch the action again
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    // Dispatch action to fetch all small banners for the selected category
    if (selectedCategory) {
      dispatch(viewSmallBanner(selectedCategory));
    }
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

            <option value="spices-and-condiments">
              SPICES &amp; CONDIMENTS
            </option>
            <option value="legumes">LEGUMES</option>
            <option value="grains">GRAINS</option>
            <option value="oils-and-ghees">OILS &amp; GHEES</option>
            <option value="canned-and-jarred-goods">
              CANNED &amp; JARRED GOODS
            </option>
            <option value="dryfruits-nuts-and-chocolates">
              DRYFRUITS, NUTS &amp; CHOCOLATES
            </option>
            <option value="dairy-and-eggs">DAIRY &amp; EGGS</option>
            <option value="bakery-and-snacks">BAKERY &amp; SNACKS</option>
            <option value="beverages">BEVERAGES</option>
            <option value="wholesale">WHOLESALE</option>
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
                images.map((image) => (
                  <tr key={image}>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/banners/small/${image}`}
                        alt="Uploaded"
                        style={{ maxHeight: "24px" }}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category, image)}
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

export default SmallBannerUploadScreen;
