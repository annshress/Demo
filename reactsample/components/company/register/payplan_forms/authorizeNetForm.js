import React from "react";
import { connect } from "react-redux";
import { Form, Field } from "react-final-form";
import { Alert, Button, Spinner } from "react-bootstrap";
import IosArrowRoundForward from "react-ionicons/lib/IosArrowRoundForward";
import IosInformationCircleOutline from "react-ionicons/lib/IosInformationCircleOutline";
import { withRouter } from "react-router-dom";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../commons/validators";
import { handleCreateAuthorizeNetConnection } from "../../../../remote_access/company/company";
import Divider from "../../../../commons/divider";

function ConnectAuthorizeNetForm(props) {
  const onSubmit = async values => {
    const response = await handleCreateAuthorizeNetConnection({
      data: values
    });

    if (response.ok) {
      alert(
        "Your Authorize.net transaction details have been successfully stored."
      );
      props.history.push("/" + props.company_id + "/business/applications");
    } else {
      console.log("error", response);
      return response;
    }
  };

  const alertMessage =
    "IMPORTANT: Be sure to record your Transaction Key immediately in a secure manner or copy it immediately to a file in a secure location as it is not always visible in the Merchant Interface like the API Login ID. Once you navigate away from the confirmation page there will be no other way to access the Transaction Key in the Merchant Interface. Creating a new Trasaction Key will make old ones ineffective after 24 hours, and will disrupt in transaction processing if not updated on this website.";

  return (
    <React.Fragment>
      <Alert variant="info">
        <Alert.Heading>
          <IosInformationCircleOutline
            className={"icon-info icon-lg icon-left"}
          />
          To fetch Authorize.Net Credentials.
        </Alert.Heading>
        <hr />
        <ol>
          <li>
            <strong>
              Log into{" "}
              <a href="https://account.authorize.net/">
                Authorize.Net Dashboard
              </a>
            </strong>{" "}
            with your username and password.
          </li>
          <li>
            Select Settings under <strong>Account</strong> in the main menu on
            the top (or left).
          </li>
          <li>
            Click <strong>API Credentials and Keys</strong> in the{" "}
            <strong>Security</strong> Settings section
          </li>
          <li>
            Enter the secret answer to the secret question you configured when
            you activated your user account (if prompted).
          </li>
          <li>Click Submit.</li>
          <li>
            The{" "}
            <i>
              Transaction Key{" "}
              <button onClick={() => alert(alertMessage)}>Note</button>
            </i>{" "}
            for your account is displayed on a confirmation page.
          </li>
          <li>
            For Client Key, go back to <strong>Account</strong> Page, and click{" "}
            <strong>Manage Public Client Key</strong>
          </li>
          <li>Click Submit.</li>
          <li>Enter the PIN code sent to your email.</li>
          <li>
            The Client Key for your account is displayed along with Client Key
            Last Obtained date and time.
          </li>
        </ol>
      </Alert>
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
            {submitError && (
              <Alert variant="danger">
                <div>{submitError}</div>
              </Alert>
            )}
            <div className="row">
              <div className="col-12">
                <Field name="api_login_id" validate={required}>
                  {({ input, meta }) => (
                    <TextInput label={"API Login ID"} meta={meta} {...input} />
                  )}
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Field name="client_key" validate={required}>
                  {({ input, meta }) => (
                    <TextInput label={"Client Key"} meta={meta} {...input} />
                  )}
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Field name="transaction_key" validate={required}>
                  {({ input, meta }) => (
                    <TextInput
                      label={"Transaction Key"}
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
                  block
                  disabled={submitting}
                  type={"submit"}
                  className={"with-spinner-right"}
                >
                  Connect with WhyUnified via Authorize.Net!
                  {submitting ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <IosArrowRoundForward
                      className={"icon-right icon-lg icon-default"}
                    />
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    company_id: state.account.company_id
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(ConnectAuthorizeNetForm)
);
