import React from "react";

import SideBarCard from "../../../layouts/sideBarCard";

import icon from "../../../../assets/img/frontend/time-icon.png";

function StatusInfo(props) {
  return (
    <SideBarCard title="365 Status">
      <div className="page_sidebar_container">
        <div className="content">
          <img src={icon} alt="" />
          <span>Agent Status</span>
          <select className="minimal-select el-right">
            <option selected>Online</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="content">
          <img src={icon} alt="" />
          <span>Mail</span>
          <select className="minimal-select el-right">
            <option selected>Online</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="content">
          <img src={icon} alt="" />
          <span>Chat</span>
          <select className="minimal-select el-right">
            <option selected>Online</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="content">
          <img src={icon} alt="" />
          <span>Phone</span>
          <select className="minimal-select el-right" defaultValue={'Online'}>
            <option value={'Online'}>Online</option>
            <option value={'Offline'}>Offline</option>
          </select>
        </div>
      </div>
    </SideBarCard>
  );
}

export default StatusInfo;
