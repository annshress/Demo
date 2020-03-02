import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import IosNotificationsOutline from "react-ionicons/lib/IosNotificationsOutline";
import IosMailOutline from "react-ionicons/lib/IosMailOutline";
import IosSettingsOutline from "react-ionicons/lib/IosSettingsOutline";
import IosMenuOutline from "react-ionicons/lib/IosMenuOutline";
import IosContactOutline from "react-ionicons/lib/IosContactOutline";
import IosChatboxesOutline from "react-ionicons/lib/IosChatboxesOutline";
import IosCallOutline from "react-ionicons/lib/IosCallOutline";
import { NavLink } from "react-router-dom";

import "./side-nav.scss";
import SwitchInput, {
  switchType
} from "../../commons/form_fields/switch_input/SwitchInput";

import appointmentSchedulerLogo from "../../assets/img/ap_logo_full.png";
import crmLogo from "../../assets/img/CRM_Icon.png";
import WidgetContent from "../../commons/Widgets/WidgetContent";
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

      <div className={"container-fluid container-agent-status"}>
        <div className={"row"}>
          <div className={"col-3"}>
            <IosContactOutline className={"icons icon-lg"} />
          </div>
          <div className={"col-5 col-text"}>
            <span>Agent Status</span>
          </div>
          <div className={"col-3 col-toggle"} title="Coming Soon">
            <SwitchInput
              checked={agentChecked}
              handleChange={handleAgentChange}
              height={20}
              width={48}
              switchType={switchType.YES_NO}
            />
          </div>
        </div>
      </div>
      <div className={"container-fluid container-mail"}>
        <div className={"row row-mail"}>
          <div className={"col-3"}>
            <IosMailOutline className={"icons icon-lg"} />
          </div>
          <div className={"col-3"}>
            <span>Mail</span>
          </div>
          <div className={"col-6"}>
            <DropDownComingSoon />
          </div>
        </div>
        <div className={"row row-mail"}>
          <div className={"col-3"}>
            <IosChatboxesOutline className={"icons icon-lg"} />
          </div>
          <div className={"col-3"}>
            <span>Chat</span>
          </div>
          <div className={"col-6"}>
            <DropDownComingSoon />
          </div>
        </div>
        <div className={"row row-mail"}>
          <div className={"col-3"}>
            <IosCallOutline className={"icons icon-lg"} />
          </div>
          <div className={"col-3"}>
            <span>Phone</span>
          </div>
          <div className={"col-6"}>
            <DropDownComingSoon />
          </div>
        </div>
      </div>
      <WidgetContent type={"primary"} appName={props.type} />
    </div>
  );
};

export default SideNav;
