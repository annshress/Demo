import React from "react";
import { find } from "lodash";

import { BOOKING_STATUS } from "./booking_form";

import iconConfirmed from "../../../assets/img/confirmed_icon.png";

function BookingCart({ cart, booking }) {
  let prices = [];
  let status = 0;

  if (booking) {
    prices = booking.service_bookings.map(each => each.price);
    status = booking.status;
  }
  status = find(BOOKING_STATUS, each => each.value === status).label;

  return (
    <div className="booking_cart">
      <table>
        <tbody>
          <tr className={"status_tr " + status}>
            <th>
              <img src={iconConfirmed} alt="" /> Status
            </th>
            <th>{status}</th>
          </tr>
          {prices.map((each, index) => (
            <tr key={index}>
              <td />
              <td>+{each}</td>
            </tr>
          ))}
          <tr>
            <td>Price</td>
            <td>{cart.price}</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td>{cart.tax}</td>
          </tr>
          <tr className="cart_total">
            <td>Total</td>
            <td>{cart.total}</td>
          </tr>
          <tr>
            <td>Deposit</td>
            <td>{cart.deposit}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BookingCart;
