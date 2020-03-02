import React, { useState, useEffect } from "react";

import './style.scss';

import Header from "../../../layouts/header";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";
import NavBarAppointmentBooking from "../../NavBarAppointmentBooking";
import NotificationContent from "./notificationContent";

import {
  handleGetOption,
  handleEditOption
} from "../../../../remote_access/appointment/options";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";
import {generateAndRemoveNotification} from "../../../../store/actionCreators";

function BookingNotification(props) {
  const { company } = props.match.params;

  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    async function getEmailTemplates() {
      const response = await handleGetOption({ company_id: company });
      if (response.ok) {
        setNotifications(response.result);
      }
    }
    getEmailTemplates();
  }, [company]);

  const onSubmit = async values => {
    const response = await handleEditOption({
      company_id: company,
      data: values
    });

    if (response.ok){
      generateAndRemoveNotification(201, "Booking Notifications updated.");
    } else{
      return response.result;
    }
  };

  return (
    <React.Fragment>
      <Header title="Booking Notifications | Appointment Scheduler"/>
      <TopHeader/>
      <div className={'container-fluid container-options-notifications'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'appointment-scheduler'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarAppointmentBooking company_id={company} />
            <PageTitle
              title="Booking Notifications"
              info="Email notifications will be sent to people who make a booking after the booking form is completed or/and payment is made. If you leave subject field blank no email will be sent."
            />
            <Content>
              <NotificationContent
                onSubmit={onSubmit}
                notifications={notifications}
              />
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BookingNotification;
