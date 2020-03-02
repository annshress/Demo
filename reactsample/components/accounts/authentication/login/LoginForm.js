import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import {Alert,Button,Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../commons/validators";
import Divider from "../../../../commons/divider";
import Notification from "../../../notification";


function LoginForm(props) {
  const { onSubmit } = props;

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
        <form onSubmit={handleSubmit} className={'employee_form'}>
          <Notification hasMarginLeftRight={false}/>
          <div className="row">
            <div className="col-12">
              {submitError &&
              <React.Fragment>
                <Alert variant="danger">
                  {submitError}
                </Alert>
              </React.Fragment>
              }
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="email" validate={required}>
                {({ input, meta }) => (
                  <TextInput
                    label="Email*"
                    placeholder="Email"
                    meta={meta}
                    {...input} />
                )}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Field name="password" validate={required}>
                {({ input, meta }) => (
                  <TextInput
                    label="Password*"
                    type="password"
                    placeholder="Password"
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
              <Button variant="primary" size={'lg'} block disabled={submitting} type={'submit'} className={'with-spinner-right'}>
                Login
                {submitting &&
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                }
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Divider type="blank" />
            </div>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <Link to="/account/forgot_password" className={'wuwp-link default'}>
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      )}
    />
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
