import React, { useState, useEffect } from "react";

import Header from "../../../layouts/header";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";
import NavBarAppointmentBooking from "../../NavBarAppointmentBooking";
import BookingOptionForm from "./bookingOptionForm";
import {
  handleGetOption,
  handleEditOption
} from "../../../../remote_access/appointment/options";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";
import {generateAndRemoveNotification} from "../../../../store/actionCreators";

function BookingOption(props) {
  const { company } = props.match.params;

  const onSubmit = async values => {
    const response = await handleEditOption({
      company_id: company,
      data: values
    });

    if (response.ok){
      generateAndRemoveNotification(201, "Booking options updated.");
    } else{
      return response.result;
    }
  };

  const [option, setOption] = useState({});

  useEffect(() => {
    const getOption = async () => {
      const response = await handleGetOption({ company_id: company });
      if (response.ok) {
        setOption(response.result);
      }
    };
    getOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Header title="Booking Options | Appointment Scheduler"/>
      <TopHeader/>
      <div className={'container-fluid'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'appointment-scheduler'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarAppointmentBooking company_id={company} />
            <PageTitle
              title="Booking Options"
              info="Here you can set some general options about the booking process."
            />
            <Content>
              <BookingOptionForm option={option} onSubmit={onSubmit} />
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BookingOption;
