/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import ManagePermissionsContent from "./managePermissionsContent";
import Content from "../../../layouts/content";

import { handleFetchPermissionGroups } from "../../../../remote_access/business/permissions";
import Header from "../../../layouts/header";

function ManagePermissionGroups(props) {
  const { company } = props.match.params;

  // const [state, setState] = React.useState([]);

  const getCompanyPermGroups = async ({ ...params }) => {
    const response = await handleFetchPermissionGroups({
      company_id: company,
      ...params
    });
    return response;
  };

  const deletionHandler = async () => {};

  return (
    <React.Fragment>
      <Header title="Permissions Management" />
      {/* <NavBarCRM company_id={company} /> */}
      <Content>
        <ManagePermissionsContent
          getCompanyPermGroups={getCompanyPermGroups}
          deletionHandler={deletionHandler}
          company_id={company}
        />
      </Content>
    </React.Fragment>
  );
}

export default ManagePermissionGroups;
