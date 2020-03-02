import {
  ACCOUNT_GET_USER_DETAILS,
  ACTION_TYPE_LOADING,
  ACCOUNT_LOGIN,
  ACCOUNT_COMPANY_REGISTRATION_SUCCESS
} from "../store/actionTypes";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE_LOADING:
      return {
        ...state,
        loading: action.loading
      };
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        avatar: action.payload.avatar,
        last_login: action.payload.last_login
      };
    case ACCOUNT_COMPANY_REGISTRATION_SUCCESS:
      return {
        ...state,
        company_id: action.payload.company_id
      };
    default:
      return state;
  }
};
