import React from "react";

import Company from "../register/index";
import RegisterPayPlan from "../register/registerPayPlan";
import StripeResult from "../register/payplan_forms/stripeResult";
import SubscribePayPlan from "../register/subscribePayPlan";

import AuthenticationProtectedRoute from "../../../utils/authenticationProtectedRoute";

const CompanyRoutes = (
  <div>
    <AuthenticationProtectedRoute
      exact
      path="/company/register"
      component={Company}
    />
    <AuthenticationProtectedRoute
      exact
      path="/company/register/subscribe/"
      component={SubscribePayPlan}
    />
    <AuthenticationProtectedRoute
      exact
      path="/company/register/payplan/"
      component={RegisterPayPlan}
    />
    <AuthenticationProtectedRoute
      exact
      path="/company/register/payplan/stripe/"
      component={StripeResult}
    />
  </div>
);

export default CompanyRoutes;
