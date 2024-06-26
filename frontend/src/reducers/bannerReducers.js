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
  SMALL_BANNER_VIEW_REQUEST,
  SMALL_BANNER_VIEW_SUCCESS,
  SMALL_BANNER_VIEW_FAIL,
  SMALL_BANNER_DELETE_REQUEST,
  SMALL_BANNER_DELETE_SUCCESS,
  SMALL_BANNER_DELETE_FAIL,
} from "../constants/bannerConstants";

export const bannerUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_UPLOAD_REQUEST:
      return { loading: true };
    case BANNER_UPLOAD_SUCCESS:
      return { loading: false, success: true, imagePath: action.payload };
    case BANNER_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bannerViewReducer = (state = { images: [] }, action) => {
  switch (action.type) {
    case BANNER_VIEW_REQUEST:
      return { loading: true, images: [] };
    case BANNER_VIEW_SUCCESS:
      return {
        loading: false,
        images: action.payload.imagePaths,
      };
    case BANNER_VIEW_FAIL:
      return { loading: false, error: action.payload, images: [] };
    default:
      return state;
  }
};

export const bannerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BANNER_DELETE_REQUEST:
      return { loading: true };
    case BANNER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case BANNER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Small Banner Reducers
export const smallBannerUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case SMALL_BANNER_UPLOAD_REQUEST:
      return { loading: true };
    case SMALL_BANNER_UPLOAD_SUCCESS:
      return { loading: false, success: true, imagePath: action.payload };
    case SMALL_BANNER_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// initialState with an object to store images for each category
const initialState = { loading: true, banners: [], error: null };

export const allSmallBannersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_SMALL_BANNER_VIEW_REQUEST":
      return { ...state, loading: true };
    case "ALL_SMALL_BANNER_VIEW_SUCCESS":
      return { loading: false, banners: action.payload, error: null };
    case "ALL_SMALL_BANNER_VIEW_FAIL":
      return { loading: false, error: action.payload, banners: [] };
    default:
      return state;
  }
};
export const smallBannerViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SMALL_BANNER_VIEW_REQUEST:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload]: { loading: true, images: [], error: null },
        },
      };
    case SMALL_BANNER_VIEW_SUCCESS:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.category]: {
            loading: false,
            images: action.payload.images,
            error: null,
          },
        },
      };
    case SMALL_BANNER_VIEW_FAIL:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload]: {
            loading: false,
            error: action.payload.error,
            images: [],
          },
        },
      };
    default:
      return state;
  }
};

export const smallBannerDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SMALL_BANNER_DELETE_REQUEST:
      return { loading: true };
    case SMALL_BANNER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case SMALL_BANNER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
