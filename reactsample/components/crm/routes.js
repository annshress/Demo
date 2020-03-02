import React from "react";

import ManageCRMAccounts from "./accounts/manage_accounts";
import AddCRMAccount from "./accounts/add_account";
import EditCRMAccount from "./accounts/edit_account";
import ManageCRMContacts from "./contacts/manage_contacts";
import AddCRMContact from "./contacts/add_contact";
import EditCRMContact from "./contacts/edit_contact";
import ManageCRMCases from "./cases/manage_cases";
import AddCRMCase from "./cases/add_case";
import EditCRMCase from "./cases/edit_case";
import Dashboard from "./dashboard";
import AddCRMLead from "./leads/add_lead";
import ManageCRMLeads from "./leads/manage_lead/index";
import EditCRMLead from "./leads/edit_lead/index";
import AddCRMopportunity from "./opportunities/add_opportunity";
import ManageCRMopportunities from "./opportunities/manage_opportunity/index";
import EditCRMopportunity from "./opportunities/edit_opportunity/index";
import Feeds from "./feeds";

import AuthenticationProtectedRoute from "../../utils/authenticationProtectedRoute";

const CRMRoutes = (
  <div>
    <AuthenticationProtectedRoute exact path="/:company/crm/" component={Dashboard} />
    <AuthenticationProtectedRoute exact path="/:company/crm/accounts/" component={ManageCRMAccounts} />
    ////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


    <AuthenticationProtectedRoute exact path="/:company/crm/cases/" component={ManageCRMCases} />
    <AuthenticationProtectedRoute exact path="/:company/crm/add-case/" component={AddCRMCase} />
    <AuthenticationProtectedRoute exact path="/:company/crm/cases/:id/" component={EditCRMCase} />
    <AuthenticationProtectedRoute
      exact
      path="/:company/crm/feeds/"
      component={Feeds}
    />
  </div>
);

export default CRMRoutes;
