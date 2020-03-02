import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import TextInput from "../../../../commons/form_fields/textInput";
import Divider from "../../../../commons/divider";

function BookingOptionForm(props) {
  const { onSubmit, option } = props;

  return (
    <div className="employee_form form_booking_options">
      <Form
        initialValues={option}
        onSubmit={onSubmit}
        render={({
          submitError,
          handleSubmit,
          reset,
          submitting,
          pristine,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            {submitError && <span className="bg_error">{submitError}</span>}

            <div className="row">
              <div className="col-4 form-fields text-right">
                <label>Step (in minutes)</label>
              </div>
              <div className="col-8 form-fields">
                <Field name="step">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      max="100"
                      min="1"
                      value="30"
                      disabled={true}
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="col-4 form-fields text-right">
                <label>
                  Accept bookings X hours before appointment start time
                </label>
              </div>
              <div className="col-8">
                <Field name="accept_bookings_prior">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      min="0"
                      max="30"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="col-4 form-fields text-right">
                <label className={'label-cancel-booking'}>
                  Clients can cancel a booking up to X hours before appointment
                  start time
                </label>
              </div>
              <div className="col-8">
                <Field name="cancel_bookings_prior">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      min="0"
                      max="30"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="col-4 form-fields text-right">
                <label>Accept bookings X days ahead</label>
              </div>
              <div className="col-8">
                <Field name="accept_booking_prior_days">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      min="1"
                      max="100"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="col-4 form-fields text-right">
                <label>
                  Set deposit % to be collected for each appointment
                </label>
              </div>
              <div className="col-8">
                <Field name="deposit">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      min="1"
                      max="100"
                      // defaultValue="15"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="col-4 form-fields text-right">
                <label>Tax % to be collected for each appointment</label>
              </div>
              <div className="col-8 form-fields">
                <Field name="tax">
                  {({ input, meta }) => (
                    <TextInput
                      type="number"
                      col="6"
                      className="percentage_field"
                      min="1"
                      max="100"
                      //   defaultValue="10.00"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className="row">
              <Divider type={'with_border'}/>
            </div>
            <div className="row">
              <div className="col-12 form-fields text-left">
                <button name="" className="btn btn-primary pl-5 pr-5" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
}

BookingOptionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default BookingOptionForm;
