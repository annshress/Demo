import React from "react";

import AccountRoutes from "../components/accounts/routes";
import AppointmentRoutes from "../components/appointment/route/common";
import CRMRoutes from "../components/crm/routes";
import BusinessRoutes from "../components/business/routes";
import CompanyRoutes from "../components/company/route/common";
import DashboardRoutes from "../components/dashboard/route/common";

const Routes = (
  <div>
    {BusinessRoutes}
    {DashboardRoutes}
    {AppointmentRoutes}
    {AccountRoutes}
    {CompanyRoutes}
    {CRMRoutes}
  </div>
);

export default Routes;
