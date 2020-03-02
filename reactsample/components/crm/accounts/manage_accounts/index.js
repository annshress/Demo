import React from "react";
import Content from "../../../layouts/content";

import ManageCRMAccountsContent from "./manageCRMAccountsContent";
import Header from "../../../layouts/header";
import NavBarCRM from "../../NavBarCRM";
import PageTitle from "../../../layouts/page_title";
import { handleDeleteCRMAccount } from "../../../../remote_access/crm/accounts";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";

function ManageCRMAccounts(props) {
  const { company } = props.match.params;

  const deletionHandler = async (e,instance_id) => {
    e.preventDefault();

    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete?")) {
      return;
    }

    const response = await handleDeleteCRMAccount({
      company_id: company,
      instance_id: instance_id
    });
    return response.ok;
  };

  return (
    <React.Fragment>
      <Header title="Accounts | CRM" />
      <TopHeader/>
      <div className={'container-fluid'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'crm'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarCRM company_id={company} />
            <PageTitle title="Accounts" info="..." />
            <Content>
              <ManageCRMAccountsContent
                deletionHandler={deletionHandler}
                company_id={company}
              />
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ManageCRMAccounts;
