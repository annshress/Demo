/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import Header from "../../layouts/header";
import TopHeader from "../../layouts/top_header";
import SideNav from "../../layouts/SideNav";
import Content from "../../layouts/content";
import DashboardContent from "./dashboardContent";

function Dashboard(props) {
  const { company } = props.match.params;

  return (
    <React.Fragment>
      <Header title="Dashboard | CRM" />
      <TopHeader />
      <div className={"container-fluid container-crm-dashboard"}>
        <div className={"row"}>
          <div className={"col-2 col-side-nav"}>
            <SideNav type={"business-application"} company={company} />
          </div>
          <div className={"col-10 col-main-content"}>
            <Content isBgWhite={false}>
              <DashboardContent company_id={company} />
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
