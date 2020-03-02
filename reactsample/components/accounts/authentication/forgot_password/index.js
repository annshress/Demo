import React from "react";
import {Link} from "react-router-dom";

import ForgotPasswordForm from "./forgotPasswordForm";
import { handleForgotPassword } from "../../../../remote_access/accounts/authentication";
import { generateAndRemoveNotification } from "../../../../store/actionCreators";
import { isAnonymous } from "../../../../store/utils";
import AccountLayout from "../../../layouts/account";
import UnifiedWorkplaceLogo from "../../../../assets/img/unified_workplace.png";
import Divider from "../../../../commons/divider";

// url format:
// http://localhost:9000/api/auth/password_reset/?token=alkjdsfkjsldf

function ForgotPassword(props) {
  const onSubmit = async values => {
    if (!isAnonymous()) {
      generateAndRemoveNotification(
        401,
        "Seems like you want to reset password instead!"
      );
    }

    const response = await handleForgotPassword({ data: values });

    if (response.ok) {
      generateAndRemoveNotification(201, "Email has been sent!");
    } else {
      return response;
    }
  };

  return (
    <AccountLayout>
      <React.Fragment>
        <div className="row row-logo">
          <div className="col-12">
            <img src={UnifiedWorkplaceLogo} alt="" />
          </div>
        </div>
        <div className="row">
          <Divider type={'blank'}/>
        </div>
        <div className="row">
          <div className="col-12">
            <h2>Forgot your password?</h2>
            <p>Please enter your email below, we will send an email with a link to reset your password.</p>
          </div>
        </div>
        <ForgotPasswordForm onSubmit={onSubmit}/>
        <div className="row">
          <Divider />
        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            Need an account? &nbsp;
            <Link to="/account/register" className={'wuwp-link primary'}>
              <strong>Join unified for free</strong>
            </Link>
          </div>
        </div>
      </React.Fragment>
    </AccountLayout>
  );
}

export default ForgotPassword;
