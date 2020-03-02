import React from "react";

import AuthenticationProtectedRoute from "../../utils/authenticationProtectedRoute";

import Applications from "./applications";
import GlobalFeeds from "./feeds";
import ManagePermissionGroups from "./permissions/manage_permissions";
import EditPermission from "./permissions/edit_permission";
import AddPermission from "./permissions/add_permission";
import Dashboard from "./dashboard";

const BusinessRoutes = (
  <div>
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
    <AuthenticationProtectedRoute
      exact
      path="/:company/business/feeds/"
      component={GlobalFeeds}
    />
    <AuthenticationProtectedRoute
      exact
      path="/:company/business/permissions/"
      component={ManagePermissionGroups}
    />
    <AuthenticationProtectedRoute
      exact
      path="/:company/business/permission/:id/"
      component={EditPermission}
    />
    <AuthenticationProtectedRoute
      exact
      path="/:company/business/permissions/add/"
      component={AddPermission}
    />
  </div>
);

export default BusinessRoutes;
