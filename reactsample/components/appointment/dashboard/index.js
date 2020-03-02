import React from "react";

import DashboardContent from "./dashboard_content";
import Header from "../../layouts/header";
import SideNav from "../../layouts/SideNav";
import NavBarAppointmentBooking from "../NavBarAppointmentBooking";
import Content from "../../layouts/content";
import TopHeader from "../../layouts/top_header";

import './style.scss';

function Dashboard(props) {
  const { company } = props.match.params;

  return (
    <React.Fragment>
      <Header title="Dashboard | Appointment Scheduler"/>
      <TopHeader/>
      <div className={'container-fluid container-appointment-dashboard'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'appointment-scheduler'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarAppointmentBooking company_id={company}/>
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
