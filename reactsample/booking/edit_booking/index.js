import React, { Component } from "react";

import Header from "../../../layouts/header";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";
import EditBookingContent from "./EditBookingContent";
import NavBarAppointmentBooking from "../../NavBarAppointmentBooking";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";

class EditBooking extends Component {
  render() {
    const { match } = this.props;
    const instance_id = match.params.id;
    const company_id = match.params.company;

    return (
      <React.Fragment>
        <Header title="Edit Booking | Appointment Scheduler"/>
        <TopHeader/>
        <div className={'container-fluid container-add-booking'}>
          <div className={'row'}>
            <div className={'col-2 col-side-nav'}>
              <SideNav type={'appointment-scheduler'} company={company_id}/>
            </div>
            <div className={'col-10 col-main-content'}>
              <NavBarAppointmentBooking company_id={company_id} />
              <PageTitle
                title="Edit Booking"
                info="Use form below to update booking details."
              />
              <Content isBgWhite={false}>
                <EditBookingContent
                  company_id={company_id}
                  instance_id={instance_id}
                />
              </Content>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditBooking;
