import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import { Alert, Button, Spinner } from "react-bootstrap";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../commons/validators";
import Divider from "../../../../commons/divider";
import Notification from "../../../notification";

function TokenForm(props) {
  const { onSubmit } = props;

  const [state, setState] = React.useState({ backup: false });

  return (
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
          {!state.backup ? (
            <React.Fragment>
              <div className="row">
                <div className="col-12">
                  <Field name="mfa_code" validate={required}>
                    {({ input, meta }) => (
                      <TextInput
                        label="Token*"
                        placeholder="1 2 3 4 5 6"
                        meta={meta}
                        {...input}
                      />
                    )}
                  </Field>
                </div>
              </div>
              <span
                onClick={() => setState({ backup: true })}
                style={{ cursor: "pointer" }}
              >
                <u>Use Backup Code instead</u>
              </span>
            </React.Fragment>
          ) : (
            <div className="row">
              <div className="col-12">
                <Field name="backup_code" validate={required}>
                  {({ input, meta }) => (
                    <TextInput
                      label="Backup Code*"
                      placeholder="123123123123"
                      meta={meta}
                      {...input}
                    />
                  )}
                </Field>
              </div>
            </div>
          )}
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
  );
}

export default TokenForm;
