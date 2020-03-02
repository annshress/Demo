/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import UserInfo from "./userInfo";
import StatusInfo from "./statusInfo";
import EmployeeInfo from "./employeeInfo";
import { Link } from "react-router-dom";

import SideBarCard from "../../../layouts/sideBarCard";
import { handleListEmployees } from "../../../../remote_access/business/employees";

function UserPanel(props) {

  const [employees, setEmployees] = React.useState([]);

  React.useEffect(() => {
    const getEmployees = async () => {
      const response = await handleListEmployees({
        company_id: props.company_id
      });
      if (response.ok) {
        setEmployees(response.result);
      } else {
        console.log(response);
      }
    };
    getEmployees();
  }, []);

  return (
    <div className="page_sidebar">
      <UserInfo/>
      <br />
      <div>
        <Link to="/business_account">Account Settings</Link>
        <br />
        <Link to="/add_employee">Add Employees</Link>
      </div>
      <div>
        <SideBarCard />
      </div>
      <div>Notification Info</div>
      <StatusInfo />
      <EmployeeInfo employees={employees} />
      <div>Email Insights</div>
      <div>Website Visitors</div>
    </div>
  );
}

export default UserPanel;
