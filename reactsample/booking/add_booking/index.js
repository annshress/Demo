import React, { Component } from "react";

import './style.scss';

import Header from "../../../layouts/header";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";
import AddBookingContent from "./AddBookingContent";
import NavBarAppointmentBooking from "../../NavBarAppointmentBooking";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";

class AddBooking extends Component {
  render = () => {
    const company_id = this.props.match.params.company;

    return (
      <React.Fragment>
        <Header title="Add Booking | Appointment Scheduler"/>
        <TopHeader/>
        <div className={'container-fluid container-add-booking'}>
          <div className={'row'}>
            <div className={'col-2 col-side-nav'}>
              <SideNav type={'appointment-scheduler'} company={company_id}/>
            </div>
            <div className={'col-10 col-main-content'}>
              <NavBarAppointmentBooking company_id={company_id} />
              <PageTitle />
              <Content isBgWhite={false}>
                <AddBookingContent company_id={company_id} />
              </Content>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
}

AddBooking.propTypes = {};

export default AddBooking;
