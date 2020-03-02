import React from "react";
import {connect} from "react-redux";

import CompanyRegisterForm from "./registerForm";
import AccountLayout from "../../layouts/account";

import { handleRegister } from "../../../remote_access/company/company";
import UnifiedWorkplaceLogo from "../../../assets/img/unified_workplace.png";
import Divider from "../../../commons/divider";
import {ACCOUNT_COMPANY_REGISTRATION_SUCCESS} from "../../../store/actionTypes";

function Company(props) {
  const onSubmit = async values => {
    const response = await handleRegister({ data: values });
    console.log(response);
    if (response.ok) {
      props.companyRegister({company_id: response.result.id});
      alert("Your company is waiting for verification!");
      props.history.push('/company/register/subscribe/');
    } else {
      return response;
    }
  };

  return (
    <AccountLayout>
      <React.Fragment>
        <div className="row row-logo">
          <div className="col-12">
            <img src={UnifiedWorkplaceLogo} alt="" />
          </div>
        </div>
        <div className="row">
          <Divider type={'blank'}/>
        </div>
        <div className="row">
          <div className="col-12">
            <h2>Company Registration</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut</p>
          </div>
        </div>
        <CompanyRegisterForm onSubmit={onSubmit} />
      </React.Fragment>
    </AccountLayout>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    companyRegister: (data) => dispatch({ type: ACCOUNT_COMPANY_REGISTRATION_SUCCESS, payload: data })
  }
};

export default connect(null, mapDispatchToProps)(Company);
