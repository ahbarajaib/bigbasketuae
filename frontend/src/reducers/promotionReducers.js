//Promotion List Reducer
import {
  PROMOTION_LIST_REQUEST,
  PROMOTION_LIST_SUCCESS,
  PROMOTION_LIST_FAIL,
  PROMOTION_DELETE_REQUEST,
  PROMOTION_DELETE_SUCCESS,
  PROMOTION_DELETE_FAIL,
  PROMOTION_CREATE_REQUEST,
  PROMOTION_CREATE_SUCCESS,
  PROMOTION_CREATE_FAIL,
  PROMOTION_CREATE_RESET,
  PROMOTION_UPDATE_REQUEST,
  PROMOTION_UPDATE_SUCCESS,
  PROMOTION_UPDATE_FAIL,
  PROMOTION_UPDATE_RESET,
  PROMOTION_DETAILS_REQUEST,
  PROMOTION_DETAILS_SUCCESS,
  PROMOTION_DETAILS_FAIL,
  PROMOTION_TOGGLE_REQUEST,
  PROMOTION_TOGGLE_SUCCESS,
  PROMOTION_TOGGLE_FAIL,
} from "../constants/promotionConstants";

export const promotionListReducer = (state = { promotions: [] }, action) => {
  switch (action.type) {
    case PROMOTION_LIST_REQUEST:
      return { loading: true, promotions: [] };
    case PROMOTION_LIST_SUCCESS:
      return { loading: false, promotions: action.payload };
    case PROMOTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const promotionDetailsReducer = (state = { promotion: [] }, action) => {
  switch (action.type) {
    case PROMOTION_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PROMOTION_DETAILS_SUCCESS:
      return { loading: false, promotion: action.payload };
    case PROMOTION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const promotionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PROMOTION_DELETE_REQUEST:
      return { loading: true };
    case PROMOTION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PROMOTION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const promotionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PROMOTION_CREATE_REQUEST:
      return { loading: true };
    case PROMOTION_CREATE_SUCCESS:
      return { loading: false, success: true, promotion: action.payload };
    case PROMOTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PROMOTION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const promotionUpdateReducer = (state = { promotion: {} }, action) => {
  switch (action.type) {
    case PROMOTION_UPDATE_REQUEST:
      return { loading: true };
    case PROMOTION_UPDATE_SUCCESS:
      return { loading: false, success: true, promotion: action.payload };
    case PROMOTION_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PROMOTION_UPDATE_RESET:
      return { promotion: {} };
    default:
      return state;
  }
};

export const promotionToggleReducer = (state = { promotion: {} }, action) => {
  switch (action.type) {
    case PROMOTION_TOGGLE_REQUEST:
      return { loading: true };
    case PROMOTION_TOGGLE_SUCCESS:
      const updatedPromotions = state.promotions.map((promotion) =>
        promotion._id === action.payload._id
          ? { ...promotion, isActive: !promotion.isActive }
          : promotion
      );
      return {
        ...state,
        promotions: updatedPromotions,
      };
    case PROMOTION_TOGGLE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
