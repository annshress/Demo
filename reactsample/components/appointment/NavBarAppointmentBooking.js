import React from "react";
import IosSpeedometerOutline from 'react-ionicons/lib/IosSpeedometerOutline';
import LogoRss from 'react-ionicons/lib/LogoRss';
import IosCalendarOutline from 'react-ionicons/lib/IosCalendarOutline';
import MdCalendar from 'react-ionicons/lib/MdCalendar';
import IosListBoxOutline from 'react-ionicons/lib/IosListBoxOutline';
import IosContactsOutline from 'react-ionicons/lib/IosContactsOutline';
import IosPaperOutline from 'react-ionicons/lib/IosPaperOutline';
import IosConstructOutline from 'react-ionicons/lib/IosConstructOutline';
import IosDocumentOutline from 'react-ionicons/lib/IosDocumentOutline';
import IosNotificationsOutline from 'react-ionicons/lib/IosNotificationsOutline';
import IosTimeOutline from 'react-ionicons/lib/IosTimeOutline';
import IosMore from 'react-ionicons/lib/IosMore';

import NavBar from "../layouts/navbar";
import logoFull from "../../assets/img/ap_logo_full.png";

export default function NavBarAppointmentBooking(props) {
  const navElements = [
    {
      href: `/${props.company_id}/appointment/`,
      icon: IosSpeedometerOutline,
      title: "Dashboard"
    },
    {
      href: `/${props.company_id}/appointment/feeds`,
      icon: LogoRss,
      title: "Feeds"
    },
    {
      href: `/${props.company_id}/appointment/manageschedule`,
      icon: MdCalendar,
      title: "Schedule"
    },
    {
      href: `/${props.company_id}/appointment/managebooking`,
      icon: IosListBoxOutline,
      title: "Booking"
    },
    {
      href: `/${props.company_id}/appointment/manageservices`,
      icon: IosCalendarOutline,
      title: "Services"
    },
    {
      href: `/${props.company_id}/appointment/manageemployees`,
      icon: IosContactsOutline,
      title: "Employees"
    },
    {
      href: "#",
      icon: IosPaperOutline,
      title: "Reports",
      sub_menus: [
        {
          href: `/${props.company_id}/appointment/employeereport`,
          icon: IosContactsOutline,
          alt: "",
          title: "Employee Reports"
        },
        {
          href: `/${props.company_id}/appointment/servicereport`,
          icon: IosCalendarOutline,
          alt: "",
          title: "Service Reports"
        }
      ]
    },
    {
      href: "#",
      icon: IosConstructOutline,
      title: "Options",
      sub_menus: [
        {
          href: `/${props.company_id}/appointment/options/booking`,
          icon: IosListBoxOutline,
          alt: "",
          title: "Booking"
        },
        {
          href: `/${props.company_id}/appointment/options/terms`,
          icon: IosDocumentOutline,
          alt: "",
          title: "Terms"
        },
        {
          href: `/${props.company_id}/appointment/options/notification`,
          icon: IosNotificationsOutline,
          alt: "",
          title: "Notifications"
        },
        {
          href: `/${props.company_id}/appointment/manage-working-time`,
          icon: IosTimeOutline,
          alt: "",
          title: "Working Time"
        }
      ]
    },
    {
      href: "#",
      icon: IosMore,
      title: "",
      sub_menus: []
    }
  ];

  return (
    <NavBar
      navElements={navElements}
      logoFull={logoFull}
      type={'appointment-scheduler'}
    />
  );
}
