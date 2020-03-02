import {
  ACTION_TYPE_BAD, ACTION_TYPE_CREATED, ACTION_TYPE_DELETED,
  ACTION_TYPE_FORBIDDEN, ACTION_TYPE_NOT_FOUND,
  ACTION_TYPE_SERVER_ERROR, ACTION_TYPE_SUCCESS,
  ACTION_TYPE_UNAUTHORIZED,
  ACTION_TYPE_SERVICE_UNAVAILABLE,
  ACTION_TYPE_REMOVE
} from "../store/actionTypes";

const initialState = {
  showNotification:false,
  ok: undefined,
  message: ""
};

export default (state = initialState, action) =>{
  switch (action.type) {
    case ACTION_TYPE_SERVICE_UNAVAILABLE:
      return {
        showNotification:true,
        ok: false,
        message:
          action.message ||
          "Service is unavailable!!!"
      };
    case ACTION_TYPE_SERVER_ERROR:
      return {
        showNotification:true,
        ok: false,
        message:
          action.message ||
          "Something grave occured. Our monkeys are on their way to patch things up!!!"
      };
    case ACTION_TYPE_BAD:
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

    case ACTION_TYPE_FORBIDDEN:
      return {
        showNotification:true,
        ok: false,
        message: action.message || "You are forbidden to perform the action."
      };
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

        ok: true,
        message: action.message || "Action Successful!"
      };
    case ACTION_TYPE_REMOVE:
      return {
        showNotification:false
      };
    default:
      return state;
  }
}
