import React, { useState, useEffect } from "react";

import "./style.scss";
import AccountForm from "./accountForm";

import Header from "../../../layouts/header";
import NavBarCRM from "../../NavBarCRM";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";

import { handleGetCRMContacts } from "../../../../remote_access/crm/contacts";
import { handleGetCRMleads } from "../../../../remote_access/crm/leads";
import { handleAddCRMAccount } from "../../../../remote_access/crm/accounts";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";

function AddCRMAccount(props) {
  const { company } = props.match.params;

  const [options, setOptions] = useState({
    contactOptions: [],
    leadOptions: []
  });

  const onSubmit = async values => {
    const response = await handleAddCRMAccount({
      company_id: company,
      data: values
    });
    if (response.ok) {
      // redirect to list page
      props.history.push(`/${company}/crm/accounts`);
    } else {
      return response;
    }
  };

  const onCancel = () => {
    props.history.push(`/${company}/crm/accounts`);
  };

  useEffect(() => {
    const getOptions = async () => {
      let contactResults = await handleGetCRMContacts({ company_id: company });
      let leadResults = await handleGetCRMleads({ company_id: company });
      console.log(leadResults.result);
      if (contactResults.ok && leadResults.ok) {
        setOptions(old => {
          return {
            ...old,
            contactOptions: contactResults.result.map(each => {
              return { value: each.id, label: each.name };
            }),
            leadOptions: leadResults.result.map(each => {
              return {
                value: each.id,
                label: each.first_name + " " + each.last_name
              };
            })
          };
        });
      }
    };
    getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Header title="Account | CRM" />
      <TopHeader/>
      <div className={'container-fluid'}>
        <div className={'row'}>
          <div className={'col-2 col-side-nav'}>
            <SideNav type={'crm'} company={company}/>
          </div>
          <div className={'col-10 col-main-content'}>
            <NavBarCRM company_id={company}/>
            <PageTitle title="Add Account" info="..." />
            <Content>
              <AccountForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                options={options}
              />
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AddCRMAccount;
