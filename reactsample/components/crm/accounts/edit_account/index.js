import React, { useState, useEffect } from "react";

import AccountForm from "../add_account/accountForm";

import CommentSection from "../../extras/comments/comment_section";
import AttachmentSection from "../../extras/attachments/attachment_section";
import ListRelated from "../../commons/listRelated";

import Header from "../../../layouts/header";
import NavBarCRM from "../../NavBarCRM";
import PageTitle from "../../../layouts/page_title";
import Content from "../../../layouts/content";

import { handleGetCRMContacts } from "../../../../remote_access/crm/contacts";
import { handleGetCRMleads } from "../../../../remote_access/crm/leads";
import {
  handleGetCRMAccount,
  handleEditCRMAccount
} from "../../../../remote_access/crm/accounts";
import {
  handleAddCRMComment,
  handleAddCRMAttachment
} from "../../../../remote_access/crm/extra";
import { handleGetCRMCases } from "../../../../remote_access/crm/cases";
import { handleGetCRMopportunities } from "../../../../remote_access/crm/opportunities";
import TopHeader from "../../../layouts/top_header";
import SideNav from "../../../layouts/SideNav";
import Divider from "../../../../commons/divider";

function EditCRMAccount(props) {
  const { company, id } = props.match.params;

  const [options, setOptions] = useState({
    contactOptions: [],
    leadOptions: []
  });
  const [account, setAccount] = useState({
    assigned_to: [],
    name: "",
    phone: "",
    email: "",
    industry: null,
    billing_address: {
      address_line: "",
      country: "",
      state: "",
      city: "",
      street: "",
      postcode: ""
    },
    description: "",
    account_tags: "",
    status: null,
    contacts: [],
    leads: []
  });
  const [related, setRelated] = useState({
    contacts: [],
    opportunities: [],
    cases: []
  });

  useEffect(() => {
    const getOptions = async () => {
      let contactResults = await handleGetCRMContacts({
        company_id: company
      });
      let leadResults = await handleGetCRMleads({ company_id: company });
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

  useEffect(() => {
    const getAccountInstance = async () => {
      const response = await handleGetCRMAccount({
        company_id: company,
        instance_id: id
      });
      if (response.ok) {
        setAccount(response.result);
      } else {
        return response;
      }
    };
    getAccountInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async values => {
    const response = await handleEditCRMAccount({
      company_id: company,
      instance_id: id,
      data: values
    });
    if (response.ok) {
      props.history.push(`/${company}/crm/accounts/`);
    } else {
      return response;
    }
  };

  const onCancel = () => {
    props.history.push(`/${company}/crm/accounts`);
  };

  const onCommentSubmit = async values => {
    values = { ...values, account: id };
    const response = await handleAddCRMComment({
      company_id: company,
      data: values
    });
    return response;
  };

  let attachmentRef = React.createRef(null);

  const onAttachmentSubmit = async values => {
    let formData = new FormData();

    formData.append("account", id);
    formData.append("attachment", attachmentRef.current.files[0]);
    const response = await handleAddCRMAttachment({
      company_id: company,
      data: formData
    });
    return response;
  };

  useEffect(() => {
    const getRelatedAttributes = async () => {
      const contactResponse = await handleGetCRMContacts({
        company_id: company,
        account: id
      });
      const caseResponse = await handleGetCRMCases({
        company_id: company,
        account: id
      });
      const oppportunityResponse = await handleGetCRMopportunities({
        company_id: company,
        account: id
      });
      if (contactResponse.ok) {
        setRelated(old => {
          return {
            ...old,
            contacts: contactResponse.result
          };
        });
      }
      if (caseResponse.ok) {
        setRelated(old => {
          return {
            ...old,
            cases: caseResponse.result
          };
        });
      }
      if (oppportunityResponse.ok) {
        setRelated(old => {
          return {
            ...old,
            opportunities: oppportunityResponse.result
          };
        });
      }
    };
    getRelatedAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headers = {
    contact: [
      { title: "Contact Name", key: "name" },
      { title: "Phone", key: "phone" },
      { title: "Email", key: "email" }
    ],
    case: [
      { title: "Name", key: "name" },
      { title: "Status", key: "status" },
      { title: "Priority", key: "priority" }
    ],
    opportunity: [
      { title: "Name", key: "name" },
      { title: "Stage", key: "stage" },
      { title: "Probability", key: "probability" }
    ]
  };

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
            <NavBarCRM company_id={company} />
            <PageTitle title="Edit Account" info="..." />
            <Content>
              <AccountForm
                account={account}
                onSubmit={onSubmit}
                onCancel={onCancel}
                options={options}
              />
              <AttachmentSection
                company_id={company}
                onAttachmentSubmit={onAttachmentSubmit}
                attachmentRef={attachmentRef}
                attr_type="account"
                attr_id={id}
              />
              <CommentSection
                onCommentSubmit={onCommentSubmit}
                company_id={company}
                attr_type="account"
                attr_id={id}
              />
              <ListRelated
                title="Contact"
                headers={headers.contact}
                data={related.contacts}
              />
              <ListRelated
                title="Opportunity"
                headers={headers.opportunity}
                data={related.opportunities}
              />
              <ListRelated title="Case" headers={headers.case} data={related.cases} />
              <div className="row">
                <Divider type={'without-border'}/>
              </div>
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditCRMAccount;
