import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Form } from "react-final-form";
import PropTypes from "prop-types";
import arrayMutators from "final-form-arrays";
import { withRouter } from "react-router-dom";

import "../add_booking/style.scss";

import BookingForm from "../booking_form";
import ClientForm from "../client_form";
import BookingCart from "../booking_cart";

import {
  handleEditBooking,
  handleGetBooking,
  handleDeleteServiceBooking
} from "../../../../remote_access/appointment/bookings";

function EditBookingContent(props) {
  const [booking, setBooking] = useState({
    id: props.instance_id,
    booking_id: "",
    created_at: "",
    status: 1,
    payment: 1,
    price: "",
    tax: "",
    total: "",
    deposit: "",
    client: {
      name: "",
      email: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      country: "",
      state: "",
      city: "",
      zip: "",
      notes: ""
    },
    service_bookings: []
  });
  const [cart, setCart] = useState({
    total: 0,
    tax: 0,
    price: 0,
    deposit: 0
  });

  useEffect(() => {
    async function getBooking() {
      const response = await handleGetBooking({
        company_id: props.company_id,
        instance_id: props.instance_id
      });
      if (response.ok) {
        // console.log(response.result);
        setBooking(response.result);
        setCart({
          status: response.result.status,
          total: response.result.total,
          tax: response.result.tax,
          price: response.result.price,
          deposit: response.result.deposit
        });
      }
    }
    getBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.instance_id]);

  const deleteServiceBooking = service_booking_id => {
    console.log("deleting", service_booking_id);
    handleDeleteServiceBooking({
      company_id: props.company_id,
      instance_id: service_booking_id
    });
  };

  const onSubmit = async values => {
    const response = await handleEditBooking({
      company_id: props.company_id,
      instance_id: props.instance_id,
      data: values
    });
    if (!response.ok) {
      return response;
    }else{
      props.history.push(`/${props.company_id}/appointment/managebooking`);
    }
    // window.alert(JSON.stringify(values, undefined, 2));
  };

  return (
    <div className="row">
      <div className="col-9">
        <Form
          initialValues={booking}
          mutators={{ ...arrayMutators }}
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
                    company_id={props.company_id}
                    deleteServiceBooking={deleteServiceBooking}
                    instance_id={props.instance_id}
                  />
                </Tab>
                <Tab eventKey="client" title="Client">
                  <ClientForm client={booking.client} />
                </Tab>
              </Tabs>
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
          )}
        />
      </div>
      <div className="col-3">
        <BookingCart cart={cart} booking={booking} />
      </div>
    </div>
  );
}

EditBookingContent.propTypes = {
  instance_id: PropTypes.string.isRequired
};

export default withRouter(EditBookingContent);
