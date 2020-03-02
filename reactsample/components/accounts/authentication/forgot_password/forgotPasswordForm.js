import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";

import TextInput from "../../../../commons/form_fields/textInput";
import { required } from "../../../../utils/validators";
import Divider from "../../../../commons/divider";
import {Alert, Button, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import Notification from "../../../notification";

function ForgotPasswordForm(props) {
  const { onSubmit} = props;

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
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

            <div className="col-12 d-flex justify-content-center">
              <Link to="/account/login" className={'wuwp-link default'}>
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      )}
    />
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ForgotPasswordForm;
