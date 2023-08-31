import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_UPDATE_ITEM,
} from "../constants/cartConstants";

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

//get id and qty from the url
// cartActions.js

export const addToCart =
  (
    id,
    noOfProducts,
    selectedQty,
    selectedPrice,
    selectedDiscount,
    selectedDiscountedPrice,
    selectedUnits
  ) =>
  async (dispatch, getState) => {
    const { data } = await axiosInstance.get(`/api/products/${id}`);
    //this works
    const cartItem = {
      product: data._id,
      name: data.name,
      image: data.image,
      noOfProducts,
      selectedQty,
      selectedPrice,
      selectedDiscount,
      selectedDiscountedPrice,
      selectedUnits,
      countInStock: data.countInStock,
    };

    dispatch({
      type: CART_ADD_ITEM,
      payload: cartItem,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const updateSelectedQtyPrice = (
  productId,
  noOfProducts,
  selectedQty,
  selectedPrice
) => {
  return {
    type: CART_UPDATE_ITEM,
    payload: {
      productId,
      noOfProducts,
      selectedQty,
      selectedPrice,
    },
  };
};

export const addProductToCartFromProductComponent = (
  productId,
  noOfProducts,
  selectedQty,
  selectedUnits,
  selectedPrice
) => {
  return {
    type: CART_UPDATE_ITEM,
    payload: {
      productId,
      noOfProducts,
      selectedQty,
      selectedUnits,
      selectedPrice,
    },
  };
};

export const updateCart =
  (noOfProducts, selectedQty, selectedPrice) => async (dispatch, getState) => {
    dispatch({
      type: CART_UPDATE_ITEM,
      payload: {
        selectedPrice,
        selectedQty,

        noOfProducts,
      },
    });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
