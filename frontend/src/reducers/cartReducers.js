import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_UPDATE_ITEM,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const newItem = action.payload;

      // Check if an item with the same id (based on product ID and selectedQty) exists in the cart
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        // If it exists, update the quantity of the existing item
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].selectedNoOfProducts +=
          newItem.selectedNoOfProducts;
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // If it doesn't exist, add the new item to the cart
        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
        };
      }

    case CART_UPDATE_ITEM:
      const { cartItem, selectedNoOfProducts } = action.payload;
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === cartItem.id
          ? {
              ...item,
              variant: {
                ...item.variant,
                selectedNoOfProducts,
              },
            }
          : item
      );

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.id !== action.payload),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    default:
      return state;
  }
};
