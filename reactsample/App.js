import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NotFound from "./components/NotFound";
import AddService from "./components/appointment/service/add_service";

import { employeeStatus } from "./store/actionCreators";

import "./assets/scss/bootstrap_custom.scss";
import "./assets/css/frontend_style.css";
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
import Company from "./components/company/register";
import SubscribePayPlan from "./components/company/register/subscribePayPlan";
import RegisterPayPlan from "./components/company/register/registerPayPlan";
import StripeResult from "./components/company/register/payplan_forms/stripeResult";

import CrmDashboard from "./components/crm/dashboard";
import ManageCRMAccounts from "./components/crm/accounts/manage_accounts";
import AddCRMAccount from "./components/crm/accounts/add_account";
import EditCRMAccount from "./components/crm/accounts/edit_account";
import AddCRMLead from "./components/crm/leads/add_lead";
import ManageCRMLeads from "./components/crm/leads/manage_lead";
import EditCRMLead from "./components/crm/leads/edit_lead";
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
import EditCRMCase from "./components/crm/cases/edit_case";
import Feeds from "./components/crm/feeds";

import { SERVER_URL } from "./remote_access";
import SetupTwoFactor from "./components/accounts/authentication/mfa_token/setup";

// const browserHistory = createBrowserHistory();

var onlineStatusSocket;

class App extends Component {
  toggleSocket() {
    var TOKEN = this.props.token || "";

    if (!TOKEN) {
      if (onlineStatusSocket) {
        onlineStatusSocket.close();
      }
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    onlineStatusSocket = new WebSocket(
      `${protocol}://${SERVER_URL}/employee/status/`,
      TOKEN
    );

    onlineStatusSocket.onopen = function(e) {};

    onlineStatusSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      const online = data["online"];
      const id = data["id"];
      employeeStatus({ id, online });
    };

    onlineStatusSocket.onerror = function(e) {
      console.error("Socket closed unexpectedly");
    };
  }

  componentDidMount() {
    this.toggleSocket();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.token !== prevProps.token) {
      this.toggleSocket();
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          {/*Todo: Build these routes dynamically by running a loop*/}
          {/*Business Routes*/}
          <AuthenticationProtectedRoute
            exact
            path="/:company/business/"
            component={Dashboard}
          />
          <AuthenticationProtectedRoute
            exact
            path="/:company/business/applications/"
            component={Applications}
          />
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

          <AuthenticationProtectedRoute
            path="/:company/appointment/add-service"
            component={AddService}
          />
          <AuthenticationProtectedRoute
            path="/:company/appointment/options/booking"
            component={BookingOption}
          />
          <AuthenticationProtectedRoute
            path="/:company/appointment/options/terms"
            component={BookingTerms}
          />
          <AuthenticationProtectedRoute
            path="/:company/appointment/options/notification"
            component={BookingNotification}
          />
          <AuthenticationProtectedRoute
            path="/:company/appointment/employeereport"
            component={ManageEmployeeReport}
          />
          <AuthenticationProtectedRoute
            path="/:company/appointment/servicereport"
            component={ManagerServiceReport}
          />

          {/*Account Routes*/}
          <AuthenticationProtectedRoute exact path="/" component={HomePage} />
          <Route exact path="/account/login" component={Login} />
          <Route exact path="/account/register" component={Register} />
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////
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

          {/*Company Account Routes*/}
          <AuthenticationProtectedRoute
            exact
            path="/company/register"
            component={Company}
          />
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

          {/*CRM Routes*/}
          <AuthenticationProtectedRoute exact path="/:company/crm/" component={CrmDashboard} />
          <AuthenticationProtectedRoute exact path="/:company/crm/accounts/" component={ManageCRMAccounts} />
          <AuthenticationProtectedRoute exact path="/:company/crm/add-account" component={AddCRMAccount} />
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

          <AuthenticationProtectedRoute exact path="/:company/crm/add-case/" component={AddCRMCase} />
          <AuthenticationProtectedRoute exact path="/:company/crm/cases/:id/" component={EditCRMCase} />
          <AuthenticationProtectedRoute
            exact
            path="/:company/crm/feeds/"
            component={Feeds}
          />

          <AuthenticationProtectedRoute
            exact
            path="/:company/appointment/book/"
            component={AppointmentBooking}
          />

          {/*Other Routes*/}
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.account.token
  };
};

export default connect(mapStateToProps)(App);
