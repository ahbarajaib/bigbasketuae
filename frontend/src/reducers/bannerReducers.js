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
