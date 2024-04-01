import axios from "axios";
import {
  BANNER_UPLOAD_REQUEST,
  BANNER_UPLOAD_SUCCESS,
  BANNER_UPLOAD_FAIL,
  BANNER_VIEW_REQUEST,
  BANNER_VIEW_SUCCESS,
  BANNER_VIEW_FAIL,
  BANNER_DELETE_REQUEST,
  BANNER_DELETE_SUCCESS,
  BANNER_DELETE_FAIL,
  SMALL_BANNER_UPLOAD_REQUEST,
  SMALL_BANNER_UPLOAD_SUCCESS,
  SMALL_BANNER_UPLOAD_FAIL,
  ALL_SMALL_BANNER_VIEW_REQUEST,
  ALL_SMALL_BANNER_VIEW_SUCCESS,
  ALL_SMALL_BANNER_VIEW_FAIL,
  SMALL_BANNER_VIEW_REQUEST,
  SMALL_BANNER_VIEW_SUCCESS,
  SMALL_BANNER_VIEW_FAIL,
  SMALL_BANNER_DELETE_REQUEST,
  SMALL_BANNER_DELETE_SUCCESS,
  SMALL_BANNER_DELETE_FAIL,
} from "../constants/bannerConstants";
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Upload Banner Image
// actions/bannerActions.js
export const uploadBanner = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: BANNER_UPLOAD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axiosInstance.post("/api/banners", formData, config);

    dispatch({ type: BANNER_UPLOAD_SUCCESS, payload: data.imagePath });
  } catch (error) {
    dispatch({
      type: BANNER_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// View Banner Images
export const viewBanner = (category) => async (dispatch) => {
  try {
    dispatch({ type: BANNER_VIEW_REQUEST });

    const { data } = await axiosInstance.get(`/api/banners/${category}`);

    dispatch({ type: BANNER_VIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BANNER_VIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete Banner
export const deleteBanner =
  (category, imagePath) => async (dispatch, getState) => {
    try {
      dispatch({ type: BANNER_DELETE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Call the server route that handles deletion
      await axiosInstance.delete(
        `/api/banners/${category}?imagePath=${imagePath}`,
        config
      );

      dispatch({ type: BANNER_DELETE_SUCCESS });
    } catch (error) {
      dispatch({
        type: BANNER_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// Upload Small Banner Image
export const uploadSmallBanner = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SMALL_BANNER_UPLOAD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axiosInstance.post(
      "/api/smallbanners",
      formData,
      config
    );

    dispatch({ type: SMALL_BANNER_UPLOAD_SUCCESS, payload: data.imagePath });
  } catch (error) {
    dispatch({
      type: SMALL_BANNER_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const viewAllSmallBanners = () => async (dispatch) => {
  try {
    dispatch({ type: "ALL_SMALL_BANNER_VIEW_REQUEST" });
    const { data } = await axiosInstance.get(`/api/smallbanners/all`);
    dispatch({
      type: "ALL_SMALL_BANNER_VIEW_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ALL_SMALL_BANNER_VIEW_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// View Banner Images
export const viewSmallBanner = (category) => async (dispatch) => {
  try {
    dispatch({ type: SMALL_BANNER_VIEW_REQUEST, payload: category });

    const { data } = await axiosInstance.get(`/api/smallbanners/${category}`);

    // Dispatch SMALL_BANNER_VIEW_SUCCESS
    dispatch({
      type: SMALL_BANNER_VIEW_SUCCESS,
      payload: { category, images: data.imagePaths },
    });
  } catch (error) {
    // Dispatch SMALL_BANNER_VIEW_FAIL
    dispatch({
      type: SMALL_BANNER_VIEW_FAIL,
      payload: { category, error: error.message },
    });
  }
};

// Delete Small Banner
export const deleteSmallBanner =
  (category, imagePath) => async (dispatch, getState) => {
    try {
      dispatch({ type: SMALL_BANNER_DELETE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Call the server route that handles deletion
      await axiosInstance.delete(
        `/api/smallbanners/${category}?imagePath=${imagePath}`,
        config
      );

      dispatch({ type: SMALL_BANNER_DELETE_SUCCESS });
    } catch (error) {
      dispatch({
        type: SMALL_BANNER_DELETE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
