import { UPDATE_BOOKING, CLEAR_BOOKING } from "../store/actionTypes";

const initialState = {
  // this is to tally if the current booking data belongs to the same company as the url
  company: undefined,
  //
  service_bookings: [
    // {
    //   booked_date: "2019-10-1",
    //   employee: 2,
    //   service: 1,
    //   start_time: "11:30"
    // }
  ],
  price: 0,
  tax: 0,
  total: 0,
  deposit: 0,
  tax_percentage: 0,
  deposit_percentage: 0,
  // client info
  payment: 0,
  client: {
    name: "",
    email: "",
    contact: "",
    address_one: "",
    address_two: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    notes: ""
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BOOKING:
      return {
        ...state,
        ...action.payload
      };
    case CLEAR_BOOKING:
      return initialState;
    default:
      return state;
  }
};
