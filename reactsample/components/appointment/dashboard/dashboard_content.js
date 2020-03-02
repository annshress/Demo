/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import MyStockChart from "./chart";
import LiveInsight from "./LiveInsight";
import UpcomingBookings from "./UpcomingBookings";
import AllBookings from "./AllBookings";
import TodayBookings from "./TodayBookings";
import LatestBookings from "./LatestBookings";
import AppointmentFeeds from "./AppointmentFeeds";
import WidgetContent from "../../../commons/Widgets/WidgetContent";


function DashboardContent(props) {
  const [activeWidgets, setActiveWidgets] = useState({
    live_insight: {visible: false, url: ''},
    upcoming_bookings: {visible: false, url: ''},
    all_bookings: {visible: false, url: ''},
    today_bookings: {visible: false, url: ''},
    latest_bookings: {visible: false, url: ''},
    appointment_feeds: {visible: false, url: ''}
  });
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  const calculateColSizeUpcomingBooking = () =>{
    let colSize = '';
    let counter=0;

    if (activeWidgets.upcoming_bookings.visible){
      counter ++;
    }
    if (activeWidgets.all_bookings.visible){
      counter ++;
    }

    if (counter === 2) colSize ='6';
    if (counter === 1) colSize ='12';

    return colSize;
  };

  return (
    <React.Fragment>
      <div className="row">
        {/* <!---- Chart -----> */}
        <MyStockChart company={props.company_id} col={activeWidgets.live_insight.visible ? '8': '12'}/>

        {/* <!----Live Feeds-----> */}
        {activeWidgets.live_insight.visible &&
        <LiveInsight
          company_id={props.company_id}
          url={activeWidgets.live_insight.url}
        />
        }
      </div>
      <div className="row">
        <div className="col-8">
          <div className="row">
            {/* <!----Upcoming Bookings-----> */}
            {activeWidgets.upcoming_bookings.visible &&
            <UpcomingBookings
              company_id={props.company_id}
              url={activeWidgets.upcoming_bookings.url}
              colSize={calculateColSizeUpcomingBooking()}
            />
            }

            {/* <!----All Bookings-----> */}
            {activeWidgets.all_bookings.visible &&
            <AllBookings
              company_id={props.company_id}
              url={activeWidgets.all_bookings.url}
              colSize={calculateColSizeUpcomingBooking()}
            />
            }
          </div>
          <div className="row">
            {/* <!----Latest bookings-----> */}
            {activeWidgets.latest_bookings.visible &&
            <LatestBookings
              company_id={props.company_id}
              url={activeWidgets.latest_bookings.url}
            />
            }
          </div>
        </div>
        <div className="col-4">
          <div className="row">
            {/* <!----What's on today-----> */}
            {activeWidgets.today_bookings.visible &&
            <TodayBookings
              company_id={props.company_id}
              url={activeWidgets.today_bookings.url}
            />
            }
          </div>
        </div>
      </div>



      <div className="row">
        {/* <!----Feeds-----> */}
        {activeWidgets.appointment_feeds.visible &&
        <AppointmentFeeds
          company_id={props.company_id}
          url={activeWidgets.appointment_feeds.url}
        />
        }

        {/* <!----Add Widget-----> */}
        <div className="col-6">
          <WidgetContent
            type={'secondary'}
            appName={'appointment-scheduler'}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) =>{
  return{
    appointment_scheduler: state.widget.appointment_scheduler,
    activated_appointment_scheduler: state.widget.activated_appointment_scheduler
  }
};

export default connect(mapStateToProps,null)(DashboardContent);
