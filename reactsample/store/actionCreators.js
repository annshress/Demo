import { HTTP_STATUS } from "../remote_access";

import store from ".";

import {
  ACTION_TYPE_SERVICE_UNAVAILABLE,
  ACTION_TYPE_SERVER_ERROR,
  ACTION_TYPE_UNAUTHORIZED,
  ACTION_TYPE_FORBIDDEN,
  ACTION_TYPE_NOT_FOUND,
  ACTION_TYPE_SUCCESS,
  ACTION_TYPE_REMOVE,
  ACTION_TYPE_BAD,
  ACTION_TYPE_CREATED,
  ACTION_TYPE_DELETED,
  ACTION_TYPE_LOADING,
  ACCOUNT_GET_USER_DETAILS,
  EMPLOYEE_ONLINE,
  EMPLOYEE_OFFLINE
} from "./actionTypes";

function hideNotification() {
  return {
    type: ACTION_TYPE_REMOVE
  };
}

export function generateNotification(httpCode, message) {
  let action = { message: message };
  switch (httpCode) {
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      action.type = ACTION_TYPE_SERVICE_UNAVAILABLE;
      return action;
    case HTTP_STATUS.SERVER_ERROR:
      action.type = ACTION_TYPE_SERVER_ERROR;
      return action;
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

    default:
      return { type: ACTION_TYPE_REMOVE };
  }
}

export function generateAndRemoveNotification(httpCode, message) {
  store.dispatch(generateNotification(httpCode, message));
  setTimeout(() => {
    store.dispatch(hideNotification());
  }, 5000);
}

export function loadingActionCreator(loading) {
  switch (loading) {
    case true:
      return { type: ACTION_TYPE_LOADING, loading };
    default:
      return { type: ACTION_TYPE_LOADING, loading: false };
  }
}

export function isLoading(loading) {
  store.dispatch(loadingActionCreator(loading));
}

export function userDetails({
  username,
  first_name,
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  } else {
    store.dispatch({
      type: EMPLOYEE_OFFLINE,
      payload: { id: id }
    });
  }
}
