import {
  WIDGET_GET_GLOBAL,
  WIDGET_GET_APPOINTMENT_SCHEDULER,
  WIDGET_GET_ACTIVATED_APPOINTMENT_SCHEDULER
} from "../store/actionTypes";

const initialState = {
  global:[],
  appointment_scheduler:[],
  activated_appointment_scheduler:[]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WIDGET_GET_GLOBAL:
      return {
        ...state,
        global:action.result
      };
    case WIDGET_GET_APPOINTMENT_SCHEDULER:
      return {
        ...state,
        appointment_scheduler:action.result
      };
    case WIDGET_GET_ACTIVATED_APPOINTMENT_SCHEDULER:
      return {
        ...state,
        activated_appointment_scheduler:action.result
      };
    default:
      return state;
  }
};
