import React from "react";
import { connect } from "react-redux";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-number-input";

import TextInput from "../../../commons/form_fields/textInput";
import { required } from "../../../commons/validators";
import Divider from "../../../commons/divider";
import TextArea from "../../../commons/form_fields/textArea";
import Notification from "../../notification";
import { Alert, Button, Spinner } from "react-bootstrap";
import { ACCOUNT_LOGOUT } from "../../../store/actionTypes";

import "react-phone-number-input/style.css";

function CompanyRegisterForm(props) {
  const { onSubmit, logout } = props;
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

          </div>
          <div className="row">
            <div className="col-12">
              <Field name="reg_number" validate={required}>
                {({ input, meta }) => (
                  <TextInput
                    label="Registration Number"
                    placeholder="Registration Number"
                    meta={meta}
                    {...input}
                  />
                )}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="office_contact" validate={required}>
                {({ input, meta }) => (
                  <div className="form-fields">
                    <PhoneInput
                      country="US"
                      placeholder="Office Contact"
                      inputClassName="form-control"
                      meta={meta}
                      {...input}
                    />
                  </div>
                )}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="location" validate={required}>
                {({ input, meta }) => (
                  <TextInput
                    label="Location"
                    placeholder="Location"
                    meta={meta}
                    {...input}
                  />
                )}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="address" validate={required}>
                {({ input, meta }) => (
                  <TextInput
                    label="Address"
                    placeholder="Address"
                    meta={meta}
                    {...input}
                  />
                )}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="description" validate={required}>
                {({ input, meta }) => (
                  <TextArea
                    label="Description"
                    placeholder="Description"
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
                Register Company
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
          <div className="row">
            <Divider type="blank" />
            You can always come back later. {"  "}
            <a href="#" onClick={() => logout()}>
              Logout
            </a>
          </div>
        </form>
      )}
    />
  );
}

CompanyRegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: ACCOUNT_LOGOUT })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CompanyRegisterForm);
