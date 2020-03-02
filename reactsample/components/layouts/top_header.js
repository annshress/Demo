import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Offline, Online } from "react-detect-offline";
import "./top_header.scss";
import iconUnifiedLogo from "../../assets/img/unified-logo.png";
import { ACCOUNT_LOGOUT } from "../../store/actionTypes";
import defaultImg from "../../assets/img/False.jpg";

const TopHeader = props => {
  const logoutUser = e => {
    e.preventDefault();
    props.logout();
    props.history.push("/account/login");
  };

  const gotoWorkplace = e => {
    e.preventDefault();

    props.history.push("/" + props.user.company_id + "/business/applications");
  };

  return (
    <React.Fragment>
      <div className="">
        <div className="alert-warning text-center">
          <Offline>
            Please Check your Internet Connection, you are offline...
          </Offline>
        </div>
      </div>
      <div className="container-fluid top-header">
        <div className="row">
          <div className="col-2">
            <div className="user_box">
              <div className="user_img">
                {props.user.avatar && <img src={props.user.avatar} alt="" />}
                {!props.user.avatar && <img src={defaultImg} alt="" />}
              </div>
              <div className="user_detail">
                {props.user && (props.user.first_name || props.user.last_name) && (
                  <React.Fragment>
                    <span className="user_name">
                      {props.user.first_name} {props.user.last_name}
                    </span>
                    <br />
                  </React.Fragment>
                )}
                <span className="user_id">
                  User ID: {props.user && props.user.username}
                </span>
                <br />
                <a href={"/"} className="logout" onClick={e => logoutUser(e)}>
                  Logout
                </a>
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="search-box">
              <form action="">
                <input
                  type="text"
                  placeholder="Search through apps, feeds, reports and more..."
                  name=""
                />
                >
              </form>
            </div>
          </div>
          <div className="col-3">
            <div className="top_right_img">
              <a href="/" onClick={gotoWorkplace}>
                <img src={iconUnifiedLogo} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const stateToProps = state => {
  return {
    user: state.account
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: ACCOUNT_LOGOUT })
  };
};

export default withRouter(
  connect(
    stateToProps,
    mapDispatchToProps
  )(TopHeader)
);
