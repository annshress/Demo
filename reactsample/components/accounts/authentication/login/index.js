import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import UnifiedWorkplaceLogo from "../../../../assets/img/unified_workplace.png";
import LoginForm from "./LoginForm";
import AccountLayout from "../../../layouts/account";

import { handleLogin } from "../../../../remote_access/accounts/authentication";
import { handleGetUserDetails } from "../../../../remote_access/accounts/business_account";
import { userDetails } from "../../../../store/actionCreators";
import { isAuthenticated } from "../../../../store/utils";
import Divider from "../../../../commons/divider";
import { ACCOUNT_LOGIN } from "../../../../store/actionTypes";
import GoogleLoginButton from "../../../../commons/auth/googleLogin";
import MicrosoftLoginButton from "../../../../commons/auth/microsoftLogin";
import TokenForm from "../mfa_token/mfaTokenForm";

function Login(props) {
  let applicationPath = "/company/register";
  if (isAuthenticated()) {
    if (props.user.company_id) {
      applicationPath = `/${props.user.company_id}/business/`;
    }
  }

////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

    const response = await handleLogin({ data: { ...state, ...values } });

    if (response.ok) {
      if (!response.result.token && response.result.mfa_required) {
        setState(old => {
          return {
            ...old,
            mfa_required: true,
            mfa_type: response.result.mfa_type
          };
        });
      }
      props.login(response.result);

      const responseUserDetails = await handleGetUserDetails(
        response.result.token
      );
      if (responseUserDetails.ok) {
        userDetails({ ...responseUserDetails.result });
      } else {
        console.log(responseUserDetails);
      }
    } else {
      return response;
    }
  };

  return (
    <AccountLayout>
      {!isAuthenticated() ? (
        <React.Fragment>
          <div className="row row-logo">
            <div className="col-12">
              <img src={UnifiedWorkplaceLogo} alt="" />
            </div>
          </div>
          <div className="row">
            <Divider type={"blank"} />
          </div>
          <div className="row">
            <div className="col-12">
              <h2>Welcome back.</h2>
              {state.mfa_required ? (
                <p>
                  You have activated 2-factor authentication. Please provide
                  your token obtained through
                  <strong>
                    {state.mfa_type === "qrcode"
                      ? " Authenticator application"
                      : " SMS"}
                  </strong>
                  .
                </p>
              ) : (
                <p>
                  Sign in to request for services from various workplace
                  businesses.
                </p>
              )}
            </div>
          </div>
          {state.mfa_required ? (
            <TokenForm onSubmit={onSubmit} />
          ) : (
            <LoginForm onSubmit={onSubmit} />
          )}
          <div className="row">
            <Divider />
          </div>
          <p>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <GoogleLoginButton></GoogleLoginButton>
              </div>
            </div>
          </p>
          <p>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <MicrosoftLoginButton></MicrosoftLoginButton>
              </div>
            </div>
          </p>
          <div className="row">
            <Divider />
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              Need an account? &nbsp;
              <Link to="/account/register" className={"wuwp-link primary"}>
                <strong>Join unified for free</strong>
              </Link>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <Redirect to={redirectPath} />
      )}
    </AccountLayout>
  );
}

const mapStateToProps = state => {
  return {
    user: state.account
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: data => dispatch({ type: ACCOUNT_LOGIN, payload: data })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
