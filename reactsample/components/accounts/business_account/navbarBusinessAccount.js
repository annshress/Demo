import React from "react";
import IosSettingsOutline from "react-ionicons/lib/IosSettingsOutline";
import IosSpeedometerOutline from "react-ionicons/lib/IosSpeedometerOutline";
import LogoRss from "react-ionicons/lib/LogoRss";

import NavBar from "../../layouts/navbar";
import logoFull from "../../../assets/img/ap_logo_full.businessaccount.png";
import IosMore from "react-ionicons/lib/IosMore";

export default function NavBarBusinessAccount(props) {
  const navElements = [
    {
      href: `/${props.company_id}/business/`,
      icon: IosSpeedometerOutline,
      title: "Dashboard"
    },
    {
      href: `/${props.company_id}/business/feeds/`,
      icon: LogoRss,
      title: "Feeds"
    },
    {
      href: `/${props.company_id}/business/settings/`,
      icon: IosSettingsOutline,
      title: "Settings"
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
      type={"business-application"}
    />
  );
}
