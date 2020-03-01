import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Form } from "react-final-form";
import { withRouter } from "react-router-dom";
import arrayMutators from "final-form-arrays";
import PropTypes from "prop-types";

import BookingForm from "../booking_form";
import ClientForm from "../client_form";
import BookingCart from "../booking_cart";

import { handleAddBooking } from "../../../../remote_access/appointment/bookings";

function AddBookingContent(props) {
  const { company_id } = props;

  const [booking, setBooking] = useState({
    id: null,
    booking_id: "",
    status: 0,
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
    },
    service_bookings: []
  });

  const [cart] = useState({
    status: null,
    total: 0,
    tax: 0,
    sub_total: 0,
    deposit: 0
  });

  const onSubmit = async values => {
    const response = await handleAddBooking({
      company: company_id,
      data: values
    });
    if (!response.ok) {
      return response;
    } else {
      props.history.push(`/${company_id}/appointment/managebooking`);
    }
  };

  return (
    <div className="row">
      <div className="col-8">
        <Form
          initialValues={booking}
          mutators={{
            ...arrayMutators
          }}
          onSubmit={onSubmit}
          render={({
            submitError,
            handleSubmit,
            form: {
              mutators: { push, pop }
            },
            reset,
            submitting,
            pristine,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              {submitError && <span className="bg_error">{submitError}</span>}

              <Tabs defaultActiveKey="booking" id="add-booking">
                <Tab eventKey="booking" title="Booking">
                  <BookingForm
                    booking={booking}
                    push={push}
                    pop={pop}
                    setBooking={setBooking}
                    company_id={company_id}
                  />
                </Tab>
                <Tab eventKey="client" title="Client">
                  <ClientForm client={booking.client} />
                </Tab>
              </Tabs>
            </form>
          )}
        />
      </div>
      <div className="col-4">
        <BookingCart cart={cart} />
      </div>
    </div>
  );
}

AddBookingContent.propTypes = {
  company_id: PropTypes.string.isRequired
};

export default withRouter(AddBookingContent);
