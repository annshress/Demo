import React from "react";
import { Route } from "react-router-dom";

import Login from "./authentication/login";
import Register from "./authentication/register";
import ForgotPassword from "./authentication/forgot_password";
import ResetPassword from "./authentication/reset_password";
import ChangePassword from "./authentication/change_password";
import SecurityAnswer from "./authentication/security_question/answer";
import BusinessAccount from "./business_account/index";

import AuthenticationProtectedRoute from "../../utils/authenticationProtectedRoute";
import RefreshToken from "./authentication/RefreshToken";
import HomePage from "./commons";

const AccountRoutes = (
  <div>
    <AuthenticationProtectedRoute exact path="/" component={HomePage} />
    <Route exact path="/account/login" component={Login} />
    <Route exact path="/account/register" component={Register} />
    <Route exact path="/account/forgot_password" component={ForgotPassword} />
    <Route exact path="/account/reset_password" component={ResetPassword} />
    <Route exact path="/account/securityquestion" component={SecurityAnswer} />
    <AuthenticationProtectedRoute
      exact
      path="/account/change_password"
      component={ChangePassword}
    />
    <AuthenticationProtectedRoute
      exact
      path="/:company/business/settings"
      component={BusinessAccount}
    />
    <AuthenticationProtectedRoute
      exact
      path="/refresh_token"
      component={RefreshToken}
    />
    <AuthenticationProtectedRoute
      exact
      path="/:company/security_question"
      component={SecurityAnswer}
    />
  </div>
);

export default AccountRoutes;
