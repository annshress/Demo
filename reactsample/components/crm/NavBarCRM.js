import React from "react";
import IosSpeedometerOutline from 'react-ionicons/lib/IosSpeedometerOutline';
import IosPeopleOutline from 'react-ionicons/lib/IosPeopleOutline';
import IosContactsOutline from 'react-ionicons/lib/IosContactsOutline';
import IosPersonAddOutline from 'react-ionicons/lib/IosPersonAddOutline';
import IosBodyOutline from 'react-ionicons/lib/IosBodyOutline';
import IosPaperOutline from 'react-ionicons/lib/IosPaperOutline';
import LogoRss from 'react-ionicons/lib/LogoRss';

import NavBar from "../layouts/navbar";
import logoFull from "../../assets/img/CRM_Icon.png";
import IosMore from "react-ionicons/lib/IosMore";

export default function NavBarCRM(props) {
  const navElements = [
    {
      href: `/${props.company_id}/crm/`,
      icon: IosSpeedometerOutline,
      title: "Dashboard"
    },
    { href: `/${props.company_id}/crm/feeds/`, icon: LogoRss, title: "Feeds" },
    {
      href: `/${props.company_id}/crm/accounts/`,
      icon: IosContactsOutline,
      title: "Accounts"
    },
    {
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  ];

  return(
    <NavBar
      navElements={navElements}
      logoFull={logoFull}
      type={'crm'}
    />
  );
}
