import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import { Alert, Button, Spinner } from "react-bootstrap";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../commons/validators";
import Divider from "../../../../commons/divider";
import Notification from "../../../notification";

import {
  requestSMSAuthentication,
  verifySMSAuthentication
} from "../../../../remote_access/accounts/two_factor_auth";

function SetupSMS(props) {
  const { setTwoFactorAuth, handleCloseTwoFactorAuth } = props;

  const [state, setState] = React.useState({
    phone_number: null,
    stored_number: null,
    sent_on: null
  });

  const canResend = () => {
    const d2 = new Date();
    // if more than 30 seconds since last try...
    if (d2.getTime() - state.sent_on > 30000) {
      return true;
    }
    return false;
  };

  const onSubmit = async values => {
    const response = await requestSMSAuthentication(values);
    if (response.ok) {
      let d = new Date();
      setState({
        phone_number: response.result.phone_number,
        stored_number: values.phone_number,
        sent_on: d.getTime()
      });
      setTwoFactorAuth(true);
    } else {
      return response;
    }
  };

  const onCodeSubmit = async values => {
    const response = await verifySMSAuthentication(values);
    if (response.ok) {
      alert("Two factor authentication has been enabled.");
      handleCloseTwoFactorAuth();
    } else {
      return response;
    }
  };

  return (
    <React.Fragment>
      <strong>Setup SMS Authentication</strong>
      {!state.phone_number ? (
        <Form
          onSubmit={onSubmit}
          render={({
            submitError,
            handleSubmit,
            reset,
            submitting,
            pristine,
            values
          }) => (
            <form onSubmit={handleSubmit} className={"employee_form"}>
              <Notification hasMarginLeftRight={false} />
              <div className="row">
                <div className="col-12">
                  {submitError && (
                    <React.Fragment>
                      <Alert variant="danger">{submitError}</Alert>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Field name="phone_number" validate={required}>
                    {({ input, meta }) => (
                      <TextInput
                        label="Phone Number*"
                        placeholder=""
                        meta={meta}
                        {...input}
                      />
                    )}
                  </Field>
                </div>
              </div>
              <div className="row">
                <Divider type="blank" />
              </div>
              <div className="row">
                <div className="col-12">
                  <Button
                    variant="primary"
                    size={"lg"}
                    block
                    disabled={submitting}
                    type={"submit"}
                    className={"with-spinner-right"}
                  >
                    Send Code
                    {submitting && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        />
      ) : (
        <React.Fragment>
          <p>
            We have sent a verification code to your number {state.phone_number}
            . Please enter the code to activate two factor authentication.{" "}
            <br />
            <i>
              Didn't receive the code?{" "}
              <button
                className="btn btn-sm"
                onClick={() =>
                  canResend() && onSubmit({ phone_number: state.stored_number })
                }
              >
                Resend
              </button>
              <br /> We need to enable ABOVE BUTTON AFTER CERTAIN TIME ONLY
              <p>
                Or{" "}
                <button className="btn btn-sm" onClick={() => setState({})}>
                  Enter a different number
                </button>
              </p>
            </i>
          </p>
          <Form
            onSubmit={onCodeSubmit}
            render={({
              submitError,
              handleSubmit,
              reset,
              submitting,
              pristine,
              values
            }) => (
              <form onSubmit={handleSubmit} className={"employee_form"}>
                <Notification hasMarginLeftRight={false} />
                <div className="row">
                  <div className="col-12">
                    {submitError && (
                      <React.Fragment>
                        <Alert variant="danger">{submitError}</Alert>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Field name="mfa_code" validate={required}>
                      {({ input, meta }) => (
                        <TextInput
                          label="Verification Code*"
                          placeholder="1 2 3 4 5 6"
                          meta={meta}
                          {...input}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <Divider type="blank" />
                </div>
                <div className="row">
                  <div className="col-12">
                    <Button
                      variant="primary"
                      size={"lg"}
                      block
                      disabled={submitting}
                      type={"submit"}
                      className={"with-spinner-right"}
                    >
                      Verify
                      {submitting && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default SetupSMS;
