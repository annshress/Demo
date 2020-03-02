import { EMPLOYEE_ONLINE, EMPLOYEE_OFFLINE } from "../store/actionTypes";

// list of employees
const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case EMPLOYEE_ONLINE:
      return [
        ...state.filter(each => each.id !== action.payload.id),
        {
          id: action.payload.id,
          is_online: true
        }
      ];
    case EMPLOYEE_OFFLINE:
      return [
        ...state.filter(each => each.id !== action.payload.id),
        {
          id: action.payload.id,
          is_online: false,
          last_seen_online: new Date().getTime()
        }
      ];
    default:
      return state;
  }
};
