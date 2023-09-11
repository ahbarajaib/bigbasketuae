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

// Modify addToCart action
// cartActions.js

export const addToCart =
  (product, variant, cartItemId) => (dispatch, getState) => {
    const cartItem = {
      id: cartItemId, // Use cartItemId as the cart item's ID
      product: product._id,
      name: product.name,
      image: product.image,
      variant, // Pass the variant object
      countInStock: product.countInStock,
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

// Modify updateCartQuantity action
// Modify updateCartQuantity action
export const updateCartQuantity =
  (cartItem, selectedNoOfProducts) => (dispatch, getState) => {
    dispatch({
      type: CART_UPDATE_ITEM,
      payload: { cartItem, selectedNoOfProducts },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

// export const addToCart =
//   (product, selectedQty, variant) => (dispatch, getState) => {
//     const cartItem = {
//       product: product._id,
//       name: product.name,
//       image: product.image,
//       selectedQty,
//       variant, // Pass the variant object
//       countInStock: product.countInStock,
//     };

//     dispatch({
//       type: CART_ADD_ITEM,
//       payload: cartItem,
//     });

//     localStorage.setItem(
//       "cartItems",
//       JSON.stringify(getState().cart.cartItems)
//     );
//   };

// export const updateCartQuantity =
//   (productId, selectedQty, selectedNoOfProducts) => (dispatch, getState) => {
//     dispatch({
//       type: CART_UPDATE_ITEM,
//       payload: { productId, selectedQty, selectedNoOfProducts },
//     });

//     localStorage.setItem(
//       "cartItems",
//       JSON.stringify(getState().cart.cartItems)
//     );
//   };

export const removeFromCart = (cartItemId) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: cartItemId,
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
