import React from "react";
import { Form, Field } from "react-final-form";
import { Alert, Button, Spinner } from "react-bootstrap";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../commons/validators";
import Divider from "../../../../commons/divider";
import Notification from "../../../notification";

import {
  requestQRCodeAuthentication,
  verifyQRCodeAuthentication
} from "../../../../remote_access/accounts/two_factor_auth";
import { APICaller } from "../../../../remote_access";

function SetupQRCode(props) {
  const { setTwoFactorAuth, handleCloseTwoFactorAuth } = props;

  const [qrResponse, setqrResponse] = React.useState(null);

  const onSubmit = async values => {
    const response = await verifyQRCodeAuthentication(values);
    if (response.ok) {
      alert("Two factor authentication has been enabled.");
      handleCloseTwoFactorAuth();
    } else {
      return response;
    }
  };

  const onQRCodeRequest = async () => {
    let qrcode_url;
    const response = await requestQRCodeAuthentication();
    if (response.ok) {
      qrcode_url = response.result.qrcode_url;
    } else {
      return response;
    }
    const qrcodeResponse = await APICaller({
      method: "GET",
      url: qrcode_url
    });
    if (qrcodeResponse.ok) {
      setqrResponse(qrcodeResponse.result);
      setTwoFactorAuth(true);
    }
  };

  function qrDisplayComponent() {
    if (qrResponse) {
      return { __html: qrResponse };
    } else {
      return (
        <Button
          variant="primary"
          size={"lg"}
          block
          onClick={() => onQRCodeRequest()}
        >
          Request QR Code
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      <strong>Setup QR Code Authentication.</strong>
      <br />
      Use an app like Google Authenticator to scan the QR code below.
      {qrResponse ? (
        <div dangerouslySetInnerHTML={qrDisplayComponent()} />
      ) : (
        <div>{qrDisplayComponent()}</div>
      )}
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
                <Field name="mfa_code" validate={required}>
                  {({ input, meta }) => (
                    <TextInput
                      label="Code*"
                      placeholder="123456"
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
                  disabled={submitting || !qrResponse}
                  type={"submit"}
                  className={"with-spinner-right"}
                >
                  Submit
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
  );
}

export default SetupQRCode;
