import React from "react";

import NavBar from "./navBar";
import LogoRss from "react-ionicons/lib/LogoRss";
import logoAppointmentScheduler from "../../../assets/img/app_logo_appointment.png";
import logoCrm from "../../../assets/img/app_logo_crm.png";
import logoShoppingCart from "../../../assets/img/app_logo_shopping.png";
import logoCloudPhone from "../../../assets/img/app_logo_cloud_phone.png";
import IosMore from "react-ionicons/lib/IosMore";

function NavBarFeeds(props) {
  const navElements = [
    {
      href: `/${props.company_id}/business/feeds/`,
      icon: LogoRss,
      title: "All Feeds"
    },
    {
      href: `/${props.company_id}/appointment/feeds/`,
      imgSrc: logoAppointmentScheduler,
      title: "Appointment Scheduler",
      appName: "appointment"
    },
    {
      href: `/${props.company_id}/crm/feeds/`,
      imgSrc: logoCrm,
      title: "CRM",
      appName: "crm"
    },
    {
      href: "#",
      imgSrc: logoShoppingCart,
      title: "Shopping Cart",
      appName: "shoppingcart"
    },
    {
      href: "#",
      imgSrc: logoAppointmentScheduler,
      title: "Newsletter",
      appName: "newsletter"
    },
    {
      href: "#",
      imgSrc: logoCloudPhone,
      title: "Cloud Phone",
      appName: "cloudphone"
    },
    {
      href: "#",
      imgSrc: logoAppointmentScheduler,
      title: "Team"
    },
    {
      href: "#",
      icon: IosMore,
      title: "",
      sub_menus: []
    }
  ];

  return (
    <NavBar navElements={navElements}/>
  );
}

export default NavBarFeeds;
