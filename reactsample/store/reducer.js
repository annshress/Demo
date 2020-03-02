import { combineReducers } from "redux";

import account from "../reducers/account";
import publicAppointmentBooking from "../reducers/publicAppointmentBooking";
import notification from "../reducers/notification";
import status from "../reducers/status";
import widget from "../reducers/widget";
import { ACCOUNT_LOGOUT } from "./actionTypes";

const appReducer = combineReducers({
  account: account,
  publicAppointmentBooking: publicAppointmentBooking,
  notification,
  status,
  widget
});

const rootReducer = (state, action) => {
  if (action.type === ACCOUNT_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
