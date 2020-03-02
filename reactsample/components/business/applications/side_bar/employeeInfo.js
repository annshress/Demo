import React from "react";

import SideBarCard from "../../../layouts/sideBarCard";

function EmployeeInfo(props) {
  let { employees } = props;

  employees = employees || [];

  return (
    <SideBarCard title="Employees Activity">
      <div className="page_sidebar_container">
        {employees.map((employee,index) => (
          <div className="content" key={index}>
            <div className="row">
              <div className="col-3">
                <img src={employee.avatar} alt="" />
              </div>
              <div className="col-9">
                <div>{employee.full_name}</div>
                <div>Activity unavailable</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SideBarCard>
  );
}

export default EmployeeInfo;
