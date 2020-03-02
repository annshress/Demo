import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../layouts/header";
import Content from "../../layouts/content";
import {
  handleGetUserDetails,
  HandleUpdateUserDetail,
  handleGetUsersDetails,
  HandleUpdateUserpicture,
  disableTwoFactorAuth,
  getRecoveryCode
} from "../../../remote_access/accounts/business_account";
import { handleRemoveSecurityQuestion } from "../../../remote_access/accounts/business_account/index";
import "./style.scss";
import NavBarBusinessAccount from "./navbarBusinessAccount";
import Personalization from "./personalization";
import Security from "./security";
import CompanyUsers from "./company_users";
import Payment from "./payment_gateway";
import AccountsUser from "./account_details";
import TopHeader from "../../layouts/top_header";
import SideNav from "../../layouts/SideNav";
import PageTitle from "../../layouts/page_title";

class BusinessAccount extends Component {
  company_id = this.props.company_id;

  state = {
    user: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      avatar: "",
      last_login: "",
      id: null,
      security_question: "",
      two_factor_auth: false
    },
    usernameError: "",
    employees: [],
    employeecount: null,
    urlParams: "",
    company: {
      name: ""
    }
    //WE can increase fields according to response
  };

  handleChange = async e => {
    var updateuser = this.state.user;
    let usernew = {};
    usernew[e.target.name] = e.target.value;
    usernew["id"] = this.state.user.id;
    delete usernew["avatar"];

    const resp = await HandleUpdateUserDetail({
      company: this.company_id,
      user: usernew
    });

    if (resp.ok) {
      let user2 = resp.result;
      user2["avatar"] = updateuser.avatar;
      user2["id"] = updateuser.id;
      this.setState({ usernameError: "" });
      this.setState({ user: user2 });
    } else {
      console.log(resp);
    }
  };

  async componentDidMount() {
    this.getUserDetails();
    this.getUserList();
  }

  redirectToSubscription = () => {
    this.props.history.push("/company/register/subscribe/");
  };

  redirectToPayplan = () => {
    this.props.history.push("/company/register/payplan/");
  };

  disableTwoFactorAuth = async () => {
    await disableTwoFactorAuth();
  };
  disableSecurityQuestion = async () => {
    await handleRemoveSecurityQuestion({
      company: this.company_id,
      security_question: this.state.user.security_question
    });
  };

  getRecoveryCode = async () => {
    const response = await getRecoveryCode();
    if (response.ok) {
      alert(
        `Your new backup code is **${response.result.backup_code}**. Store it safely!`
      );
    } else {
      console.log("err", response);
    }
  };

  getUserDetails = async () => {
    const response = await handleGetUserDetails({ company: this.company_id });

    if (response.ok) {
      let user1 = response.result;
      this.setState({ user: user1 });
    } else {
      return response;
    }
  };

  getUserList = async () => {
    const responseemployee = await handleGetUsersDetails({
      company_id: this.company_id,
      urlParams: this.state.urlParams
    });

    if (responseemployee.ok) {
      this.setState({
        employees: responseemployee.result,
        employeecount: responseemployee.result.count
      });
    }
  };

  imageRef = React.createRef(null);

  handleFileChange = async event => {
    let formData = new FormData();
    formData.append("id", this.state.user.id);
    formData.append("avatar", this.imageRef.current.files[0]);

    const resp = await HandleUpdateUserpicture({
      company: this.company_id,
      user_id: this.state.user.id,
      user: formData
    });

    if (resp.ok) {
      let user2 = resp.result;
      this.setState({ user: user2 });
    } else {
      console.log(resp);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header title="Business Account | Settings" />
        <TopHeader />
        <div className={"container-fluid container-business-settings"}>
          <div className={"row"}>
            <div className={"col-2 col-side-nav"}>
              <SideNav
                type={"business-application"}
                company={this.company_id}
              />
            </div>
            <div className={"col-10 col-main-content"}>
              <NavBarBusinessAccount company_id={this.company_id} />
              <PageTitle
                title="Settings"
                info="Below you can change settings."
              />
              <Content isBgWhite={false}>
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <Personalization
                          error={this.state.usernameError}
                          change={this.handleChange}
                          user={this.state.user}
                          imageRef={this.imageRef}
                          handleFileChange={this.handleFileChange}
                          getUserDetails={this.getUserDetails}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <CompanyUsers
                          employees={this.state.employees}
                          user={this.state.user}
                          companyId={this.company_id}
                          getUserList={this.getUserList}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <AccountsUser
                          company={this.state.company}
                          user={this.state.user}
                          getUserDetails={this.getUserDetails}
                          account={this.props.account}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <Security
                          company_id={this.company_id}
                          user={this.state.user}
                          disableTwoFactorAuth={this.disableTwoFactorAuth}
                          getRecoveryCode={this.getRecoveryCode}
                          disableSecurityQuestion={this.disableSecurityQuestion}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Payment
                          user={this.state.user}
                          company_id={this.props.company_id}
                          redirectToSubscription={this.redirectToSubscription}
                          redirectToPayplan={this.redirectToPayplan}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Content>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    company_id: state.account.company_id,
    account: state.account
  };
}

export default connect(mapStateToProps)(BusinessAccount);
