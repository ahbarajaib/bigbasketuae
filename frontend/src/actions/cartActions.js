import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_UPDATE_ITEM,
} from "../constants/cartConstants";

//get id and qty from the url
// cartActions.js

// Modify addToCart action
// cartActions.js

export const addToCart = (cartItem) => (dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: cartItem,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Action to update the quantity in the cart
export const updateCartQuantity =
  (cartItemId, newQuantity) => (dispatch, getState) => {
    dispatch({
      type: "CART_UPDATE_ITEM",
      payload: { cartItemId, newQuantity },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const removeFromCart = (cartItemId) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: cartItemId,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  const formattedData = {
    ...data,
    coordinates: {
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude,
    },
  };

  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: formattedData,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(formattedData));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
