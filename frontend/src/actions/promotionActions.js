import axios from "axios";
import {
  PROMOTION_LIST_REQUEST,
  PROMOTION_LIST_SUCCESS,
  PROMOTION_LIST_FAIL,
  PROMOTION_DETAILS_REQUEST,
  PROMOTION_DETAILS_SUCCESS,
  PROMOTION_DETAILS_FAIL,
  PROMOTION_CREATE_REQUEST,
  PROMOTION_CREATE_SUCCESS,
  PROMOTION_CREATE_FAIL,
  PROMOTION_UPDATE_REQUEST,
  PROMOTION_UPDATE_SUCCESS,
  PROMOTION_UPDATE_FAIL,
  PROMOTION_DELETE_REQUEST,
  PROMOTION_DELETE_SUCCESS,
  PROMOTION_DELETE_FAIL,
  PROMOTION_TOGGLE_REQUEST,
  PROMOTION_TOGGLE_SUCCESS,
  PROMOTION_TOGGLE_FAIL,
} from "../constants/promotionConstants";
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const listPromotions = () => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_LIST_REQUEST });
    const { data } = await axiosInstance.get(`/api/promotions`);
    dispatch({
      type: PROMOTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listPromotionDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(`/api/promotions/${id}`);
    dispatch({
      type: PROMOTION_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createPromotion = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROMOTION_CREATE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axiosInstance.post(`/api/promotions`, {}, config);
    dispatch({
      type: PROMOTION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updatePromotion = (promotion) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROMOTION_UPDATE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axiosInstance.put(
      `/api/promotions/${promotion._id}`,
      promotion,
      config
    );
    dispatch({
      type: PROMOTION_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deletePromotion = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROMOTION_DELETE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axiosInstance.delete(`/api/promotions/${id}`, config);
    dispatch({
      type: PROMOTION_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const togglePromotionActive = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PROMOTION_TOGGLE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axiosInstance.post(
      `/api/promotions/toggle-active/${id}`,
      {},
      config
    );
    dispatch({
      type: PROMOTION_TOGGLE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_TOGGLE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
